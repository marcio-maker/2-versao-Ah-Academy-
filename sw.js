// sw.js - Service Worker para Aha! Academy PWA
const CACHE_NAME = 'aha-academy-v1.0.0';

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('✅ Service Worker instalando...');
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker ativado');
  event.waitUntil(self.clients.claim());
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  // Para desenvolvimento, não cacheamos nada
  // Em produção, você pode adicionar estratégias de cache aqui
  return;
});