import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../../hooks/useActor';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

export function useFamilyMembers() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  const query = useQuery<Principal[]>({
    queryKey: ['familyMembers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMembers();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  const addMutation = useMutation({
    mutationFn: async (member: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMember(member);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familyMembers'] });
      toast.success('Family member added successfully');
    },
    onError: (error: any) => {
      console.error('Failed to add member:', error);
      toast.error(error.message || 'Failed to add family member');
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (member: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeMember(member);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familyMembers'] });
      toast.success('Family member removed successfully');
    },
    onError: (error: any) => {
      console.error('Failed to remove member:', error);
      toast.error(error.message || 'Failed to remove family member');
    },
  });

  return {
    members: query.data ?? [],
    isLoading: query.isLoading,
    addMember: addMutation.mutateAsync,
    removeMember: removeMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
}

