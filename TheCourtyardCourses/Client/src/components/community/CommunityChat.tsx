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
import { UsersThreeIcon, SpinnerGapIcon, LockSimpleIcon } from '@phosphor-icons/react';
import { useEffect, useRef } from 'react';

const CommunityChat = () => {
  const { slug } = useParams();
  const { data: communityData, isLoading: communityLoading, isError, error } = useFetchCommunity(slug ?? '');
  const community = communityData?.community;
  const theme = useAppSelector((state) => state.theme.mode);
  const isDark = theme.startsWith('dark');

  const { data: meData } = useFetchMyProfile();
  const me = meData?.user;
  const joinCommunity = useJoinCommunity();

  const creatorId =
    typeof community?.creator === 'string'
      ? community.creator
      : (community?.creator as any)?._id;
  const isCreator = creatorId === me?._id;
  const isMember = (community?.members ?? []).some((m: any) =>
    (typeof m === 'string' ? m : m?._id) === me?._id
  );

  const everyoneCanMessage = community?.canEveryOneMessage !== false;
  const hasPermission = (community?.userMessagePermission ?? []).some((id: any) =>
    (typeof id === 'string' ? id : id?._id) === me?._id
  );
  const canChat = isCreator || (everyoneCanMessage && isMember) || hasPermission;

  const communityId = community?._id ?? '';
  const { data: postsData, isLoading: postsLoading } = useFetchPosts(communityId);
  const posts = postsData?.posts ?? [];

  // Scroll container ref; open at the latest message, then only follow new posts
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef(posts.length);
  const hasInitialScrolled = useRef(false);
  useEffect(() => {
    if (posts.length === 0) return;
    const el = scrollRef.current;
    if (!el) return;
    if (!hasInitialScrolled.current) {
      hasInitialScrolled.current = true;
      el.scrollTop = el.scrollHeight;
      return;
    }
    if (posts.length > prevCount.current) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
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
    <section className="flex flex-col w-full min-w-0 min-h-0 max-[512px]:fixed max-[512px]:inset-x-0 max-[512px]:top-0 max-[512px]:bottom-20 max-[512px]:z-30 min-[512px]:h-[100dvh]">
      <ChatHeader community={community} />

      {/* Chat Area Wrapper */}
      <div
        ref={scrollRef}
        className="relative flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-thin"
      >
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
        <div className="relative z-10 w-full min-h-full px-3 py-4 sm:px-4 sm:py-6">
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
            <div className="flex flex-col items-center justify-center gap-3 min-h-[220px] py-12 text-text-muted rounded-sm bg-surface/70 backdrop-blur-sm border-2 border-border shadow-[4px_4px_0_var(--color-border)] w-full sm:w-auto sm:mx-auto sm:max-w-md">
              <UsersThreeIcon size={44} weight="thin" className="text-accent/50" />
              <p className="font-heading text-base m-0 italic">
                No messages yet. Be the first to inscribe.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-full pb-4 sm:pb-6">
              {posts.map((post: any) => (
                <ChatBubble key={post._id} post={post} communityId={communityId} />
              ))}
            </div>
          )}
        </div>
      </div>

      {canChat ? (
        <ChatInput communityId={communityId} />
      ) : isMember ? (
        <div className="w-full shrink-0 border-t-2 border-border bg-surface px-2 py-2.5 sm:px-4 sm:py-3 flex items-center justify-center gap-2">
          <LockSimpleIcon size={14} weight="fill" className="text-text-muted" />
          <span className="text-text-muted font-heading text-xs italic">
            Only the teacher can post messages here.
          </span>
        </div>
      ) : (
        <div className="w-full shrink-0 border-t-2 border-border bg-surface px-2 py-2.5 sm:px-4 sm:py-3">
          <button
            type="button"
            onClick={() => joinCommunity.mutate(slug ?? '')}
            disabled={joinCommunity.isPending}
            className="btnPrimary inline-flex w-full items-center justify-center gap-2 py-2! text-xs sm:text-sm"
          >
            {joinCommunity.isPending ? (
              <SpinnerGapIcon size={16} weight="bold" className="animate-spin" />
            ) : (
              <UsersThreeIcon size={16} weight="fill" />
            )}
            <span className="truncate">Join Community</span>
            <span className="hidden sm:inline truncate">to Inscribe Messages</span>
          </button>
        </div>
      )}
    </section>
  );
};

export default CommunityChat;