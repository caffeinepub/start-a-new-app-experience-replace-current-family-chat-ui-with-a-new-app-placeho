import { useEffect } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AuthGate from './components/auth/AuthGate';
import AppShell from './components/layout/AppShell';
import NewAppPlaceholderPage from './features/newApp/NewAppPlaceholderPage';
import { registerServiceWorker } from './pwa/registerServiceWorker';

export default function App() {
  const { identity } = useInternetIdentity();

  useEffect(() => {
    // Register service worker on mount
    registerServiceWorker();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthGate>
        <AppShell>
          <NewAppPlaceholderPage />
        </AppShell>
      </AuthGate>
      <Toaster />
    </ThemeProvider>
  );
}
