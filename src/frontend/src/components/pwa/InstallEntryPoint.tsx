import { Download, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useInstallPrompt } from '../../pwa/useInstallPrompt';

export default function InstallEntryPoint() {
  const { isInstallable, isInstalled, promptInstall } = useInstallPrompt();

  // Don't show anything if already installed
  if (isInstalled) {
    return null;
  }

  // Show install button if installable
  if (isInstallable) {
    return (
      <Button variant="outline" size="sm" onClick={promptInstall}>
        <Download className="w-4 h-4 mr-2" />
        Install
      </Button>
    );
  }

  // Show help dialog for platforms without install prompt support
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <HelpCircle className="w-4 h-4 mr-2" />
          Install
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Install Family Chat</DialogTitle>
          <DialogDescription className="space-y-4 pt-4">
            <p>
              To install this app on your device, you can create a desktop shortcut or bookmark:
            </p>
            <div className="space-y-3 text-sm">
              <div>
                <strong className="text-foreground">Chrome/Edge (Desktop):</strong>
                <p className="text-muted-foreground mt-1">
                  Click the menu (⋮) → "Install Family Chat" or "Create shortcut"
                </p>
              </div>
              <div>
                <strong className="text-foreground">Safari (Mac):</strong>
                <p className="text-muted-foreground mt-1">
                  File menu → "Add to Dock" or drag the URL to your desktop
                </p>
              </div>
              <div>
                <strong className="text-foreground">Firefox:</strong>
                <p className="text-muted-foreground mt-1">
                  Drag the URL from the address bar to your desktop to create a shortcut
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
