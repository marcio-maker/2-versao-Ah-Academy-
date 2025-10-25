// app.js - Aha! Academy Mobile App - VERSÃO FINAL COMPLETA E CORRIGIDA
class AhaApp {
    constructor() {
        this.currentScreen = 'home';
        this.carouselInterval = null;
        this.currentCarouselIndex = 0;

        // Inicialização ROBUSTA de configurações
        const savedSettings = localStorage.getItem('ahaUserSettings');
        this.userSettings = savedSettings ? JSON.parse(savedSettings) : {
            profile: {
                name: "João Silva",
                email: "joao@email.com",
                phone: "(11) 99999-9999",
                bio: "Apaixonado por aprendizado e desenvolvimento pessoal!"
            },
            preferences: {
                darkMode: false,
                emailNotifications: true,
                autoplay: true,
                profileVisibility: 'public'
            },
            lastScreen: 'home'
        };

        // Sistema de progresso do usuário - INICIALIZAÇÃO CORRIGIDA
        const savedProgress = localStorage.getItem('ahaProgress');
        this.userProgress = savedProgress ? JSON.parse(savedProgress) : {
            completedLessons: [],
            lastWatched: null,
            progressPercentage: 0,
            totalStudyTime: 0,
            enrolledCourses: [], // GARANTIR que sempre existe
            achievements: []
        };

        // Garantir que enrolledCourses existe
        if (!this.userProgress.enrolledCourses) {
            this.userProgress.enrolledCourses = [];
        }

        // Dados dos cursos
        this.coursesData = [];
        this.currentLesson = null;
        this.currentCourse = null;
        this.studyStartTime = null;
    }

    init() {
        console.log('🚀 Inicializando Aha! Academy...');

        this.loadCoursesData();
        this.setupEventListeners();
        this.loadContent();
        this.initializeComponents();
        this.initializeCarousel();
        this.setupPWAInstall();
        this.setupConnectionMonitor();
        // this.setupServiceWorker(); // REMOVIDO - causa erro no localhost
        this.hideLoading();
        this.updateProgressUI();

        // Sistema Dark Mode
        this.loadSettings();
        this.applyDarkMode();

        // Navega para última tela salva
        setTimeout(() => {
            this.navigateTo(this.userSettings.lastScreen || 'home');
        }, 100);

        console.log('✅ Aha! Academy inicializada com sucesso!');
    }

    // ========== SISTEMA DE DADOS DOS CURSOS ==========
    // app.js - CORREÇÃO: Adicionando conteúdo completo para todas as aulas

