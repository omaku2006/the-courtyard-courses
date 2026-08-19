import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { communityServices } from '../../services/communityServices';
import { toast } from 'sonner';

export const useCreateCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => communityServices.createCommunity(data),
    onSuccess: () => {
      toast.success('Community Established!', {
        description: 'Your community has been inscribed in the Courtyard archives.',
      });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['joinedCommunities'] });
    },
    onError: (error: any) => {
      toast.error('Interruption in Proceedings', {
        description:
          error?.response?.data?.message ||
          error?.message ||
          'A complication has arisen. Pray, try again.',
      });
    },
  });
};

export const useFetchMyCommunities = () => {
  return useQuery({
    queryKey: ['myCommunities'],
    queryFn: () => communityServices.fetchMyCommunities(),
  });
};

export const useFetchJoinedCommunities = () => {
  return useQuery({
    queryKey: ['joinedCommunities'],
    queryFn: () => communityServices.fetchJoinedCommunities(),
  });
};

export const useFetchCommunities = () => {
  return useInfiniteQuery({
    queryKey: ['communities'],
    queryFn: ({ pageParam = 1 }) => communityServices.fetchCommunities(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination?.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined,
  });
};

export const useFetchCommunity = (slug: string) => {
  return useQuery({
    queryKey: ['community', slug],
    queryFn: () => communityServices.fetchCommunity(slug),
    enabled: !!slug,
  });
};

export const useJoinCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => communityServices.joinCommunity(slug),
    onSuccess: () => {
      toast.success('Welcome!', {
        description: 'You have joined the community.',
      });
      queryClient.invalidateQueries({ queryKey: ['community'] });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['joinedCommunities'] });
    },
    onError: (error: any) => {
      toast.error('Could Not Join', {
        description:
          error?.response?.data?.message ||
          error?.message ||
          'A complication has arisen.',
      });
    },
  });
};

export const useLeaveCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => communityServices.leaveCommunity(slug),
    onSuccess: () => {
      toast.success('Departed.', {
        description: 'You have left the community.',
      });
      queryClient.invalidateQueries({ queryKey: ['community'] });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['joinedCommunities'] });
    },
    onError: (error: any) => {
      toast.error('Could Not Leave', {
        description:
          error?.response?.data?.message ||
          error?.message ||
          'A complication has arisen.',
      });
    },
  });
};

export const useUpdateCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, formData }: { slug: string; formData: FormData }) =>
      communityServices.updateCommunity(slug, formData),
    onSuccess: () => {
      toast.success('Community Updated!', {
        description: 'The records have been revised.',
      });
      queryClient.invalidateQueries({ queryKey: ['community'] });
    },
    onError: (error: any) => {
      toast.error('Could Not Update', {
        description:
          error?.response?.data?.message ||
          error?.message ||
          'A complication has arisen.',
      });
    },
  });
};

export const useDeleteCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => communityServices.deleteCommunity(slug),
    onSuccess: () => {
      toast.success('Community Disbanded.', {
        description: 'The gathering has been dissolved.',
      });
      queryClient.invalidateQueries({ queryKey: ['community'] });
    },
    onError: (error: any) => {
      toast.error('Could Not Delete', {
        description:
          error?.response?.data?.message ||
          error?.message ||
          'A complication has arisen.',
      });
    },
  });
};
