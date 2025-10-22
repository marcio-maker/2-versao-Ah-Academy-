// app.js - Aha! Academy Mobile App - VERSÃO FINAL COMPLETA (Corrigido Dark Mode)
class AhaApp {
    constructor() {
        this.currentScreen = 'home';
        this.carouselInterval = null;
        this.currentCarouselIndex = 0;
        
        // CORREÇÃO 1: Inicializa userSettings no constructor para evitar erros
        this.userSettings = JSON.parse(localStorage.getItem('ahaUserSettings')) || {
            profile: {},
            preferences: {
                darkMode: false // Default
            }
        };

        this.userProgress = JSON.parse(localStorage.getItem('ahaProgress')) || {
            completedLessons: [],
            lastWatched: null,
            progressPercentage: 0,
            totalStudyTime: 0
        };
    }

    init() {
        console.log('🚀 Inicializando Aha! Academy...');

        this.setupEventListeners();
        this.loadContent();
        this.initializeComponents();
        this.initializeCarousel();
        this.setupPWAInstall();
        this.setupConnectionMonitor();
        this.hideLoading();
        this.updateProgressUI();
        
        // CORREÇÃO: loadSettings e applyDarkMode já estavam aqui, o que é ótimo!
        this.loadSettings();
        this.applyDarkMode();

        console.log('✅ Aha! Academy inicializada com sucesso!');
    }

