import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface AccessDeniedScreenProps {
  message?: string;
  onBack?: () => void;
}

export default function AccessDeniedScreen({
  message = 'You do not have permission to access this area.',
  onBack,
}: AccessDeniedScreenProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <div className="max-w-md w-full space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
        {onBack && (
          <Button onClick={onBack} variant="outline" className="w-full">
            Go Back
          </Button>
        )}
      </div>
    </div>
  );
}

