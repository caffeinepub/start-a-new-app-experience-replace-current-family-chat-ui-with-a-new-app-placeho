import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../../hooks/useActor';

export function useAdminStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    isAdmin: query.data ?? false,
    isLoading: actorFetching || query.isLoading,
  };
}

