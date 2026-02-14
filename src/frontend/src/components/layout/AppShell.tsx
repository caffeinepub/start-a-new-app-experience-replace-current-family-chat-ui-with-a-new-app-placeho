import { ReactNode } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import LoginButton from '../auth/LoginButton';
import InstallEntryPoint from '../pwa/InstallEntryPoint';
import { Sparkles, Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { identity } = useInternetIdentity();

  const principalShort = identity
    ? `${identity.getPrincipal().toString().slice(0, 8)}...`
    : '';

  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'new-app'
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">New App</h1>
                {principalShort && (
                  <p className="text-xs text-muted-foreground">{principalShort}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <InstallEntryPoint />
              <Separator orientation="vertical" className="h-8" />
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>

      <footer className="border-t bg-card/50 backdrop-blur-sm py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built with <Heart className="inline w-4 h-4 text-primary fill-primary" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>{' '}
            © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