    // ========== SISTEMA DE DADOS DOS CURSOS - ATUALIZADO ==========
    loadCoursesData() {
        this.coursesData = [
            {
                id: 1,
                title: "Liderança Consciente",
                category: "lideranca",
                description: "Desenvolva habilidades de liderança com base em autoconhecimento e inteligência emocional. Transforme sua forma de liderar equipes.",
                price: "R$ 297",
                originalPrice: "R$ 497",
                free: false,
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                rating: 4.8,
                students: 1247,
                duration: "8h",
                instructor: "Dra. Ana Silva",
                instructorBio: "PhD em Psicologia Organizacional com 15 anos de experiência",
                modules: [
                    {
                        title: "Módulo 1: Fundamentos da Liderança Consciente",
                        lessons: [
                            {
                                id: "lideranca-1-1",
                                title: "Introdução à Liderança Consciente",
                                duration: "15min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Conceitos fundamentais da liderança consciente e seus impactos na gestão de equipes. Entenda por que a autoconsciência é o primeiro passo para uma liderança eficaz.",
                                resources: [
                                    { type: "pdf", name: "Ebook Liderança Consciente", url: "#" },
                                    { type: "exercise", name: "Exercício: Autoavaliação", url: "#" },
                                    { type: "checklist", name: "Checklist: Princípios Básicos", url: "#" }
                                ],
                                completed: false
                            },
                            {
                                id: "lideranca-1-2",
                                title: "Autoconhecimento e Liderança",
                                duration: "20min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Como o autoconhecimento é a base para uma liderança eficaz e transformadora. Técnicas práticas para desenvolver sua autoconsciência.",
                                resources: [
                                    { type: "questionnaire", name: "Questionário: Perfil de Liderança", url: "#" },
                                    { type: "template", name: "Template: Diário de Autoconhecimento", url: "#" }
                                ],
                                completed: false
                            },
                            {
                                id: "lideranca-1-3",
                                title: "Inteligência Emocional na Liderança",
                                duration: "25min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Desenvolva suas competências emocionais para liderar com empatia e eficácia. Técnicas de regulação emocional.",
                                resources: [
                                    { type: "pdf", name: "Guia de Inteligência Emocional", url: "#" },
                                    { type: "exercise", name: "Exercício: Mapeamento Emocional", url: "#" }
                                ],
                                completed: false
                            }
                        ]
                    },
                    {
                        title: "Módulo 2: Comunicação e Relacionamentos",
                        lessons: [
                            {
                                id: "lideranca-2-1",
                                title: "Comunicação Eficaz",
                                duration: "25min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Técnicas de comunicação que fortalecem a confiança e o engajamento da equipe. Comunicação assertiva e não-violenta.",
                                resources: [
                                    { type: "pdf", name: "Manual de Comunicação Eficaz", url: "#" },
                                    { type: "template", name: "Template: Feedback Construtivo", url: "#" }
                                ],
                                completed: false
                            },
                            {
                                id: "lideranca-2-2",
                                title: "Gestão de Conflitos",
                                duration: "30min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Aprenda a mediar conflitos de forma construtiva. Técnicas de negociação e resolução pacífica de divergências.",
                                resources: [
                                    { type: "pdf", name: "Guia de Mediação de Conflitos", url: "#" },
                                    { type: "checklist", name: "Checklist: Resolução de Conflitos", url: "#" }
                                ],
                                completed: false
                            },
                            {
                                id: "lideranca-2-3",
                                title: "Construindo Relacionamentos Sólidos",
                                duration: "20min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Estratégias para construir relacionamentos de confiança e respeito mútuo na equipe.",
                                resources: [
                                    { type: "exercise", name: "Exercício: Mapeamento de Relacionamentos", url: "#" }
                                ],
                                completed: false
                            }
                        ]
                    },
                    {
                        title: "Módulo 3: Liderança Prática",
                        lessons: [
                            {
                                id: "lideranca-3-1",
                                title: "Tomada de Decisão Consciente",
                                duration: "35min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Processos decisórios baseados em valores e propósito. Como tomar decisões alinhadas com sua essência.",
                                resources: [
                                    { type: "pdf", name: "Framework de Tomada de Decisão", url: "#" },
                                    { type: "template", name: "Template: Análise Decisória", url: "#" }
                                ],
                                completed: false
                            },
                            {
                                id: "lideranca-3-2",
                                title: "Mentoria e Desenvolvimento de Talentos",
                                duration: "28min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Como identificar e desenvolver talentos na sua equipe. Técnicas de mentoria eficaz.",
                                resources: [
                                    { type: "pdf", name: "Guia de Mentoria", url: "#" },
                                    { type: "checklist", name: "Checklist: Desenvolvimento de Talentos", url: "#" }
                                ],
                                completed: false
                            },
                            {
                                id: "lideranca-3-3",
                                title: "Liderança em Tempos de Mudança",
                                duration: "32min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Como liderar equipes em processos de transformação e adaptação às mudanças.",
                                resources: [
                                    { type: "pdf", name: "Guia de Gestão da Mudança", url: "#" },
                                    { type: "exercise", name: "Exercício: Plano de Adaptação", url: "#" }
                                ],
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 2,
                title: "Comunicação Não Violenta",
                category: "desenvolvimento",
                description: "Aprenda a se comunicar de forma autêntica e empática em todos os contextos. Melhore seus relacionamentos profissionais e pessoais.",
                price: "R$ 197",
                originalPrice: "R$ 297",
                free: false,
                image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                rating: 4.9,
                students: 893,
                duration: "6h",
                instructor: "Prof. Carlos Santos",
                instructorBio: "Especialista em Comunicação Não Violenta com 12 anos de experiência",
                modules: [
                    {
                        title: "Módulo 1: Fundamentos da CNV",
                        lessons: [
                            {
                                id: "cnv-1-1",
                                title: "O que é Comunicação Não Violenta",
                                duration: "18min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Conheça os princípios fundamentais da CNV e sua aplicação prática no dia a dia.",
                                resources: [
                                    { type: "pdf", name: "Manual de Introdução à CNV", url: "#" },
                                    { type: "exercise", name: "Exercício: Identificando Violência na Comunicação", url: "#" }
                                ],
                                completed: false
                            },
                            {
                                id: "cnv-1-2",
                                title: "Os 4 Componentes da CNV",
                                duration: "22min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Aprenda sobre observação, sentimentos, necessidades e pedidos - os pilares da comunicação não violenta.",
                                resources: [
                                    { type: "pdf", name: "Guia dos 4 Componentes", url: "#" },
                                    { type: "checklist", name: "Checklist: Aplicação dos Componentes", url: "#" }
                                ],
                                completed: false
                            },
                            {
                                id: "cnv-1-3",
                                title: "Observação sem Julgamento",
                                duration: "20min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Como observar fatos sem adicionar avaliações ou interpretações pessoais.",
                                resources: [
                                    { type: "exercise", name: "Exercício: Distinguindo Observação de Avaliação", url: "#" }
                                ],
                                completed: false
                            }
                        ]
                    },
                    {
                        title: "Módulo 2: Prática da CNV",
                        lessons: [
                            {
                                id: "cnv-2-1",
                                title: "Expressão Autêntica de Sentimentos",
                                duration: "25min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Aprenda a expressar seus sentimentos de forma clara e autêntica sem culpar o outro.",
                                resources: [
                                    { type: "pdf", name: "Vocabulário de Sentimentos", url: "#" },
                                    { type: "exercise", name: "Exercício: Expressão Emocional", url: "#" }
                                ],
                                completed: false
                            },
                            {
                                id: "cnv-2-2",
                                title: "Identificação de Necessidades",
                                duration: "28min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Como identificar necessidades universais por trás dos sentimentos e comportamentos.",
                                resources: [
                                    { type: "pdf", name: "Lista de Necessidades Universais", url: "#" },
                                    { type: "template", name: "Template: Mapeamento de Necessidades", url: "#" }
                                ],
                                completed: false
                            },
                            {
                                id: "cnv-2-3",
                                title: "Fazendo Pedidos Eficazes",
                                duration: "23min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "A arte de fazer pedidos claros, positivos e realizáveis que atendam às necessidades identificadas.",
                                resources: [
                                    { type: "pdf", name: "Guia de Pedidos Eficazes", url: "#" },
                                    { type: "exercise", name: "Exercício: Formulação de Pedidos", url: "#" }
                                ],
                                completed: false
                            }
                        ]
                    },
                    {
                        title: "Módulo 3: CNV Avançada",
                        lessons: [
                            {
                                id: "cnv-3-1",
                                title: "Empatia e Escuta Profunda",
                                duration: "30min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Desenvolva a capacidade de escutar com empatia e compreender as necessidades do outro.",
                                resources: [
                                    { type: "pdf", name: "Manual de Escuta Empática", url: "#" },
                                    { type: "exercise", name: "Exercício: Prática de Escuta", url: "#" }
                                ],
                                completed: false
                            },
                            {
                                id: "cnv-3-2",
                                title: "CNV em Situações de Conflito",
                                duration: "35min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Aplicação da CNV para mediação e resolução de conflitos de forma pacífica.",
                                resources: [
                                    { type: "pdf", name: "Guia de Mediação com CNV", url: "#" },
                                    { type: "template", name: "Template: Resolução de Conflitos", url: "#" }
                                ],
                                completed: false
                            },
                            {
                                id: "cnv-3-3",
                                title: "CNV no Ambiente Corporativo",
                                duration: "32min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Como aplicar a comunicação não violenta em reuniões, feedbacks e liderança de equipes.",
                                resources: [
                                    { type: "pdf", name: "CNV para Empresas", url: "#" },
                                    { type: "checklist", name: "Checklist: CNV Corporativa", url: "#" }
                                ],
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 3,
                title: "Gestão de Mudanças",
                category: "empresarial",
                description: "Estratégias para liderar processos de transformação organizacional. Guie sua equipe através de transições com confiança.",
                price: "R$ 347",
                originalPrice: "R$ 497",
                free: false,
                image: "https://images.unsplash.com/photo-1552664688-cf412ec27db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                rating: 4.7,
                students: 567,
                duration: "10h",
                instructor: "Dr. Roberto Lima",
                instructorBio: "Consultor em Transformação Organizacional",
                modules: [
                    {
                        title: "Módulo 1: Fundamentos da Gestão de Mudanças",
                        lessons: [
                            {
                                id: "mudanca-1-1",
                                title: "Entendendo a Mudança Organizacional",
                                duration: "20min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Conceitos fundamentais sobre transformação organizacional e seus impactos.",
                                resources: [
                                    { type: "pdf", name: "Guia de Mudança Organizacional", url: "#" },
                                    { type: "exercise", name: "Exercício: Diagnóstico da Mudança", url: "#" }
                                ],
                                completed: false
                            },
                            {
                                id: "mudanca-1-2",
                                title: "Modelos de Gestão de Mudanças",
                                duration: "25min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Conheça os principais modelos e frameworks para gerenciar processos de transformação.",
                                resources: [
                                    { type: "pdf", name: "Comparativo de Modelos", url: "#" },
                                    { type: "checklist", name: "Checklist: Escolha do Modelo", url: "#" }
                                ],
                                completed: false
                            },
                            {
                                id: "mudanca-1-3",
                                title: "Análise de Impacto da Mudança",
                                duration: "30min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Como avaliar os impactos da mudança em diferentes áreas da organização.",
                                resources: [
                                    { type: "template", name: "Template: Análise de Impacto", url: "#" },
                                    { type: "exercise", name: "Exercício: Mapeamento de Stakeholders", url: "#" }
                                ],
                                completed: false
                            }
                        ]
                    },
                    {
                        title: "Módulo 2: Implementação da Mudança",
                        lessons: [
                            {
                                id: "mudanca-2-1",
                                title: "Plano de Implementação",
                                duration: "35min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Desenvolvimento de um plano estratégico para implementação bem-sucedida da mudança.",
                                resources: [
                                    { type: "pdf", name: "Template de Plano de Implementação", url: "#" },
                                    { type: "template", name: "Cronograma de Mudança", url: "#" }
                                ],
                                completed: false
                            },
                            {
                                id: "mudanca-2-2",
                                title: "Comunicação da Mudança",
                                duration: "28min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Estratégias de comunicação para engajar e informar stakeholders durante o processo.",
                                resources: [
                                    { type: "pdf", name: "Guia de Comunicação da Mudança", url: "#" },
                                    { type: "template", name: "Plano de Comunicação", url: "#" }
                                ],
                                completed: false
                            },
                            {
                                id: "mudanca-2-3",
                                title: "Gestão de Resistência",
                                duration: "32min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Como identificar e gerenciar a resistência à mudança na organização.",
                                resources: [
                                    { type: "pdf", name: "Manual de Gestão de Resistência", url: "#" },
                                    { type: "exercise", name: "Exercício: Identificação de Resistências", url: "#" }
                                ],
                                completed: false
                            }
                        ]
                    },
                    {
                        title: "Módulo 3: Consolidação e Melhoria Contínua",
                        lessons: [
                            {
                                id: "mudanca-3-1",
                                title: "Monitoramento e Avaliação",
                                duration: "40min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Métricas e indicadores para monitorar o progresso e sucesso da mudança.",
                                resources: [
                                    { type: "pdf", name: "KPIs para Gestão de Mudanças", url: "#" },
                                    { type: "template", name: "Dashboard de Monitoramento", url: "#" }
                                ],
                                completed: false
                            },
                            {
                                id: "mudanca-3-2",
                                title: "Sustentação dos Resultados",
                                duration: "35min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Estratégias para garantir que os resultados da mudança sejam mantidos ao longo do tempo.",
                                resources: [
                                    { type: "pdf", name: "Guia de Sustentação", url: "#" },
                                    { type: "checklist", name: "Checklist: Consolidação", url: "#" }
                                ],
                                completed: false
                            },
                            {
                                id: "mudanca-3-3",
                                title: "Cultura de Melhoria Contínua",
                                duration: "38min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Como criar uma cultura organizacional que abrace a mudança e a inovação constantes.",
                                resources: [
                                    { type: "pdf", name: "Manual de Cultura de Mudança", url: "#" },
                                    { type: "exercise", name: "Exercício: Diagnóstico Cultural", url: "#" }
                                ],
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 4,
                title: "Introdução à Teoria U",
                category: "lideranca",
                description: "Fundamentos da metodologia para inovação e liderança sistêmica. Aprenda a liderar a partir do futuro emergente.",
                price: "Gratuito",
                originalPrice: "R$ 197",
                free: true,
                image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                rating: 4.6,
                students: 2310,
                duration: "4h",
                instructor: "Dra. Maria Oliveira",
                instructorBio: "Facilitadora de Processos de Inovação",
                modules: [
                    {
                        title: "Módulo 1: Fundamentos da Teoria U",
                        lessons: [
                            {
                                id: "teoriau-1-1",
                                title: "O que é a Teoria U",
                                duration: "22min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Introdução à metodologia U e seus princípios fundamentais para liderança transformadora.",
                                resources: [
                                    { type: "pdf", name: "Ebook Teoria U", url: "#" },
                                    { type: "exercise", name: "Exercício: Primeiras Reflexões", url: "#" }
                                ],
                                completed: false
                            },
                            {
                                id: "teoriau-1-2",
                                title: "Os Três Movimentos do U",
                                duration: "25min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Entenda os três movimentos fundamentais: observar, retrair e agir.",
                                resources: [
                                    { type: "pdf", name: "Guia dos Três Movimentos", url: "#" },
                                    { type: "checklist", name: "Checklist: Aplicação dos Movimentos", url: "#" }
                                ],
                                completed: false
                            },
                            {
                                id: "teoriau-1-3",
                                title: "Liderança a partir do Futuro Emergente",
                                duration: "28min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Como desenvolver a capacidade de perceber e cocriar futuros possíveis.",
                                resources: [
                                    { type: "pdf", name: "Manual do Futuro Emergente", url: "#" },
                                    { type: "exercise", name: "Exercício: Visualização de Futuros", url: "#" }
                                ],
                                completed: false
                            }
                        ]
                    },
                    {
                        title: "Módulo 2: Prática da Teoria U",
                        lessons: [
                            {
                                id: "teoriau-2-1",
                                title: "Suspensão e Redirecionamento",
                                duration: "30min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Técnicas para suspender julgamentos e redirecionar a atenção para novas possibilidades.",
                                resources: [
                                    { type: "pdf", name: "Guia de Suspensão", url: "#" },
                                    { type: "exercise", name: "Exercício: Prática de Suspensão", url: "#" }
                                ],
                                completed: false
                            },
                            {
                                id: "teoriau-2-2",
                                title: "Presencing e Prototipagem",
                                duration: "35min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Como acessar o campo do futuro emergente e prototipar novas soluções.",
                                resources: [
                                    { type: "pdf", name: "Manual de Prototipagem", url: "#" },
                                    { type: "template", name: "Template: Prototipagem Rápida", url: "#" }
                                ],
                                completed: false
                            },
                            {
                                id: "teoriau-2-3",
                                title: "Cristalização e Evolução",
                                duration: "32min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Processos para cristalizar insights e evoluir iniciativas de forma orgânica.",
                                resources: [
                                    { type: "pdf", name: "Guia de Cristalização", url: "#" },
                                    { type: "exercise", name: "Exercício: Processo de Evolução", url: "#" }
                                ],
                                completed: false
                            }
                        ]
                    },
                    {
                        title: "Módulo 3: Aplicações Práticas",
                        lessons: [
                            {
                                id: "teoriau-3-1",
                                title: "Teoria U em Equipes",
                                duration: "38min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Como aplicar a Teoria U para desenvolvimento e transformação de equipes.",
                                resources: [
                                    { type: "pdf", name: "Teoria U para Equipes", url: "#" },
                                    { type: "template", name: "Template: Sessão em Equipe", url: "#" }
                                ],
                                completed: false
                            },
                            {
                                id: "teoriau-3-2",
                                title: "Teoria U em Organizações",
                                duration: "40min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Casos de aplicação da Teoria U em transformação organizacional.",
                                resources: [
                                    { type: "pdf", name: "Casos de Estudo", url: "#" },
                                    { type: "exercise", name: "Exercício: Plano de Aplicação", url: "#" }
                                ],
                                completed: false
                            },
                            {
                                id: "teoriau-3-3",
                                title: "Prática Contínua e Desenvolvimento",
                                duration: "35min",
                                video: "https://www.youtube.com/embed/6C_-ICGrcPU",
                                description: "Como manter a prática da Teoria U e continuar desenvolvendo suas capacidades.",
                                resources: [
                                    { type: "pdf", name: "Guia de Prática Contínua", url: "#" },
                                    { type: "checklist", name: "Checklist: Desenvolvimento Pessoal", url: "#" }
                                ],
                                completed: false
                            }
                        ]
                    }
                ]
            }
        ];
    }

    // ========== SISTEMA DE EVENT LISTENERS COMPLETO ==========
    setupEventListeners() {
        // Menu toggle - COM VERIFICAÇÃO DE SEGURANÇA
        const menuToggle = document.getElementById('menuToggle');
        const closeSidebar = document.getElementById('closeSidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        if (menuToggle) menuToggle.addEventListener('click', () => this.toggleSidebar());
        if (closeSidebar) closeSidebar.addEventListener('click', () => this.toggleSidebar(false));
        if (sidebarOverlay) sidebarOverlay.addEventListener('click', () => this.toggleSidebar(false));

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
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }

        // Carousel controls
        const carousel = document.getElementById('hero-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.pauseCarousel());
            carousel.addEventListener('mouseleave', () => this.startCarousel());
        }

        // Botões de navegação de aulas
        const prevLesson = document.getElementById('prev-lesson');
        const nextLesson = document.getElementById('next-lesson');
        if (prevLesson) prevLesson.addEventListener('click', () => this.navigateLesson('prev'));
        if (nextLesson) nextLesson.addEventListener('click', () => this.navigateLesson('next'));

        // Botões de velocidade do vídeo
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const speed = e.target.getAttribute('data-speed');
                this.changeVideoSpeed(speed);
            });
        });

        // Dark Mode Toggles - COM VERIFICAÇÃO
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', (e) => {
                this.toggleDarkMode(e.target.checked);
            });
        }

        const darkModeConfigCheckbox = document.getElementById('dark-mode');
        if (darkModeConfigCheckbox) {
            darkModeConfigCheckbox.addEventListener('change', (e) => {
                this.toggleDarkMode(e.target.checked);
            });
        }

        // Botões de cursos - DELEGAÇÃO DE EVENTOS SEGURA
        document.addEventListener('click', (e) => {
            // Preview de curso
            const previewBtn = e.target.closest('.btn-curso-preview');
            if (previewBtn) {
                e.preventDefault();
                const courseId = previewBtn.getAttribute('data-course');
                this.showCoursePreview(courseId);
                return;
            }

            // Inscrever/comprar curso
            const courseBtn = e.target.closest('.curso-card .btn');
            if (courseBtn) {
                e.preventDefault();
                const courseId = courseBtn.getAttribute('data-course');
                this.enrollInCourse(courseId);
                return;
            }

            // Marcar aula como concluída
            if (e.target.closest('#mark-completed-btn')) {
                this.markCurrentLessonAsCompleted();
                return;
            }
        });

        // Botões de planos
        document.addEventListener('click', (e) => {
            const planBtn = e.target.closest('.plano-card .btn');
            if (planBtn) {
                const planName = planBtn.getAttribute('data-plan');
                this.selectPlan(planName);
            }
        });

        // Logo click - voltar ao início
        const logoHome = document.getElementById('logoHome');
        if (logoHome) {
            logoHome.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                this.toggleSidebar(false);
            });
        }

        // Mobile navigation
        this.initMobileNavigation();

        // Event listeners para configurações
        this.setupConfiguracoesEventListeners();

        // Event listeners para funcionalidades extras
        this.setupExtraEventListeners();
    }

    setupConfiguracoesEventListeners() {
        // Photo upload functionality - COM VERIFICAÇÃO
        const currentPhoto = document.querySelector('.current-photo');
        const photoInput = document.getElementById('photo-input');
        const takePhotoBtn = document.getElementById('take-photo-btn');
        const choosePhotoBtn = document.getElementById('choose-photo-btn');

        if (currentPhoto) {
            currentPhoto.addEventListener('click', () => {
                if (photoInput) photoInput.click();
            });
        }

        if (photoInput) {
            photoInput.addEventListener('change', (e) => this.handlePhotoUpload(e));
        }

        if (takePhotoBtn) {
            takePhotoBtn.addEventListener('click', () => this.takePhoto());
        }

        if (choosePhotoBtn) {
            choosePhotoBtn.addEventListener('click', () => {
                if (photoInput) photoInput.click();
            });
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
    }

    setupExtraEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Video progress tracking
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.currentLesson) {
                this.trackStudyTime();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && this.currentScreen === 'plataforma') {
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.navigateLesson('prev');
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.navigateLesson('next');
                        break;
                }
            }
        });
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

