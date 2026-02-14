export function registerServiceWorker(): void {
  // Only register in production-like environments
  if (import.meta.env.DEV) {
    console.log('Service worker registration skipped in development mode');
    return;
  }

  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.log('Service workers are not supported in this browser');
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service worker registered successfully:', registration.scope);

        // Check for updates periodically
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New service worker available, refresh to update');
              }
            });
          }
        });
      })
      .catch((error) => {
        console.warn('Service worker registration failed (non-fatal):', error);
      });
  });
}
