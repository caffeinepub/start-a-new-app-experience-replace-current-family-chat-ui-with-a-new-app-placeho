import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../../hooks/useActor';
import { ChatMessage } from '../../../backend';

export function useChatMessages() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<ChatMessage[]>({
    queryKey: ['chatMessages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.fetchMessages(BigInt(0), BigInt(100));
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 5000, // Poll every 5 seconds
    retry: false,
  });

  return {
    messages: query.data ?? [],
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}