    // ========== SISTEMA DE NAVEGAÇÃO AVANÇADO ==========
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

            // Animação de entrada
            targetScreen.style.opacity = '0';
            targetScreen.style.transform = 'translateY(20px)';
            setTimeout(() => {
                targetScreen.style.opacity = '1';
                targetScreen.style.transform = 'translateY(0)';
                targetScreen.style.transition = 'all 0.3s ease';
            }, 50);
        }

        // Ações específicas para cada tela
        this.handleScreenSpecificActions(screen);

        // Salvar a última tela vista
        this.userSettings.lastScreen = screen;
        this.saveSettings();
    }

    handleScreenSpecificActions(screen) {
        switch (screen) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'plataforma':
                setTimeout(() => {
                    this.updateNavigationButtons();
                    this.loadPlatformModules();
                }, 100);
                break;
            case 'configuracoes':
                setTimeout(() => this.loadSettingsUI(), 100);
                break;
            case 'cursos':
                this.animateCourseCards();
                break;
            case 'planos':
                this.animatePlanCards();
                break;
            case 'contato':
                this.initializeContactForm();
                break;
        }
    }

    // ========== SISTEMA DARK MODE CORRIGIDO ==========
    applyDarkMode() {
        // GARANTIR que preferences existe
        if (!this.userSettings.preferences) {
            this.userSettings.preferences = {};
        }

        const isDark = this.userSettings.preferences.darkMode || false;

        if (isDark) {
            document.body.classList.add('dark-mode');
            console.log('🌙 Modo escuro aplicado');
        } else {
            document.body.classList.remove('dark-mode');
            console.log('☀️ Modo claro aplicado');
        }

        // Sincroniza todos os switches do Dark Mode
        this.syncDarkModeSwitches(isDark);
    }

    syncDarkModeSwitches(isDark) {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.checked = isDark;
        }

        const darkModeConfigCheckbox = document.getElementById('dark-mode');
        if (darkModeConfigCheckbox) {
            darkModeConfigCheckbox.checked = isDark;
        }
    }

    toggleDarkMode(enable) {
        // GARANTIR que preferences existe
        if (!this.userSettings.preferences) {
            this.userSettings.preferences = {};
        }
        this.userSettings.preferences.darkMode = enable;

        // Salva e aplica
        this.saveSettings();
        this.applyDarkMode();

        this.showNotification(`Modo ${enable ? 'Escuro' : 'Claro'} ${enable ? 'ativado' : 'desativado'}`, 'success');
    }

    // ========== SISTEMA DE CARROSSEL ==========
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
        if (!this.carouselItems || !this.carouselDots) return;

        this.carouselItems.forEach(item => item.classList.remove('active'));
        this.carouselDots.forEach(dot => dot.classList.remove('active'));

        if (this.carouselItems[index]) {
            this.carouselItems[index].classList.add('active');
        }
        if (this.carouselDots[index]) {
            this.carouselDots[index].classList.add('active');
        }
        this.currentCarouselIndex = index;
    }

    nextCarousel() {
        if (!this.carouselItems || this.carouselItems.length === 0) return;

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

    // ========== SISTEMA DE CURSOS AVANÇADO ==========
    loadContent() {
        this.loadCourses();
        this.loadPlans();
        this.loadTestimonials();
        this.loadFeaturedCourses();
    }

    loadCourses() {
        const container = document.getElementById('cursos-container');
        if (!container) return;

        // GARANTIR que enrolledCourses existe
        if (!this.userProgress.enrolledCourses) {
            this.userProgress.enrolledCourses = [];
        }

        container.innerHTML = this.coursesData.map(course => {
            // VERIFICAÇÃO DE SEGURANÇA para enrolledCourses
            const isEnrolled = this.userProgress.enrolledCourses
                ? this.userProgress.enrolledCourses.includes(course.id)
                : false;

            return `
                <div class="curso-card" data-category="${course.category}" data-course="${course.id}">
                    <div class="curso-image">
                        <img src="${course.image}" alt="${course.title}" loading="lazy">
                        ${course.free ? '<div class="curso-badge gratuito">Gratuito</div>' : ''}
                        ${course.originalPrice && !course.free ? `<div class="curso-badge desconto">${this.calculateDiscount(course.price, course.originalPrice)}% OFF</div>` : ''}
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
                                <span class="curso-students">(${this.formatNumber(course.students)} alunos)</span>
                            </div>
                            <span class="curso-duration"><i class="fas fa-clock"></i> ${course.duration}</span>
                        </div>
                        <div class="curso-instructor">
                            <i class="fas fa-user"></i> ${course.instructor}
                        </div>
                        <div class="curso-footer">
                            <div class="curso-pricing">
                                ${!course.free && course.originalPrice ? `
                                    <span class="curso-original-price">${course.originalPrice}</span>
                                ` : ''}
                                <span class="curso-price ${course.free ? 'curso-free' : ''}">${course.price}</span>
                            </div>
                            <button class="btn ${course.free ? 'btn-success' : 'btn-primary'} btn-sm" data-course="${course.id}">
                                ${isEnrolled ? 'Acessar' : (course.free ? 'Inscrever-se' : 'Comprar')}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Adicionar animação aos cards
        this.animateCourseCards();
    }

    loadFeaturedCourses() {
        const featuredContainer = document.getElementById('featured-courses');
        if (!featuredContainer) return;

        const featuredCourses = this.coursesData.filter(course => course.rating >= 4.7).slice(0, 3);

        featuredContainer.innerHTML = featuredCourses.map(course => `
            <div class="featured-course-card">
                <div class="featured-course-image">
                    <img src="${course.image}" alt="${course.title}">
                    <div class="featured-badge">Destaque</div>
                </div>
                <div class="featured-course-content">
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <div class="featured-course-meta">
                        <span class="rating"><i class="fas fa-star"></i> ${course.rating}</span>
                        <span class="students">${this.formatNumber(course.students)} alunos</span>
                    </div>
                    <button class="btn btn-primary" onclick="ahaApp.enrollInCourse(${course.id})">
                        ${course.free ? 'Inscrever-se Gratuitamente' : 'Ver Curso'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    calculateDiscount(price, originalPrice) {
        try {
            const priceNum = parseInt(price.replace(/\D/g, ''));
            const originalNum = parseInt(originalPrice.replace(/\D/g, ''));
            return Math.round(((originalNum - priceNum) / originalNum) * 100);
        } catch (error) {
            console.error('Erro ao calcular desconto:', error);
            return 0;
        }
    }

    formatNumber(num) {
        if (!num) return '0';
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }

    animateCourseCards() {
        const cards = document.querySelectorAll('.curso-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('animate-in');
        });
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

    handleSearch(searchTerm) {
        const courses = document.querySelectorAll('.curso-card');
        const searchLower = searchTerm.toLowerCase();

        courses.forEach(course => {
            const title = course.querySelector('.curso-title')?.textContent.toLowerCase() || '';
            const description = course.querySelector('.curso-description')?.textContent.toLowerCase() || '';
            const instructor = course.querySelector('.curso-instructor')?.textContent.toLowerCase() || '';

            const matches = title.includes(searchLower) ||
                description.includes(searchLower) ||
                instructor.includes(searchLower);

            course.style.display = matches ? 'block' : 'none';
        });
    }

    showCoursePreview(courseId) {
        const course = this.coursesData.find(c => c.id == courseId);
        if (course) {
            // Criar modal de preview
            this.showCoursePreviewModal(course);
        }
    }

    showCoursePreviewModal(course) {
        const modal = document.createElement('div');
        modal.className = 'preview-modal';
        modal.innerHTML = `
            <div class="preview-modal-content">
                <div class="preview-header">
                    <h3>Preview: ${course.title}</h3>
                    <button class="close-preview">&times;</button>
                </div>
                <div class="preview-video">
                    <iframe src="${course.modules?.[0]?.lessons?.[0]?.video || 'https://www.youtube.com/embed/6C_-ICGrcPU'}" 
                            frameborder="0" allowfullscreen></iframe>
                </div>
                <div class="preview-info">
                    <h4>${course.title}</h4>
                    <p>${course.description}</p>
                    <div class="preview-actions">
                        <button class="btn btn-primary" onclick="ahaApp.enrollInCourse(${course.id}); document.querySelector('.preview-modal')?.remove()">
                            ${course.free ? 'Inscrever-se Gratuitamente' : 'Comprar Agora'}
                        </button>
                        <button class="btn btn-secondary close-preview">Fechar Preview</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Fechar modal
        modal.querySelectorAll('.close-preview').forEach(btn => {
            btn.addEventListener('click', () => modal.remove());
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    // ========== SISTEMA DE INSCRIÇÃO MELHORADO ==========
    enrollInCourse(courseId) {
        const course = this.coursesData.find(c => c.id == courseId);
        if (course) {
            // GARANTIR que enrolledCourses existe
            if (!this.userProgress.enrolledCourses) {
                this.userProgress.enrolledCourses = [];
            }

            const isEnrolled = this.userProgress.enrolledCourses.includes(courseId);

            if (isEnrolled) {
                // Já inscrito - ir para plataforma
                this.navigateTo('plataforma');
                this.showNotification(`📚 Acessando curso "${course.title}"`, 'info');
            } else {
                // Nova inscrição
                if (confirm(`Deseja ${course.free ? 'inscrever-se' : 'comprar'} no curso "${course.title}"?\n\n${course.modules ? `• ${course.modules.length} módulos\n• ${this.getTotalLessons(course)} aulas` : 'Conteúdo completo disponível'}`)) {
                    this.userProgress.enrolledCourses.push(courseId);
                    this.saveProgress();

                    this.showNotification(`🎉 Parabéns! Curso "${course.title}" adicionado à sua conta!`, 'success');

                    // Atualizar botão no card do curso
                    const courseButton = document.querySelector(`[data-course="${courseId}"] .btn`);
                    if (courseButton) {
                        courseButton.textContent = 'Acessar';
                        courseButton.classList.remove('btn-primary');
                        courseButton.classList.add('btn-success');
                    }

                    setTimeout(() => {
                        this.navigateTo('plataforma');
                    }, 1500);
                }
            }
        }
    }

    // Função auxiliar para contar o total de aulas
    getTotalLessons(course) {
        if (!course.modules) return 0;
        return course.modules.reduce((total, module) => {
            return total + (module.lessons ? module.lessons.length : 0);
        }, 0);
    }
    // ========== SISTEMA DE APRENDIZADO COMPLETO ==========
    // ========== SISTEMA DE APRENDIZADO COMPLETO - ATUALIZADO ==========
    loadPlatformModules() {
        const container = document.getElementById('module-list');
        if (!container) return;

        // GARANTIR que enrolledCourses existe
        if (!this.userProgress.enrolledCourses || this.userProgress.enrolledCourses.length === 0) {
            container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open fa-3x"></i>
                <h3>Nenhum curso inscrito</h3>
                <p>Inscreva-se em um curso para começar a aprender!</p>
                <button class="btn btn-primary" onclick="ahaApp.navigateTo('cursos')">
                    Explorar Cursos
                </button>
            </div>
        `;
            return;
        }

        // Para demonstração, usa o primeiro curso inscrito
        const enrolledCourseId = this.userProgress.enrolledCourses[0];
        const course = this.coursesData.find(c => c.id == enrolledCourseId);
        this.currentCourse = course;

        if (!course) {
            container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle fa-3x"></i>
                <h3>Curso não encontrado</h3>
                <p>O curso selecionado não está mais disponível.</p>
                <button class="btn btn-primary" onclick="ahaApp.navigateTo('cursos')">
                    Explorar Outros Cursos
                </button>
            </div>
        `;
            return;
        }

        if (!course.modules || course.modules.length === 0) {
            container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-cogs fa-3x"></i>
                <h3>Conteúdo em desenvolvimento</h3>
                <p>O conteúdo deste curso está sendo preparado com carinho!</p>
                <p><strong>Curso:</strong> ${course.title}</p>
                <p><strong>Instrutor:</strong> ${course.instructor}</p>
            </div>
        `;
            return;
        }

        // GARANTIR que completedLessons existe
        if (!this.userProgress.completedLessons) {
            this.userProgress.completedLessons = [];
        }

        let modulesHTML = '';

        course.modules.forEach((module, moduleIndex) => {
            modulesHTML += `
            <li class="module-section">
                <div class="module-title">${module.title}</div>
                <ul>
        `;

            if (module.lessons && module.lessons.length > 0) {
                module.lessons.forEach((lesson, lessonIndex) => {
                    const isCompleted = this.userProgress.completedLessons.includes(lesson.id);
                    const isLastWatched = this.userProgress.lastWatched === lesson.id;

                    modulesHTML += `
                    <li class="module-item ${isCompleted ? 'completed' : ''} ${isLastWatched ? 'last-watched' : ''}" 
                        data-lesson-id="${lesson.id}"
                        data-video="${lesson.video}" 
                        data-description="${lesson.description}"
                        data-resources='${JSON.stringify(lesson.resources)}'>
                        <div class="lesson-info">
                            <div class="lesson-icon">
                                <i class="fas fa-${isCompleted ? 'check-circle' : 'play-circle'}"></i>
                            </div>
                            <div class="lesson-details">
                                <div class="lesson-title">${lesson.title}</div>
                                <div class="lesson-duration">${lesson.duration}</div>
                            </div>
                        </div>
                        ${isCompleted ? '<div class="lesson-check"><i class="fas fa-check"></i></div>' : ''}
                        ${isLastWatched ? '<div class="last-watched-badge">Continuar</div>' : ''}
                    </li>
                `;
                });
            } else {
                modulesHTML += `
                <li class="module-item">
                    <div class="lesson-info">
                        <div class="lesson-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="lesson-details">
                            <div class="lesson-title">Aulas em breve</div>
                            <div class="lesson-duration">Em produção</div>
                        </div>
                    </div>
                </li>
            `;
            }

            modulesHTML += `
                </ul>
            </li>
        `;
        });

        container.innerHTML = modulesHTML;

        // Add lesson click handlers
        document.querySelectorAll('.module-item').forEach(item => {
            item.addEventListener('click', () => {
                const lessonId = item.getAttribute('data-lesson-id');
                if (!lessonId || lessonId === 'null') return;

                document.querySelectorAll('.module-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                const title = item.querySelector('.lesson-title').textContent;
                const video = item.getAttribute('data-video');
                const description = item.getAttribute('data-description');
                const resources = JSON.parse(item.getAttribute('data-resources') || '[]');

                this.showLesson(lessonId, title, video, description, resources);
                this.updateNavigationButtons();
            });
        });

        // Auto-select first lesson or last watched
        const lastWatchedLesson = document.querySelector('.module-item.last-watched');
        const firstValidLesson = document.querySelector('.module-item[data-lesson-id]:not([data-lesson-id="null"])');

        if (lastWatchedLesson) {
            lastWatchedLesson.click();
        } else if (firstValidLesson) {
            firstValidLesson.click();
        }
    }
    showLesson(lessonId, title, videoUrl, description, resources) {
        this.currentLesson = { id: lessonId, title, videoUrl, description, resources };

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

            const lessonTitleEl = document.getElementById('lesson-title');
            const lessonDescEl = document.getElementById('lesson-description');

            if (lessonTitleEl) lessonTitleEl.textContent = title;
            if (lessonDescEl) lessonDescEl.textContent = description;

            // Atualizar recursos da aula
            this.showLessonResources(resources);

            // Marcar como última assistida
            this.userProgress.lastWatched = lessonId;
            this.saveProgress();

            // Iniciar tracking de tempo de estudo
            this.startStudyTimeTracking();
        }
    }

    startStudyTimeTracking() {
        this.studyStartTime = new Date();
    }

    trackStudyTime() {
        if (this.studyStartTime && this.currentLesson) {
            const endTime = new Date();
            const studyTime = (endTime - this.studyStartTime) / (1000 * 60 * 60); // Converter para horas
            this.userProgress.totalStudyTime += studyTime;
            this.saveProgress();
            this.updateProgressUI();
        }
    }

    showLessonResources(resources) {
        const resourcesContainer = document.getElementById('lesson-resources');
        if (resourcesContainer) {
            if (resources && resources.length > 0) {
                resourcesContainer.innerHTML = `
                    <h4>📚 Materiais desta aula:</h4>
                    <ul>
                        ${resources.map(resource => `
                            <li>
                                <i class="fas fa-${this.getResourceIcon(resource.type)}"></i> 
                                ${resource.name}
                                <button class="btn-download" onclick="ahaApp.downloadResource('${resource.url}', '${resource.name}')">
                                    <i class="fas fa-download"></i>
                                </button>
                            </li>
                        `).join('')}
                    </ul>
                `;
                resourcesContainer.style.display = 'block';
            } else {
                resourcesContainer.innerHTML = `
                    <div class="no-resources">
                        <i class="fas fa-info-circle"></i>
                        <p>Nenhum material adicional para esta aula</p>
                    </div>
                `;
                resourcesContainer.style.display = 'block';
            }
        }
    }

    getResourceIcon(type) {
        const icons = {
            'pdf': 'file-pdf',
            'exercise': 'dumbbell',
            'checklist': 'check-square',
            'questionnaire': 'clipboard-list',
            'template': 'file-alt'
        };
        return icons[type] || 'file-download';
    }

    downloadResource(url, filename) {
        this.showNotification(`📥 Baixando: ${filename}`, 'info');

        // Simular download
        setTimeout(() => {
            this.showNotification(`✅ ${filename} baixado com sucesso!`, 'success');
        }, 2000);
    }

    markCurrentLessonAsCompleted() {
        if (this.currentLesson) {
            this.markLessonAsWatched(this.currentLesson.id, this.currentLesson.title);
        }
    }

    markLessonAsWatched(lessonId, lessonTitle) {
        const lessonItem = document.querySelector(`[data-lesson-id="${lessonId}"]`);

        if (lessonItem && !lessonItem.classList.contains('completed')) {
            lessonItem.classList.add('completed');
            const lessonIcon = lessonItem.querySelector('.lesson-icon i');
            if (lessonIcon) {
                lessonIcon.className = 'fas fa-check-circle';
            }

            if (!lessonItem.querySelector('.lesson-check')) {
                const checkDiv = document.createElement('div');
                checkDiv.className = 'lesson-check';
                checkDiv.innerHTML = '<i class="fas fa-check"></i>';
                lessonItem.appendChild(checkDiv);
            }

            // GARANTIR que completedLessons existe
            if (!this.userProgress.completedLessons) {
                this.userProgress.completedLessons = [];
            }

            // Atualizar progresso
            if (!this.userProgress.completedLessons.includes(lessonId)) {
                this.userProgress.completedLessons.push(lessonId);

                // Calcular tempo baseado na duração da aula
                const duration = lessonItem.querySelector('.lesson-duration')?.textContent || '30min';
                const timeMinutes = this.parseDurationToMinutes(duration);
                this.userProgress.totalStudyTime += timeMinutes / 60; // Converter para horas

                this.updateProgress();
                this.saveProgress();
                this.updateProgressUI();

                // Verificar conquistas
                this.checkAchievements();

                this.showNotification(`✅ Aula "${lessonTitle}" concluída! +${timeMinutes}min de estudo`, 'success');
            }
        }
    }

    parseDurationToMinutes(duration) {
        // Converter "25min" para 25 minutos
        const match = duration.match(/(\d+)min/);
        return match ? parseInt(match[1]) : 30; // Default 30 minutos
    }

    // ========== SISTEMA DE CONQUISTAS ==========
    checkAchievements() {
        // GARANTIR que achievements existe
        if (!this.userProgress.achievements) {
            this.userProgress.achievements = [];
        }
        if (!this.userProgress.completedLessons) {
            this.userProgress.completedLessons = [];
        }

        const achievements = [];
        const completedCount = this.userProgress.completedLessons.length;

        // Conquista: Primeira aula
        if (completedCount === 1 && !this.userProgress.achievements.includes('first_lesson')) {
            achievements.push('first_lesson');
            this.showAchievement('🎉 Primeira Aula!', 'Você completou sua primeira aula!');
        }

        // Conquista: 5 aulas
        if (completedCount === 5 && !this.userProgress.achievements.includes('five_lessons')) {
            achievements.push('five_lessons');
            this.showAchievement('📚 Aprendiz Dedicado', '5 aulas completadas! Continue assim!');
        }

        // Conquista: 10 horas de estudo
        if (this.userProgress.totalStudyTime >= 10 && !this.userProgress.achievements.includes('ten_hours')) {
            achievements.push('ten_hours');
            this.showAchievement('⏰ Estudante Comprometido', '10 horas de estudo alcançadas!');
        }

        // Conquista: Curso Completo
        const totalLessons = document.querySelectorAll('.module-item').length;
        if (completedCount === totalLessons && totalLessons > 0 && !this.userProgress.achievements.includes('course_completed')) {
            achievements.push('course_completed');
            this.showAchievement('🏆 Curso Concluído!', `Você completou todas as aulas do curso!`);
        }

        // Adicionar novas conquistas
        achievements.forEach(achievement => {
            if (!this.userProgress.achievements.includes(achievement)) {
                this.userProgress.achievements.push(achievement);
            }
        });

        if (achievements.length > 0) {
            this.saveProgress();
        }
    }

    showAchievement(title, description) {
        const achievement = document.createElement('div');
        achievement.className = 'achievement-notification';
        achievement.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">🏆</div>
                <div class="achievement-text">
                    <h4>${title}</h4>
                    <p>${description}</p>
                </div>
                <button class="achievement-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(achievement);

        // Show achievement
        setTimeout(() => achievement.classList.add('show'), 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (achievement.parentElement) {
                achievement.classList.remove('show');
                setTimeout(() => achievement.remove(), 300);
            }
        }, 5000);

        // Close button
        achievement.querySelector('.achievement-close').addEventListener('click', () => {
            achievement.classList.remove('show');
            setTimeout(() => achievement.remove(), 300);
        });
    }

    // ========== SISTEMA DE PROGRESSO ==========
    updateProgress() {
        const totalLessons = document.querySelectorAll('.module-item').length;
        // GARANTIR que completedLessons existe
        const completedLessons = this.userProgress.completedLessons ? this.userProgress.completedLessons.length : 0;
        this.userProgress.progressPercentage = totalLessons > 0 ?
            Math.round((completedLessons / totalLessons) * 100) : 0;
    }

    updateProgressUI() {
        // Progress bar principal
        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');

        if (progressBar && progressText) {
            progressBar.style.width = `${this.userProgress.progressPercentage}%`;
            progressText.textContent = `${this.userProgress.progressPercentage}% completo`;
        }

        // Progresso na plataforma
        const platformProgress = document.querySelector('.course-progress .progress-text');
        if (platformProgress) {
            platformProgress.textContent = `${this.userProgress.progressPercentage}% completo`;
        }

        // Atualizar dashboard
        this.updateDashboard();
    }

    updateDashboard() {
        const dashboard = document.getElementById('dashboard-content');
        if (!dashboard) return;

        const hoursStudied = (this.userProgress.totalStudyTime || 0).toFixed(1);
        const enrolledCourses = this.userProgress.enrolledCourses ? this.userProgress.enrolledCourses.length : 0;
        const achievementsCount = this.userProgress.achievements ? this.userProgress.achievements.length : 0;
        const completedLessons = this.userProgress.completedLessons ? this.userProgress.completedLessons.length : 0;

        dashboard.innerHTML = `
            <div class="dashboard-stats">
                <div class="stat-card">
                    <i class="fas fa-play-circle"></i>
                    <h3>${this.userProgress.progressPercentage}%</h3>
                    <p>Progresso Total</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-check-circle"></i>
                    <h3>${completedLessons}</h3>
                    <p>Aulas Concluídas</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-clock"></i>
                    <h3>${hoursStudied}h</h3>
                    <p>Horas Estudadas</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-trophy"></i>
                    <h3>${achievementsCount}</h3>
                    <p>Conquistas</p>
                </div>
            </div>
            
            <div class="dashboard-courses">
                <h3>Meus Cursos (${enrolledCourses})</h3>
                ${enrolledCourses > 0 ? `
                    <div class="courses-grid">
                        ${this.userProgress.enrolledCourses.map(courseId => {
            const course = this.coursesData.find(c => c.id == courseId);
            return course ? `
                                <div class="dashboard-course-card">
                                    <img src="${course.image}" alt="${course.title}">
                                    <div class="course-info">
                                        <h4>${course.title}</h4>
                                        <p>${course.instructor}</p>
                                        <div class="course-progress-mini">
                                            <div class="progress-bar">
                                                <div class="progress-fill" style="width: ${this.userProgress.progressPercentage}%"></div>
                                            </div>
                                            <span>${this.userProgress.progressPercentage}%</span>
                                        </div>
                                    </div>
                                </div>
                            ` : '';
        }).join('')}
                    </div>
                ` : `
                    <div class="empty-state">
                        <i class="fas fa-book-open fa-2x"></i>
                        <p>Nenhum curso inscrito</p>
                        <button class="btn btn-primary" onclick="ahaApp.navigateTo('cursos')">
                            Explorar Cursos
                        </button>
                    </div>
                `}
            </div>
            
            <div class="continue-learning">
                <h3>Continuar Aprendendo</h3>
                ${this.userProgress.lastWatched ? `
                    <div class="continue-card">
                        <i class="fas fa-play-circle"></i>
                        <div class="continue-info">
                            <h4>${this.getLessonTitle(this.userProgress.lastWatched)}</h4>
                            <p>Continue de onde parou</p>
                        </div>
                        <button class="btn btn-success" onclick="ahaApp.navigateTo('plataforma')">
                            Continuar
                        </button>
                    </div>
                ` : '<p>Comece sua primeira aula na plataforma!</p>'}
            </div>

            ${achievementsCount > 0 ? `
                <div class="dashboard-achievements">
                    <h3>Minhas Conquistas</h3>
                    <div class="achievements-grid">
                        ${this.userProgress.achievements.map(achievement => {
            const achievementInfo = this.getAchievementInfo(achievement);
            return achievementInfo ? `
                                <div class="achievement-badge">
                                    <div class="achievement-icon">${achievementInfo.icon}</div>
                                    <div class="achievement-text">
                                        <h4>${achievementInfo.title}</h4>
                                        <p>${achievementInfo.description}</p>
                                    </div>
                                </div>
                            ` : '';
        }).join('')}
                    </div>
                </div>
            ` : ''}

            <div class="study-analytics">
                <h3>Estatísticas de Estudo</h3>
                <div class="analytics-grid">
                    <div class="analytics-card">
                        <i class="fas fa-fire"></i>
                        <div class="analytics-info">
                            <h4>${this.getCurrentStreak()} dias</h4>
                            <p>Sequência atual</p>
                        </div>
                    </div>
                    <div class="analytics-card">
                        <i class="fas fa-calendar"></i>
                        <div class="analytics-info">
                            <h4>${this.getDaysStudied()}</h4>
                            <p>Dias estudados</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getCurrentStreak() {
        // Simular sequência de dias estudados
        return Math.min(7, Math.floor((this.userProgress.totalStudyTime || 0) / 2));
    }

    getDaysStudied() {
        return Math.min(30, Math.floor(this.userProgress.totalStudyTime || 0));
    }

    getLessonTitle(lessonId) {
        if (!lessonId) return "Aula não encontrada";

        // Buscar o título da aula em todos os cursos
        for (let course of this.coursesData) {
            if (course.modules) {
                for (let module of course.modules) {
                    for (let lesson of module.lessons) {
                        if (lesson.id === lessonId) {
                            return lesson.title;
                        }
                    }
                }
            }
        }
        return "Aula não encontrada";
    }

    getAchievementInfo(achievementId) {
        const achievements = {
            'first_lesson': {
                icon: '🎉',
                title: 'Primeira Aula',
                description: 'Completou a primeira aula'
            },
            'five_lessons': {
                icon: '📚',
                title: 'Aprendiz Dedicado',
                description: '5 aulas completadas'
            },
            'ten_hours': {
                icon: '⏰',
                title: 'Estudante Comprometido',
                description: '10 horas de estudo'
            },
            'course_completed': {
                icon: '🏆',
                title: 'Curso Concluído',
                description: 'Finalizou todas as aulas do curso'
            }
        };
        return achievements[achievementId];
    }

    // ========== SISTEMA DE NAVEGAÇÃO DE AULAS ==========
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

        allLessons[nextIndex]?.click();
        this.showNotification(`📖 ${direction === 'next' ? 'Próxima' : 'Anterior'} aula carregada`, 'info');
    }

    updateNavigationButtons() {
        const currentLesson = document.querySelector('.module-item.active');
        if (!currentLesson) return;

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
        // Em produção, isso controlaria a velocidade do vídeo real
        const video = document.querySelector('#youtube-video iframe');
        if (video) {
            // Aqui você implementaria a mudança de velocidade no player de vídeo
            this.showNotification(`🎚️ Velocidade do vídeo: ${speed}x`, 'info');
        }
    }

    // ========== SISTEMA DE CONFIGURAÇÕES COMPLETO ==========
    loadSettingsUI() {
        // Garantir que os valores estão carregados
        this.loadSettings();
    }

    handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
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
                this.updateProfilePhoto(photoUrl);
                this.showNotification('✅ Foto de perfil atualizada com sucesso!', 'success');
            };
            reader.readAsDataURL(file);
        }
    }

    updateProfilePhoto(photoUrl) {
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

        // Update photo in header if exists
        const headerPhoto = document.querySelector('.header-user-avatar img');
        if (headerPhoto) {
            headerPhoto.src = photoUrl;
        }

        // Save to settings
        this.userSettings.profilePhoto = photoUrl;
        this.saveSettings();
    }

    takePhoto() {
        this.showNotification('📸 Funcionalidade de câmera será implementada em breve!', 'info');
        // Em um app real, aqui você implementaria o acesso à câmera
    }

    saveSettings() {
        console.log('💾 Salvando configurações...');

        // Coletar dados do formulário COM VERIFICAÇÃO
        const formData = {
            profile: {
                name: document.getElementById('user-name')?.value || 'João Silva',
                email: document.getElementById('user-email')?.value || 'joao@email.com',
                phone: document.getElementById('user-phone')?.value || '(11) 99999-9999',
                bio: document.getElementById('user-bio')?.value || 'Apaixonado por aprendizado e desenvolvimento pessoal!'
            },
            preferences: {
                emailNotifications: document.getElementById('email-notifications')?.checked || true,
                darkMode: document.getElementById('dark-mode')?.checked || false,
                autoplay: document.getElementById('autoplay')?.checked || true,
                profileVisibility: document.getElementById('profile-visibility')?.value || 'public'
            },
            profilePhoto: this.userSettings.profilePhoto,
            lastScreen: this.userSettings.lastScreen
        };

        // Atualizar configurações
        this.userSettings = { ...this.userSettings, ...formData };
        localStorage.setItem('ahaUserSettings', JSON.stringify(this.userSettings));

        // Atualizar UI
        this.applyDarkMode();

        // Atualizar sidebar e header
        const userDetails = document.querySelector('.user-details h3');
        if (userDetails) {
            userDetails.textContent = this.userSettings.profile.name;
        }

        const headerUserName = document.querySelector('.header-user-name');
        if (headerUserName) {
            headerUserName.textContent = this.userSettings.profile.name;
        }

        this.showNotification('✅ Configurações salvas com sucesso!', 'success');
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('ahaUserSettings');
        if (savedSettings) {
            try {
                this.userSettings = JSON.parse(savedSettings);
                // Aplicar configurações carregadas
                this.applySettingsToForm();
                this.applyDarkMode();
            } catch (error) {
                console.error('Erro ao carregar configurações:', error);
                // Recriar configurações padrão em caso de erro
                this.userSettings = {
                    profile: {
                        name: "João Silva",
                        email: "joao@email.com",
                        phone: "(11) 99999-9999",
                        bio: "Apaixonado por aprendizado e desenvolvimento pessoal!"
                    },
                    preferences: {
                        darkMode: false,
                        emailNotifications: true,
                        autoplay: true,
                        profileVisibility: 'public'
                    },
                    lastScreen: 'home'
                };
            }
        }
    }

    applySettingsToForm() {
        if (!this.userSettings) return;

        // Profile data
        if (this.userSettings.profile) {
            const userName = document.getElementById('user-name');
            const userEmail = document.getElementById('user-email');
            const userPhone = document.getElementById('user-phone');
            const userBio = document.getElementById('user-bio');

            if (userName) userName.value = this.userSettings.profile.name || '';
            if (userEmail) userEmail.value = this.userSettings.profile.email || '';
            if (userPhone) userPhone.value = this.userSettings.profile.phone || '';
            if (userBio) userBio.value = this.userSettings.profile.bio || '';
        }

        // Preferences
        if (this.userSettings.preferences) {
            const emailNotif = document.getElementById('email-notifications');
            const darkMode = document.getElementById('dark-mode');
            const autoplay = document.getElementById('autoplay');
            const profileVisibility = document.getElementById('profile-visibility');

            if (emailNotif) emailNotif.checked = this.userSettings.preferences.emailNotifications || true;
            if (darkMode) darkMode.checked = this.userSettings.preferences.darkMode || false;
            if (autoplay) autoplay.checked = this.userSettings.preferences.autoplay || true;
            if (profileVisibility) profileVisibility.value = this.userSettings.preferences.profileVisibility || 'public';
        }

        // Photo
        if (this.userSettings.profilePhoto) {
            this.updateProfilePhoto(this.userSettings.profilePhoto);
        }

        // Sidebar user info
        const userDetails = document.querySelector('.user-details h3');
        if (userDetails && this.userSettings.profile) {
            userDetails.textContent = this.userSettings.profile.name;
        }
    }

    resetSettings() {
        if (confirm('Tem certeza que deseja restaurar todas as configurações para os valores padrão?')) {
            localStorage.removeItem('ahaUserSettings');
            this.userSettings = {
                profile: {
                    name: "João Silva",
                    email: "joao@email.com",
                    phone: "(11) 99999-9999",
                    bio: "Apaixonado por aprendizado e desenvolvimento pessoal!"
                },
                preferences: {
                    darkMode: false,
                    emailNotifications: true,
                    autoplay: true,
                    profileVisibility: 'public'
                },
                lastScreen: 'home'
            };

            // Reset form
            this.applySettingsToForm();

            // Reset photo
            const defaultPhoto = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80';
            this.updateProfilePhoto(defaultPhoto);

            this.showNotification('✅ Configurações restauradas com sucesso!', 'success');
        }
    }

    confirmDeleteAccount() {
        if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
            // Simular exclusão de conta
            localStorage.removeItem('ahaUserSettings');
            localStorage.removeItem('ahaProgress');
            localStorage.removeItem('ahaContacts');

            this.showNotification('✅ Conta excluída com sucesso!', 'success');

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    }

    exportData() {
        const userData = {
            profile: this.userSettings?.profile || {},
            progress: this.userProgress,
            courses: this.userProgress.enrolledCourses ?
                this.userProgress.enrolledCourses.map(id =>
                    this.coursesData.find(course => course.id === id)
                ).filter(Boolean) : [],
            exportDate: new Date().toISOString(),
            achievements: this.userProgress.achievements || [],
            studyTime: this.userProgress.totalStudyTime || 0,
            lastWatched: this.userProgress.lastWatched || null
        };

        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `aha-academy-data-${new Date().getTime()}.json`;
        link.click();

        this.showNotification('📊 Dados exportados com sucesso!', 'success');
    }

    // ========== SISTEMA DE PLANOS ==========
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

            this.animatePlanCards();
        }
    }

    animatePlanCards() {
        const cards = document.querySelectorAll('.plano-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
            card.classList.add('animate-in');
        });
    }

    selectPlan(planName) {
        if (planName === 'Empresarial') {
            this.showNotification('📞 Entraremos em contato em até 24h! Nossa equipe vai entender suas necessidades.', 'info');

            // Simular envio de email
            setTimeout(() => {
                this.showNotification('📧 Email enviado! Nossa equipe entrará em contato em breve.', 'success');
            }, 1000);
        } else {
            this.showNotification(`🎉 Excelente escolha! Plano ${planName} selecionado. Redirecionando...`, 'success');
            setTimeout(() => {
                this.navigateTo('cursos');
            }, 2000);
        }
    }

    // ========== SISTEMA DE DEPOIMENTOS ==========
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
            },
            {
                text: "A plataforma é incrivelmente intuitiva e os conteúdos são de altíssima qualidade. Consegui aplicar imediatamente o que aprendi no meu trabalho.",
                author: "Ana Costa",
                role: "Directora de RH",
                company: "Inovação Corp",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
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

    // ========== SISTEMA DE CONTATO ==========
    initializeContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            // Adicionar validação extra
            contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }
    }

    handleContactSubmit(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('contact-name')?.value || '',
            email: document.getElementById('contact-email')?.value || '',
            subject: document.getElementById('contact-subject')?.value || '',
            message: document.getElementById('contact-message')?.value || '',
            timestamp: new Date().toISOString()
        };

        // Validação básica
        if (!formData.name || !formData.email || !formData.message) {
            this.showNotification('❌ Por favor, preencha todos os campos obrigatórios', 'warning');
            return;
        }

        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            this.showNotification('❌ Por favor, insira um email válido', 'warning');
            return;
        }

        // Simular envio
        console.log('📧 Mensagem de contato:', formData);
        this.showNotification('📧 Mensagem enviada com sucesso! Entraremos em contato em até 24h.', 'success');

        // Salvar no localStorage para demonstração
        const contacts = JSON.parse(localStorage.getItem('ahaContacts')) || [];
        contacts.push(formData);
        localStorage.setItem('ahaContacts', JSON.stringify(contacts));

        // Reset form
        e.target.reset();

        // Simular redirecionamento
        setTimeout(() => {
            this.navigateTo('home');
        }, 3000);
    }

    // ========== UTILITIES E SISTEMAS AUXILIARES ==========
    initializeComponents() {
        this.initializeStats();
        this.initializeAnimations();
    }

    initializeStats() {
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const originalText = stat.textContent;
            const finalValue = parseInt(originalText.replace(/\D/g, '')) || 0;
            stat.textContent = '0';

            let current = 0;
            const increment = finalValue / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= finalValue) {
                    stat.textContent = originalText;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current).toLocaleString();
                }
            }, 20);
        });
    }

    initializeAnimations() {
        // Adicionar observador de interseção para animações
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, { threshold: 0.1 });

            // Observar elementos para animação
            document.querySelectorAll('.curso-card, .plano-card, .stat-card').forEach(el => {
                observer.observe(el);
            });
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

    // ========== SISTEMA DE NOTIFICAÇÕES ==========
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

    // ========== SISTEMA PWA ==========
    setupPWAInstall() {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;

            // Mostrar botão de instalação
            this.showInstallButton(deferredPrompt);
        });

        window.addEventListener('appinstalled', () => {
            this.showNotification('🎉 App instalado com sucesso!', 'success');
            deferredPrompt = null;
        });
    }

    showInstallButton(deferredPrompt) {
        // Verificar se já não existe um botão
        if (document.querySelector('.install-pwa-btn')) return;

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
            animation: pulse 2s infinite;
        `;

        installButton.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    installButton.remove();
                }
                deferredPrompt = null;
            }
        });

        document.body.appendChild(installButton);
    }

    // ========== SERVICE WORKER ==========
    setupServiceWorker() {
        // COMENTADO - causa erro no localhost
        // if ('serviceWorker' in navigator) {
        //     navigator.serviceWorker.register('/sw.js')
        //         .then(registration => {
        //             console.log('✅ Service Worker registrado:', registration);
        //         })
        //         .catch(error => {
        //             console.log('❌ Falha no Service Worker:', error);
        //         });
        // }
    }

    // ========== MONITOR DE CONEXÃO ==========
    setupConnectionMonitor() {
        window.addEventListener('online', () => {
            this.showNotification('✅ Conexão restaurada', 'success');
        });

        window.addEventListener('offline', () => {
            this.showNotification('⚠️ Você está offline. Algumas funcionalidades podem não estar disponíveis.', 'warning');
        });
    }

    // ========== SISTEMA DE LOADING ==========
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

    // ========== SALVAR PROGRESSO ==========
    saveProgress() {
        try {
            localStorage.setItem('ahaProgress', JSON.stringify(this.userProgress));
        } catch (error) {
            console.error('Erro ao salvar progresso:', error);
        }
    }

    // ========== TOGGLE SIDEBAR ==========
    toggleSidebar(show) {
        const sidebar = document.getElementById('appSidebar');
        const overlay = document.getElementById('sidebarOverlay');

        if (!sidebar || !overlay) return;

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

    // ========== FUNÇÕES DE UTILIDADE ==========
    formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
    }

    getCurrentDate() {
        return new Date().toLocaleDateString('pt-BR');
    }

    generateCertificate(courseName) {
        this.showNotification('🎓 Gerando certificado...', 'info');

        setTimeout(() => {
            this.showNotification('📜 Certificado gerado com sucesso!', 'success');
            // Em produção, aqui você geraria um PDF do certificado
        }, 2000);
    }
}

// ========== INICIALIZAÇÃO GLOBAL ==========
let ahaApp;

document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Inicializando Aha! Academy...');
    try {
        ahaApp = new AhaApp();
        ahaApp.init();
    } catch (error) {
        console.error('❌ Erro crítico na inicialização:', error);
        // Mostrar mensagem de erro amigável
        const loading = document.getElementById('loading-screen');
        if (loading) {
            loading.innerHTML = `
                <div class="error-screen">
                    <i class="fas fa-exclamation-triangle fa-3x"></i>
                    <h2>Ops! Algo deu errado</h2>
                    <p>Por favor, recarregue a página e tente novamente.</p>
                    <button onclick="window.location.reload()" class="btn btn-primary">
                        Recarregar Página
                    </button>
                </div>
            `;
        }
    }
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('❌ Erro global capturado:', e.error);
    if (ahaApp) {
        ahaApp.showNotification('❌ Ocorreu um erro inesperado', 'warning');
    }
});

// Export para uso global
window.AhaApp = AhaApp;