    setupEventListeners() {
        // Menu toggle
        document.getElementById('menuToggle').addEventListener('click', () => this.toggleSidebar());
        document.getElementById('closeSidebar').addEventListener('click', () => this.toggleSidebar(false));
        document.getElementById('sidebarOverlay').addEventListener('click', () => this.toggleSidebar(false));

        // Navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const screen = item.getAttribute('data-screen');
                this.navigateTo(screen);
                this.toggleSidebar(false);
            });
        });

        // Quick access navigation
        document.querySelectorAll('[data-navigate]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const screen = link.getAttribute('data-navigate');
                this.navigateTo(screen);
            });
        });

        // Course filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterCourses(btn.getAttribute('data-filter'));
            });
        });

        // Contact form
        document.getElementById('contact-form')?.addEventListener('submit', (e) => this.handleContactSubmit(e));

        // Carousel controls
        const carousel = document.getElementById('hero-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.pauseCarousel());
            carousel.addEventListener('mouseleave', () => this.startCarousel());
        }

        // Botões de navegação de aulas
        document.getElementById('prev-lesson')?.addEventListener('click', () => this.navigateLesson('prev'));
        document.getElementById('next-lesson')?.addEventListener('click', () => this.navigateLesson('next'));

        // Botões de velocidade do vídeo
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const speed = e.target.getAttribute('data-speed');
                this.changeVideoSpeed(speed);
            });
        });
        
        // CORREÇÃO 2: Adiciona o Event Listener para o switch principal do Dark Mode
        const darkModeToggle = document.getElementById('darkModeToggle'); // Assumindo este é o ID do switch
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', (e) => {
                this.toggleDarkMode(e.target.checked); 
            });
        }
        
        // CORREÇÃO 2.1: Adiciona o Event Listener para o checkbox de configurações
        const darkModeConfigCheckbox = document.getElementById('dark-mode'); 
        if (darkModeConfigCheckbox) {
            darkModeConfigCheckbox.addEventListener('change', (e) => {
                this.toggleDarkMode(e.target.checked); 
                // A ação de salvar será refeita ao clicar no botão 'save-settings-btn', 
                // mas a interface já atualiza aqui.
            });
        }


        // Botões de cursos
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-curso-preview')) {
                e.preventDefault();
                const courseId = e.target.closest('.btn-curso-preview').getAttribute('data-course');
                this.showCoursePreview(courseId);
            }

            if (e.target.closest('.curso-card .btn')) {
                e.preventDefault();
                const courseId = e.target.closest('.curso-card .btn').getAttribute('data-course');
                this.enrollInCourse(courseId);
            }
        });

        // Botões de planos
        document.addEventListener('click', (e) => {
            if (e.target.closest('.plano-card .btn')) {
                const planName = e.target.closest('.plano-card .btn').getAttribute('data-plan');
                this.selectPlan(planName);
            }
        });

        // Logo click - voltar ao início
        document.getElementById('logoHome').addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateTo('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.toggleSidebar(false);
        });

        // Mobile navigation
        this.initMobileNavigation();
    }

    initMobileNavigation() {
        const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

        mobileNavItems.forEach(item => {
            if (item.classList.contains('menu-toggle')) {
                item.addEventListener('click', () => this.toggleSidebar());
                return;
            }

            item.addEventListener('click', (e) => {
                e.preventDefault();

                // Remove active de todos os itens
                mobileNavItems.forEach(navItem => {
                    navItem.classList.remove('active');
                });

                // Adiciona active ao item clicado
                item.classList.add('active');

                // Muda de tela
                const screen = item.getAttribute('data-screen');
                this.navigateTo(screen);
            });
        });
    }

    // ========== CAROUSEL SYSTEM ==========
    initializeCarousel() {
        this.carouselItems = document.querySelectorAll('.carousel-item');
        this.carouselDots = document.querySelectorAll('.carousel-dot');

        if (this.carouselItems.length > 0) {
            this.showCarouselItem(0);
            this.startCarousel();

            // Dots clicáveis
            this.carouselDots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    this.showCarouselItem(index);
                    this.restartCarousel();
                });
            });
        }
    }

    showCarouselItem(index) {
        this.carouselItems.forEach(item => item.classList.remove('active'));
        this.carouselDots.forEach(dot => dot.classList.remove('active'));

        this.carouselItems[index].classList.add('active');
        this.carouselDots[index].classList.add('active');
        this.currentCarouselIndex = index;
    }

    nextCarousel() {
        let nextIndex = (this.currentCarouselIndex + 1) % this.carouselItems.length;
        this.showCarouselItem(nextIndex);
    }

    startCarousel() {
        this.stopCarousel();
        this.carouselInterval = setInterval(() => this.nextCarousel(), 5000);
    }

    pauseCarousel() {
        this.stopCarousel();
    }

    stopCarousel() {
        if (this.carouselInterval) {
            clearInterval(this.carouselInterval);
            this.carouselInterval = null;
        }
    }

    restartCarousel() {
        this.stopCarousel();
        this.startCarousel();
    }

    // ========== NAVIGATION SYSTEM ==========
    toggleSidebar(show) {
        const sidebar = document.getElementById('appSidebar');
        const overlay = document.getElementById('sidebarOverlay');

        if (typeof show === 'undefined') {
            show = !sidebar.classList.contains('active');
        }

        if (show) {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    navigateTo(screen) {
        console.log('Navegando para:', screen);

        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-screen') === screen) {
                item.classList.add('active');
            }
        });

        // Update mobile navigation
        this.updateMobileNav(screen);

        // Hide all screens
        document.querySelectorAll('.app-screen').forEach(screenEl => {
            screenEl.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.getElementById(`${screen}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screen;

            // Scroll to top
            targetScreen.scrollTop = 0;
        }

        // Atualizar dashboard se for a tela
        if (screen === 'dashboard') {
            this.updateDashboard();
        }

        // Atualizar navegação de aulas
        if (screen === 'plataforma') {
            setTimeout(() => this.updateNavigationButtons(), 100);
        }

        // ADICIONAR CONFIGURAÇÕES APENAS UMA VEZ
        if (screen === 'configuracoes') {
            setTimeout(() => this.setupConfiguracoes(), 100);
        }
        
        // Salvar a última tela vista
        this.userSettings.lastScreen = screen;
        localStorage.setItem('ahaUserSettings', JSON.stringify(this.userSettings));
    }

    updateMobileNav(screen) {
        const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
        mobileNavItems.forEach(item => {
            const itemScreen = item.getAttribute('data-screen');
            if (itemScreen === screen) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // ========== DARK MODE SYSTEM - CORRIGIDO ==========
    
    // CORREÇÃO 3: Método dedicado para aplicar a classe ao corpo
    applyDarkMode() {
        const isDark = this.userSettings?.preferences?.darkMode;
        
        if (isDark) {
            document.body.classList.add('dark-mode');
            console.log('🌙 Modo escuro aplicado');
        } else {
            document.body.classList.remove('dark-mode');
            console.log('☀️ Modo claro aplicado');
        }
        
        // Sincroniza o switch da sidebar/cabeçalho com o estado
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.checked = isDark;
        }
        
        // Sincroniza o checkbox da tela de configurações
        const darkModeConfigCheckbox = document.getElementById('dark-mode');
        if (darkModeConfigCheckbox) {
            darkModeConfigCheckbox.checked = isDark;
        }
    }
    
    // CORREÇÃO 4: Novo método unificado para alternar e salvar
    toggleDarkMode(enable) {
        // Atualiza a propriedade no objeto de configurações
        if (!this.userSettings.preferences) {
            this.userSettings.preferences = {};
        }
        this.userSettings.preferences.darkMode = enable;

        // Salva imediatamente no localStorage
        localStorage.setItem('ahaUserSettings', JSON.stringify(this.userSettings)); 
        
        // Aplica as mudanças no CSS
        this.applyDarkMode(); 
        
        this.showNotification(`Modo Escuro: ${enable ? 'Ativado' : 'Desativado'}`, 'success');
    }

    // ========== CONTENT LOADING ==========
    loadContent() {
        this.loadCourses();
        this.loadPlans();
        this.loadTestimonials();
        this.loadPlatformModules();
    }

    loadCourses() {
        const courses = [
            {
                id: 1,
                title: "Liderança Consciente",
                category: "lideranca",
                description: "Desenvolva habilidades de liderança com base em autoconhecimento e inteligência emocional. Transforme sua forma de liderar equipes.",
                price: "R$ 297",
                free: false,
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                rating: 4.8,
                students: 1247,
                duration: "8h",
                instructor: "Dra. Ana Silva"
            },
            {
                id: 2,
                title: "Comunicação Não Violenta",
                category: "desenvolvimento",
                description: "Aprenda a se comunicar de forma autêntica e empática em todos os contextos. Melhore seus relacionamentos profissionais e pessoais.",
                price: "R$ 197",
                free: false,
                image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                rating: 4.9,
                students: 893,
                duration: "6h",
                instructor: "Prof. Carlos Santos"
            },
            {
                id: 3,
                title: "Gestão de Mudanças",
                category: "empresarial",
                description: "Estratégias para liderar processos de transformação organizacional. Guie sua equipe através de transições com confiança.",
                price: "R$ 347",
                free: false,
                image: "https://images.unsplash.com/photo-1552664688-cf412ec27db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                rating: 4.7,
                students: 567,
                duration: "10h",
                instructor: "Dr. Roberto Lima"
            },
            {
                id: 4,
                title: "Introdução à Teoria U",
                category: "lideranca",
                description: "Fundamentos da metodologia para inovação e liderança sistêmica. Aprenda a liderar a partir do futuro emergente.",
                price: "Gratuito",
                free: true,
                image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                rating: 4.6,
                students: 2310,
                duration: "4h",
                instructor: "Dra. Maria Oliveira"
            }
        ];

        const container = document.getElementById('cursos-container');
        if (container) {
            container.innerHTML = courses.map(course => `
                <div class="curso-card" data-category="${course.category}">
                    <div class="curso-image">
                        <img src="${course.image}" alt="${course.title}" loading="lazy">
                        ${course.free ? '<div class="curso-badge gratuito">Gratuito</div>' : ''}
                        <div class="curso-overlay">
                            <button class="btn-curso-preview" data-course="${course.id}">
                                <i class="fas fa-play"></i> Preview
                            </button>
                        </div>
                    </div>
                    <div class="curso-content">
                        <div class="curso-category">${this.getCategoryName(course.category)}</div>
                        <h3 class="curso-title">${course.title}</h3>
                        <p class="curso-description">${course.description}</p>
                        <div class="curso-meta">
                            <div class="curso-rating">
                                <i class="fas fa-star"></i> ${course.rating}
                                <span class="curso-students">(${course.students})</span>
                            </div>
                            <span class="curso-duration"><i class="fas fa-clock"></i> ${course.duration}</span>
                        </div>
                        <div class="curso-instructor">
                            <i class="fas fa-user"></i> ${course.instructor}
                        </div>
                        <div class="curso-footer">
                            <span class="curso-price ${course.free ? 'curso-free' : ''}">${course.price}</span>
                            <button class="btn btn-success btn-sm" data-course="${course.id}">
                                ${course.free ? 'Inscrever-se' : 'Comprar'}
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    getCategoryName(category) {
        const categories = {
            'lideranca': 'Liderança',
            'desenvolvimento': 'Desenvolvimento Pessoal',
            'empresarial': 'Empresarial',
            'gratuito': 'Gratuito'
        };
        return categories[category] || category;
    }

    filterCourses(filter) {
        const courses = document.querySelectorAll('.curso-card');
        courses.forEach(course => {
            if (filter === 'all') {
                course.style.display = 'block';
            } else if (filter === 'gratuito') {
                const isFree = course.querySelector('.curso-badge.gratuito');
                course.style.display = isFree ? 'block' : 'none';
            } else {
                const category = course.getAttribute('data-category');
                course.style.display = category === filter ? 'block' : 'none';
            }
        });
    }

    showCoursePreview(courseId) {
        this.showNotification(`🎬 Preview do curso ${courseId} aberto!`, 'info');

        setTimeout(() => {
            this.showNotification('✅ Preview finalizado. Gostou do curso?', 'success');
        }, 2000);
    }

    enrollInCourse(courseId) {
        const courseElement = document.querySelector(`[data-course="${courseId}"]`);
        if (courseElement) {
            const courseCard = courseElement.closest('.curso-card');
            const courseTitle = courseCard.querySelector('.curso-title').textContent;
            const isFree = courseCard.querySelector('.curso-badge.gratuito');

            if (confirm(`Deseja ${isFree ? 'inscrever-se' : 'comprar'} no curso "${courseTitle}"?`)) {
                this.showNotification(`🎉 Parabéns! Curso "${courseTitle}" adicionado à sua conta!`, 'success');

                setTimeout(() => {
                    this.navigateTo('plataforma');
                }, 1500);
            }
        }
    }

    loadPlans() {
        const plans = [
            {
                name: "Básico",
                price: "R$ 97",
                period: "por mês",
                features: [
                    "Acesso a 5 cursos",
                    "Certificados digitais",
                    "Comunidade online",
                    "Suporte por email",
                    "7 dias grátis"
                ],
                featured: false
            },
            {
                name: "Premium",
                price: "R$ 197",
                period: "por mês",
                features: [
                    "Acesso a todos os cursos",
                    "Certificados digitais",
                    "Comunidade online",
                    "Suporte prioritário",
                    "Mentorias em grupo",
                    "Conteúdo exclusivo",
                    "30 dias grátis"
                ],
                featured: true
            },
            {
                name: "Empresarial",
                price: "Sob consulta",
                period: "personalizado",
                features: [
                    "Acesso ilimitado para equipe",
                    "Dashboard administrativo",
                    "Relatórios de progresso",
                    "Consultoria personalizada",
                    "Treinamentos in company",
                    "Certificados corporativos"
                ],
                featured: false
            }
        ];

        const container = document.getElementById('planos-container');
        if (container) {
            container.innerHTML = plans.map(plan => `
                <div class="plano-card ${plan.featured ? 'featured' : ''}">
                    ${plan.featured ? '<div class="plano-badge">Mais Popular</div>' : ''}
                    <div class="plano-header">
                        <h3 class="plano-name">${plan.name}</h3>
                        <div class="plano-price">${plan.price}</div>
                        <div class="plano-period">${plan.period}</div>
                    </div>
                    <ul class="plano-features">
                        ${plan.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                    </ul>
                    <button class="btn ${plan.featured ? 'btn-premium' : 'btn-success'} btn-block" data-plan="${plan.name}">
                        ${plan.name === 'Empresarial' ? 'Falar com Consultor' : 'Começar Agora'}
                    </button>
                </div>
            `).join('');
        }
    }

    selectPlan(planName) {
        if (planName === 'Empresarial') {
            this.showNotification('📞 Entraremos em contato em até 24h! Nossa equipe vai entender suas necessidades.', 'info');
        } else {
            this.showNotification(`🎉 Excelente escolha! Plano ${planName} selecionado. Redirecionando...`, 'success');

            setTimeout(() => {
                this.navigateTo('cursos');
            }, 2000);
        }
    }

    loadTestimonials() {
        const testimonials = [
            {
                text: "A Aha! Academy transformou minha forma de liderar. As metodologias são práticas e aplicáveis no dia a dia. Em 3 meses, minha equipe teve um aumento de 40% na produtividade!",
                author: "Maria Silva",
                role: "Gerente de Projetos",
                company: "Tech Solutions",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
                rating: 5
            },
            {
                text: "Os cursos de comunicação não violenta melhoraram significativamente meus relacionamentos profissionais e pessoais. Finalmente consegui mediar conflitos na minha equipe!",
                author: "João Santos",
                role: "Coordenador",
                company: "Educa Brasil",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
                rating: 5
            }
        ];

        const container = document.getElementById('testimonials-container');
        if (container) {
            container.innerHTML = testimonials.map(testimonial => `
                <div class="testimonial-card">
                    <div class="testimonial-rating">
                        ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}
                    </div>
                    <p class="testimonial-text">"${testimonial.text}"</p>
                    <div class="testimonial-author">
                        <div class="author-avatar">
                            <img src="${testimonial.avatar}" alt="${testimonial.author}">
                        </div>
                        <div class="author-info">
                            <h4>${testimonial.author}</h4>
                            <p>${testimonial.role} - ${testimonial.company}</p>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    // ========== PLATFORM & LEARNING SYSTEM ==========
    loadPlatformModules() {
        const modules = [
            {
                title: "Módulo 1: Fundamentos da Liderança Consciente",
                lessons: [
                    {
                        title: "Introdução à Liderança Consciente",
                        duration: "15min",
                        video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                        description: "Conceitos fundamentais da liderança consciente e seus impactos na gestão de equipes. Entenda por que a autoconsciência é o primeiro passo para uma liderança eficaz.",
                        resources: ["PDF: Ebook Liderança Consciente", "Exercício: Autoavaliação", "Checklist: Princípios Básicos"]
                    },
                    {
                        title: "Autoconhecimento e Liderança",
                        duration: "20min",
                        video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                        description: "Como o autoconhecimento é a base para uma liderança eficaz e transformadora. Técnicas práticas para desenvolver sua autoconsciência.",
                        resources: ["Questionário: Perfil de Liderança", "Template: Diário de Autoconhecimento"]
                    }
                ]
            }
        ];

        const container = document.getElementById('module-list');
        if (container) {
            container.innerHTML = modules.map(module => `
                <li class="module-section">
                    <div class="module-title">${module.title}</div>
                    <ul>
                        ${module.lessons.map((lesson, index) => {
                const isCompleted = this.userProgress.completedLessons.includes(lesson.title);
                const isLastWatched = this.userProgress.lastWatched === lesson.title;
                return `
                            <li class="module-item ${isCompleted ? 'completed' : ''} ${isLastWatched ? 'last-watched' : ''}" 
                                data-video="${lesson.video}" 
                                data-description="${lesson.description}"
                                data-resources='${JSON.stringify(lesson.resources)}'>
                                <div class="lesson-info">
                                    <div class="lesson-icon">
                                        <i class="fas fa-${isCompleted ? 'check-circle' : 'play-circle'}"></i>
                                    </div>
                                    <div class="lesson-details">
                                        <div class="module-title">${lesson.title}</div>
                                        <div class="module-duration">${lesson.duration}</div>
                                    </div>
                                </div>
                                ${isCompleted ? '<div class="lesson-check"><i class="fas fa-check"></i></div>' : ''}
                                ${isLastWatched ? '<div class="last-watched-badge">Continuar</div>' : ''}
                            </li>
                        `}).join('')}
                    </ul>
                </li>
            `).join('');

            // Add lesson click handlers
            document.querySelectorAll('.module-item').forEach(item => {
                item.addEventListener('click', () => {
                    document.querySelectorAll('.module-item').forEach(i => i.classList.remove('active'));
                    item.classList.add('active');

                    const title = item.querySelector('.module-title').textContent;
                    const video = item.getAttribute('data-video');
                    const description = item.getAttribute('data-description');
                    const resources = JSON.parse(item.getAttribute('data-resources'));
                    this.showLesson(title, video, description, resources);
                    this.updateNavigationButtons();
                });
            });

            // Auto-select first lesson
            const firstLesson = document.querySelector('.module-item');
            if (firstLesson) {
                firstLesson.click();
            }
        }
    }

    showLesson(title, videoUrl, description, resources) {
        const videoPlaceholder = document.getElementById('video-placeholder');
        const videoPlayer = document.getElementById('video-player');
        const lessonActions = document.getElementById('lesson-actions');

        if (videoPlaceholder && videoPlayer && lessonActions) {
            videoPlaceholder.style.display = 'none';
            videoPlayer.style.display = 'block';
            lessonActions.style.display = 'flex';

            // Update YouTube video
            const videoContainer = document.getElementById('youtube-video');
            if (videoContainer) {
                videoContainer.innerHTML = `
                    <iframe 
                        src="${videoUrl}" 
                        title="${title}"
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                `;
            }

            document.getElementById('lesson-title').textContent = title;
            document.getElementById('lesson-description').textContent = description;

            // Atualizar recursos da aula
            this.showLessonResources(resources);

            // Marcar como última assistida
            this.userProgress.lastWatched = title;
            this.saveProgress();
        }
    }

    showLessonResources(resources) {
        const resourcesContainer = document.getElementById('lesson-resources');
        if (resourcesContainer) {
            if (resources && resources.length > 0) {
                resourcesContainer.innerHTML = `
                    <h4>📚 Materiais desta aula:</h4>
                    <ul>
                        ${resources.map(resource => `<li><i class="fas fa-download"></i> ${resource}</li>`).join('')}
                    </ul>
                `;
                resourcesContainer.style.display = 'block';
            } else {
                resourcesContainer.style.display = 'none';
            }
        }
    }

    markLessonAsWatched(lessonTitle) {
        const lessonItem = Array.from(document.querySelectorAll('.module-item'))
            .find(item => item.querySelector('.module-title').textContent === lessonTitle);

        if (lessonItem && !lessonItem.classList.contains('completed')) {
            lessonItem.classList.add('completed');
            const lessonIcon = lessonItem.querySelector('.lesson-icon i');
            if (lessonIcon) {
                lessonIcon.className = 'fas fa-check-circle';
            }

            if (!lessonItem.querySelector('.lesson-check')) {
                lessonItem.innerHTML += '<div class="lesson-check"><i class="fas fa-check"></i></div>';
            }

            // Atualizar progresso
            if (!this.userProgress.completedLessons.includes(lessonTitle)) {
                this.userProgress.completedLessons.push(lessonTitle);
                this.userProgress.totalStudyTime += 0.5;
                this.updateProgress();
                this.saveProgress();
                this.updateProgressUI();

                this.showNotification(`✅ Aula "${lessonTitle}" concluída!`, 'success');
            }
        }
    }

    // ========== PROGRESS SYSTEM ==========
    updateProgress() {
        const totalLessons = document.querySelectorAll('.module-item').length;
        const completedLessons = this.userProgress.completedLessons.length;
        this.userProgress.progressPercentage = totalLessons > 0 ?
            Math.round((completedLessons / totalLessons) * 100) : 0;
    }

    updateProgressUI() {
        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');

        if (progressBar && progressText) {
            progressBar.style.width = `${this.userProgress.progressPercentage}%`;
            progressText.textContent = `${this.userProgress.progressPercentage}% completo`;
        }

        // Atualizar progresso na plataforma também
        const platformProgress = document.querySelector('.course-progress .progress-text');
        if (platformProgress) {
            platformProgress.textContent = `${this.userProgress.progressPercentage}% completo`;
        }

        // Atualizar dashboard
        this.updateDashboard();
    }

    updateDashboard() {
        const dashboard = document.getElementById('dashboard-content');
        if (dashboard) {
            const hoursStudied = (this.userProgress.totalStudyTime).toFixed(1);

            dashboard.innerHTML = `
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <i class="fas fa-play-circle"></i>
                        <h3>${this.userProgress.progressPercentage}%</h3>
                        <p>Progresso Total</p>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-check-circle"></i>
                        <h3>${this.userProgress.completedLessons.length}</h3>
                        <p>Aulas Concluídas</p>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-clock"></i>
                        <h3>${hoursStudied}h</h3>
                        <p>Horas Estudadas</p>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-trophy"></i>
                        <h3>${Math.floor(this.userProgress.progressPercentage / 25)}</h3>
                        <p>Conquistas</p>
                    </div>
                </div>
                
                <div class="continue-learning">
                    <h3>Continuar Aprendendo</h3>
                    ${this.userProgress.lastWatched ? `
                        <div class="continue-card">
                            <i class="fas fa-play-circle"></i>
                            <div class="continue-info">
                                <h4>${this.userProgress.lastWatched}</h4>
                                <p>Continue de onde parou</p>
                            </div>
                            <button class="btn btn-success" onclick="ahaApp.navigateTo('plataforma')">
                                Continuar
                            </button>
                        </div>
                    ` : '<p>Comece sua primeira aula na plataforma!</p>'}
                </div>
            `;
        }
    }

    saveProgress() {
        localStorage.setItem('ahaProgress', JSON.stringify(this.userProgress));
    }

    // ========== LESSON NAVIGATION ==========
    navigateLesson(direction) {
        const currentLesson = document.querySelector('.module-item.active');
        if (!currentLesson) return;

        const allLessons = Array.from(document.querySelectorAll('.module-item'));
        const currentIndex = allLessons.indexOf(currentLesson);
        let nextIndex;

        if (direction === 'next') {
            nextIndex = currentIndex < allLessons.length - 1 ? currentIndex + 1 : 0;
        } else {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : allLessons.length - 1;
        }

        allLessons[nextIndex].click();
        this.showNotification(`📖 ${direction === 'next' ? 'Próxima' : 'Anterior'} aula carregada`, 'info');
    }

    updateNavigationButtons() {
        const currentLesson = document.querySelector('.module-item.active');
        const allLessons = Array.from(document.querySelectorAll('.module-item'));
        const currentIndex = allLessons.indexOf(currentLesson);

        const prevBtn = document.getElementById('prev-lesson');
        const nextBtn = document.getElementById('next-lesson');

        if (prevBtn) {
            prevBtn.style.opacity = currentIndex > 0 ? '1' : '0.5';
            prevBtn.disabled = currentIndex === 0;
        }

        if (nextBtn) {
            nextBtn.style.opacity = currentIndex < allLessons.length - 1 ? '1' : '0.5';
            nextBtn.disabled = currentIndex === allLessons.length - 1;
        }
    }

    changeVideoSpeed(speed) {
        this.showNotification(`🎚️ Velocidade alterada para ${speed}x`, 'info');
    }

    // ========== UTILITIES ==========
    initializeComponents() {
        // Inicializar stats animation
        this.initializeStats();
    }

    initializeStats() {
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const finalValue = stat.textContent;
            stat.textContent = '0';

            let current = 0;
            const increment = parseInt(finalValue) / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= parseInt(finalValue)) {
                    stat.textContent = finalValue;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 20);
        });
    }

    // ========== NOTIFICATION SYSTEM ==========
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // ========== CONTACT FORM ==========
    handleContactSubmit(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            subject: document.getElementById('contact-subject').value,
            message: document.getElementById('contact-message').value
        };

        // Simular envio
        this.showNotification('📧 Mensagem enviada com sucesso! Entraremos em contato em até 24h.', 'success');
        e.target.reset();
    }

    // ========== PWA INSTALLATION ==========
    setupPWAInstall() {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;

            // Mostrar botão de instalação
            const installButton = document.createElement('button');
            installButton.className = 'install-pwa-btn';
            installButton.innerHTML = '<i class="fas fa-download"></i> Instalar App';
            installButton.style.cssText = `
                position: fixed;
                bottom: 80px;
                right: 20px;
                background: var(--primary-color);
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 25px;
                cursor: pointer;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                font-size: 14px;
            `;

            installButton.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    if (outcome === 'accepted') {
                        this.showNotification('🎉 App instalado com sucesso!', 'success');
                        installButton.remove();
                    }
                    deferredPrompt = null;
                }
            });

            document.body.appendChild(installButton);
        });
    }

    // ========== CONNECTION MONITOR ==========
    setupConnectionMonitor() {
        window.addEventListener('online', () => {
            this.showNotification('✅ Conexão restaurada', 'success');
        });

        window.addEventListener('offline', () => {
            this.showNotification('⚠️ Você está offline. Algumas funcionalidades podem não estar disponíveis.', 'warning');
        });
    }

    // ========== LOADING SYSTEM ==========
    hideLoading() {
        setTimeout(() => {
            const loading = document.getElementById('loading-screen');
            if (loading) {
                loading.style.opacity = '0';
                setTimeout(() => {
                    loading.style.display = 'none';
                }, 500);
            }
        }, 1500);
    }

    // ========== CONFIGURAÇÕES SYSTEM ==========
    setupConfiguracoes() {
        // Photo upload functionality
        const currentPhoto = document.querySelector('.current-photo');
        const photoInput = document.getElementById('photo-input');
        const takePhotoBtn = document.getElementById('take-photo-btn');
        const choosePhotoBtn = document.getElementById('choose-photo-btn');

        if (currentPhoto) {
            currentPhoto.addEventListener('click', () => photoInput.click());
        }

        if (photoInput) {
            photoInput.addEventListener('change', (e) => this.handlePhotoUpload(e));
        }

        if (takePhotoBtn) {
            takePhotoBtn.addEventListener('click', () => this.takePhoto());
        }

        if (choosePhotoBtn) {
            choosePhotoBtn.addEventListener('click', () => photoInput.click());
        }

        // Save settings
        const saveBtn = document.getElementById('save-settings-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveSettings());
        }

        // Reset settings
        const resetBtn = document.getElementById('reset-settings-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetSettings());
        }

        // Delete account
        const deleteBtn = document.getElementById('delete-account-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.confirmDeleteAccount());
        }

        // Export data
        const exportBtn = document.getElementById('export-data-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }

        // Load saved settings
        this.loadSettings();
    }

    handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                this.showNotification('❌ A imagem deve ter menos de 5MB', 'warning');
                return;
            }

            if (!file.type.startsWith('image/')) {
                this.showNotification('❌ Por favor, selecione uma imagem válida', 'warning');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const photoUrl = e.target.result;

                // Update photo in settings
                const currentPhoto = document.getElementById('current-user-photo');
                if (currentPhoto) {
                    currentPhoto.src = photoUrl;
                }

                // Update photo in sidebar
                const sidebarPhoto = document.querySelector('.user-avatar img');
                if (sidebarPhoto) {
                    sidebarPhoto.src = photoUrl;
                }

                // Save to localStorage
                this.userSettings = this.userSettings || { profile: {}, preferences: {} };
                this.userSettings.profilePhoto = photoUrl;
                localStorage.setItem('ahaUserSettings', JSON.stringify(this.userSettings));

                this.showNotification('✅ Foto de perfil atualizada com sucesso!', 'success');
            };
            reader.readAsDataURL(file);
        }
    }

    takePhoto() {
        this.showNotification('📸 Funcionalidade de câmera será implementada em breve!', 'info');
        // Em um app real, aqui você acessaria a câmera do dispositivo
        // navigator.mediaDevices.getUserMedia({ video: true })
    }

    saveSettings() {
        console.log('🔧 Salvando configurações...');

        // Get form values
        const userName = document.getElementById('user-name').value;
        const userEmail = document.getElementById('user-email').value;
        const userPhone = document.getElementById('user-phone').value;
        const userBio = document.getElementById('user-bio').value;

        // Get preferences
        const emailNotifications = document.getElementById('email-notifications').checked;
        const darkMode = document.getElementById('dark-mode').checked;
        const autoplay = document.getElementById('autoplay').checked;
        const profileVisibility = document.getElementById('profile-visibility').value;

        // Save settings
        this.userSettings = {
            profile: {
                name: userName,
                email: userEmail,
                phone: userPhone,
                bio: userBio
            },
            preferences: {
                emailNotifications,
                darkMode,
                autoplay,
                profileVisibility
            },
            profilePhoto: this.userSettings?.profilePhoto || document.getElementById('current-user-photo').src
        };

        localStorage.setItem('ahaUserSettings', JSON.stringify(this.userSettings));
        console.log('💾 Configurações salvas no localStorage');

        // Update sidebar user info
        const userDetails = document.querySelector('.user-details h3');
        if (userDetails) {
            userDetails.textContent = userName;
        }

        // CORREÇÃO: Chama o método unificado para aplicar/sincronizar o Dark Mode
        this.applyDarkMode();

        this.showNotification('✅ Configurações salvas com sucesso!', 'success');
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('ahaUserSettings');
        console.log('📖 Carregando configurações...', savedSettings);

        if (savedSettings) {
            this.userSettings = JSON.parse(savedSettings);

            // Load profile data
            if (this.userSettings.profile) {
                document.getElementById('user-name').value = this.userSettings.profile.name || '';
                document.getElementById('user-email').value = this.userSettings.profile.email || '';
                document.getElementById('user-phone').value = this.userSettings.profile.phone || '';
                document.getElementById('user-bio').value = this.userSettings.profile.bio || '';
            }

            // Load preferences
            const darkModeState = this.userSettings.preferences?.darkMode || false;
            
            if (this.userSettings.preferences) {
                document.getElementById('email-notifications').checked = this.userSettings.preferences.emailNotifications || false;
                document.getElementById('dark-mode').checked = darkModeState; // Sincroniza checkbox config
                document.getElementById('autoplay').checked = this.userSettings.preferences.autoplay || false;
                document.getElementById('profile-visibility').value = this.userSettings.preferences.profileVisibility || 'public';
            }

            // Load photo
            if (this.userSettings.profilePhoto) {
                document.getElementById('current-user-photo').src = this.userSettings.profilePhoto;
                const sidebarPhoto = document.querySelector('.user-avatar img');
                if (sidebarPhoto) {
                    sidebarPhoto.src = this.userSettings.profilePhoto;
                }
            }

            // CORREÇÃO: Aplica Dark Mode baseado no estado carregado
            this.applyDarkMode();

            // Navega para a última tela vista
            this.navigateTo(this.userSettings.lastScreen || 'home'); 

        } else {
            console.log('⚙️ Nenhuma configuração salva encontrada');
        }
    }

    resetSettings() {
        if (confirm('Tem certeza que deseja restaurar todas as configurações para os valores padrão?')) {
            localStorage.removeItem('ahaUserSettings');
            this.userSettings = {};

            // Reset form values
            document.getElementById('user-name').value = 'João Silva';
            document.getElementById('user-email').value = 'joao@email.com';
            document.getElementById('user-phone').value = '(11) 99999-9999';
            document.getElementById('user-bio').value = 'Apaixonado por aprendizado e desenvolvimento pessoal!';

            document.getElementById('email-notifications').checked = true;
            document.getElementById('dark-mode').checked = false;
            document.getElementById('autoplay').checked = true;
            document.getElementById('profile-visibility').value = 'public';

            // Reset photo
            const defaultPhoto = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80';
            document.getElementById('current-user-photo').src = defaultPhoto;
            const sidebarPhoto = document.querySelector('.user-avatar img');
            if (sidebarPhoto) {
                sidebarPhoto.src = defaultPhoto;
            }

            // Remove dark mode
            document.body.classList.remove('dark-mode');
            this.toggleDarkMode(false);

            this.showNotification('✅ Configurações restauradas com sucesso!', 'success');
        }
    }

    confirmDeleteAccount() {
        this.showNotification('❌ Funcionalidade de exclusão de conta em desenvolvimento', 'warning');
        // Em produção, aqui você mostraria um modal de confirmação
        // e faria uma requisição para a API para deletar a conta
    }

    exportData() {
        const userData = {
            profile: this.userSettings?.profile || {},
            progress: this.userProgress,
            courses: [], // Aqui viriam os cursos do usuário
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `aha-academy-data-${new Date().getTime()}.json`;
        link.click();

        this.showNotification('📊 Dados exportados com sucesso!', 'success');
    }
}

// ========== INITIALIZATION ==========
let ahaApp;

document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Inicializando Aha! Academy...');
    ahaApp = new AhaApp();
    ahaApp.init();
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('❌ Erro global capturado:', e.error);
});