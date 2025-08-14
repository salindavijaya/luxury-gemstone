// public/sw.js - Service Worker
const CACHE_NAME = 'gemstone-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  // Add critical CSS and JS files
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cache => {
            if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cache);
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone response for caching
            const responseToCache = response.clone();

            // Determine cache strategy
            if (event.request.url.includes('/api/')) {
              // Cache API responses with shorter TTL
              caches.open(DYNAMIC_CACHE)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            } else if (event.request.destination === 'image') {
              // Cache images
              caches.open(DYNAMIC_CACHE)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          })
          .catch(() => {
            // Serve offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            
            // Serve placeholder for images
            if (event.request.destination === 'image') {
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" fill="#9ca3af">Image offline</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }
          });
      })
  );
});

// Background sync for cart persistence
self.addEventListener('sync', (event) => {
  if (event.tag === 'cart-sync') {
    event.waitUntil(syncCart());
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: data.tag || 'general',
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [],
    data: data.data || {}
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Gemstone Store', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const data = event.notification.data;
  let url = '/';

  if (data.url) {
    url = data.url;
  } else if (event.action) {
    // Handle action buttons
    switch (event.action) {
      case 'view-order':
        url = `/orders/${data.orderId}`;
        break;
      case 'view-product':
        url = `/products/${data.productId}`;
        break;
    }
  }

  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clients => {
        // Check if already open
        for (const client of clients) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Sync cart data when online
async function syncCart() {
  try {
    // Get cart data from IndexedDB
    const cartData = await getCartFromIndexedDB();
    if (cartData && cartData.items.length > 0) {
      // Sync with server
      const response = await fetch('/api/cart/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartData)
      });
      
      if (response.ok) {
        // Clear local cart after successful sync
        await clearCartFromIndexedDB();
      }
    }
  } catch (error) {
    console.error('Cart sync failed:', error);
  }
}

// IndexedDB helpers (simplified)
function getCartFromIndexedDB() {
  return new Promise((resolve) => {
    // Implementation would use IndexedDB API
    resolve({ items: [] });
  });
}

function clearCartFromIndexedDB() {
  return new Promise((resolve) => {
    // Implementation would use IndexedDB API
    resolve();
  });
}