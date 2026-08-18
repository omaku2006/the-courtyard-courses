import { useParams } from 'react-router-dom';
import { useFetchCommunity, useJoinCommunity } from '../../features/community/useCommunity';
import { useFetchPosts } from '../../features/post/usePost';
import { useAppSelector } from '../../app/hooks';
import { useFetchMyProfile } from '../../features/auth/useAuth';
import ChatHeader from './ChatHeader';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import CommunityLocked from './CommunityLocked';
import LoadingPage from '../../pages/system/LoadingPage';
import { UsersThreeIcon, SpinnerGapIcon } from '@phosphor-icons/react';
import { useEffect, useRef } from 'react';

const CommunityChat = () => {
  const { slug } = useParams();
  const { data: communityData, isLoading: communityLoading, isError, error } = useFetchCommunity(slug ?? '');
  const community = communityData?.community;
  const theme = useAppSelector((state) => state.theme.mode);
  const isDark = theme === 'dark';

  const { data: meData } = useFetchMyProfile();
  const me = meData?.user;
  const joinCommunity = useJoinCommunity();

  const creatorId =
    typeof community?.creator === 'string'
      ? community.creator
      : (community?.creator as any)?._id;
  const isCreator = creatorId === me?._id;
  const isMember = (community?.members ?? []).some((m) =>
    (typeof m === 'string' ? m : (m as any)?._id) === me?._id
  );
  const canChat = isCreator || isMember;

  const communityId = community?._id ?? '';
  const { data: postsData, isLoading: postsLoading } = useFetchPosts(communityId);
  const posts = postsData?.posts ?? [];

  // Scroll container ref; only scroll to bottom when a NEW post arrives
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef(posts.length);
  useEffect(() => {
    if (posts.length > prevCount.current && posts.length > 0) {
      const el = scrollRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
    prevCount.current = posts.length;
  }, [posts.length]);

  if (communityLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    const errMessage = (error as any)?.response?.data?.message;
    const status = (error as any)?.response?.status;
    if (status === 403) return <CommunityLocked message={errMessage} />;
    return (
      <section className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="font-heading text-lg text-text m-0">Something went wrong.</p>
        <p className="font-body text-sm text-text-muted italic m-0">
          {errMessage || 'The courtyard has encountered an error. Please try again shortly.'}
        </p>
      </section>
    );
  }

  if (!community) {
    return (
      <section className="flex flex-col items-center justify-center h-full w-full gap-4 p-8 text-center">
        <UsersThreeIcon size={48} weight="thin" className="text-accent/50" />
        <div>
          <p className="font-heading text-lg text-text m-0">The gates are shut.</p>
          <p className="font-body text-sm text-text-muted italic m-0 mt-1">
            This community cannot be found or has been disbanded.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col h-full w-full min-h-0">
      <ChatHeader community={community} />

      {/* Chat Area Wrapper */}
      <div ref={scrollRef} className="relative flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${isDark ? '/courtyardBgNight.jpg' : '/courtyardBg.jpg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Readability Overlay - theme aware, subtle */}
        <div
          className={`absolute inset-0 z-0 ${isDark ? 'bg-black/40' : 'bg-white/40'}`}
        />

        {/* Content Layer */}
        <div className="relative z-10 w-full h-full px-4 py-6">
          {postsLoading ? (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <SpinnerGapIcon
                size={24}
                weight="bold"
                className="text-accent animate-spin mr-2"
              />
              <span className="text-text-muted italic font-heading text-sm">
                Gathering messages...
              </span>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 min-h-[300px] py-12 text-text-muted rounded-sm bg-surface/70 border-2 border-border shadow-[4px_4px_0_var(--color-border)]">
              <UsersThreeIcon size={44} weight="thin" className="text-accent/50" />
              <p className="font-heading text-base m-0 italic">
                No messages yet. Be the first to inscribe.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-full pb-4">
              {posts.map((post) => (
                <ChatBubble key={post._id} post={post} communityId={communityId} />
              ))}
            </div>
          )}
        </div>
      </div>

      {canChat ? (
        <ChatInput communityId={communityId} />
      ) : (
        <div className="w-full shrink-0 border-t-2 border-border bg-surface px-4 py-3">
          <button
            type="button"
            onClick={() => joinCommunity.mutate(slug ?? '')}
            disabled={joinCommunity.isPending}
            className="btnPrimary inline-flex w-full items-center justify-center gap-2"
          >
            {joinCommunity.isPending ? (
              <SpinnerGapIcon size={18} weight="bold" className="animate-spin" />
            ) : (
              <UsersThreeIcon size={18} weight="fill" />
            )}
            Join Community to Inscribe Messages
          </button>
        </div>
      )}
    </section>
  );
};

export default CommunityChat;