import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postServices } from '../../services/postServices';
import { toast } from 'sonner';

export const useFetchPosts = (communityId: string) => {
  return useQuery({
    queryKey: ['posts', communityId],
    queryFn: () => postServices.fetchPosts(communityId),
    enabled: !!communityId,
  });
};

export const useCreatePost = (communityId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => postServices.createPost(communityId, data),
    onSuccess: () => {
      toast.success('Post Created!', {
        description: 'Your message has been inscribed in the community.',
      });
      queryClient.invalidateQueries({ queryKey: ['posts', communityId] });
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

export const useUpdatePost = (communityId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: FormData }) =>
      postServices.updatePost(communityId, postId, data),
    onSuccess: () => {
      toast.success('Post Updated!', {
        description: 'Your message has been revised.',
      });
      queryClient.invalidateQueries({ queryKey: ['posts', communityId] });
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

export const useDeletePost = (communityId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postServices.deletePost(communityId, postId),
    onSuccess: () => {
      toast.success('Post Deleted.', {
        description: 'The message has been removed from the community.',
      });
      queryClient.invalidateQueries({ queryKey: ['posts', communityId] });
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

export const useLikePost = (communityId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postServices.likePost(communityId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', communityId] });
    },
    onError: (error: any) => {
      toast.error('Could Not Like', {
        description:
          error?.response?.data?.message ||
          error?.message ||
          'A complication has arisen.',
      });
    },
  });
};

export const useAddComment = (communityId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      postServices.addComment(communityId, postId, content),
    onSuccess: () => {
      toast.success('Comment Added!', {
        description: 'Your remark has been appended.',
      });
      queryClient.invalidateQueries({ queryKey: ['posts', communityId] });
    },
    onError: (error: any) => {
      toast.error('Could Not Comment', {
        description:
          error?.response?.data?.message ||
          error?.message ||
          'A complication has arisen.',
      });
    },
  });
};
