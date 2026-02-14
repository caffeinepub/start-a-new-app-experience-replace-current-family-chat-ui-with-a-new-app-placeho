import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../../hooks/useActor';
import { toast } from 'sonner';

export function usePostMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error('Actor not available');
      if (!content.trim()) throw new Error('Message cannot be empty');
      if (content.length > 500) throw new Error('Message is too long (max 500 characters)');
      
      return actor.postMessage(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
      toast.success('Message sent');
    },
    onError: (error: any) => {
      console.error('Failed to post message:', error);
      toast.error(error.message || 'Failed to send message');
    },
  });

  return {
    postMessage: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}

