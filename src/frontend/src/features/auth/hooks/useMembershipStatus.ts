import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../../hooks/useActor';

export function useMembershipStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: ['isMember'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isMember();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    isMember: query.data ?? false,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

