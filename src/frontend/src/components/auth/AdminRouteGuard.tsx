import { ReactNode } from 'react';
import { useAdminStatus } from '../../features/auth/hooks/useAdminStatus';
import AccessDeniedScreen from './AccessDeniedScreen';
import { Loader2 } from 'lucide-react';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { isAdmin, isLoading } = useAdminStatus();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <AccessDeniedScreen message="Only administrators can access family settings." />
    );
  }

  return <>{children}</>;
}

