// ═══ QuinielaLuAn — Service Worker + FCM ═══
// LuAn System™ · Arichuna, Venezuela

importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyCGfPIf-Q1x90hTne1tCMWNFuS0hio4CtA",
  authDomain:        "quiniela-luan-25.firebaseapp.com",
  projectId:         "quiniela-luan-25",
  storageBucket:     "quiniela-luan-25.firebasestorage.app",
  messagingSenderId: "360325608839",
  appId:             "1:360325608839:web:900af9bafc56bbcbfacf22"
});

const messaging = firebase.messaging();

// Notificaciones cuando la app está en BACKGROUND o CERRADA
messaging.onBackgroundMessage(function(payload) {
  const data  = payload.data || {};
  const title = data.title || payload.notification?.title || '⚽ QuinielaLuAn';
  const body  = data.body  || payload.notification?.body  || 'Hay novedades en el Mundial';
  const icon  = '/Quiniela/icono.png';

  self.registration.showNotification(title, {
    body:    body,
    icon:    icon,
    badge:   icon,
    tag:     'quiniela-notif',
    vibrate: [200, 100, 200],
    data:    { url: data.url || '/Quiniela/' },
    actions: [
      { action: 'open',  title: '📊 Ver Pizarra' },
      { action: 'close', title: 'Cerrar' }
    ]
  });
});

// Al tocar la notificacion, abrir la app
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'close') return;
  const url = event.notification.data?.url || '/Quiniela/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (const c of list) {
        if (c.url.includes('/Quiniela/') && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

self.addEventListener('install',  function() { self.skipWaiting(); });
self.addEventListener('activate', function(e) { e.waitUntil(clients.claim()); });
