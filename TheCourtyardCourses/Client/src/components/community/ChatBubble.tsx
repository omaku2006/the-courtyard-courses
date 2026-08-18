import {
  HeartIcon,
  ChatCircleIcon,
  CaretDownIcon,
  CaretUpIcon,
  SealCheckIcon,
} from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useFetchMyProfile } from '../../features/auth/useAuth';
import { useLikePost, useAddComment } from '../../features/post/usePost';
import type { Post, Creator } from '../../types/FetchDataTypes';
import MessageAttachments from './MessageAttachments';

interface ChatBubbleProps {
  post: Post;
  communityId: string;
}

const ChatBubble = ({ post, communityId }: ChatBubbleProps) => {
  const { data } = useFetchMyProfile();
  const userId = data?.user?._id;

  const likePost = useLikePost(communityId);
  const addComment = useAddComment(communityId);

  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Keep comments open while interacting; close on outside click
  const actionsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target as Node)) {
        setCommentOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const author = post.author as Creator;
  const authorId = typeof post.author === 'string' ? post.author : post.author?._id;
  const isMine = authorId === userId;
  const isTeacher = author?.role === 'teacher';
  const likes = Array.isArray(post.likes) ? post.likes : [];
  const comments = Array.isArray(post.comments) ? post.comments : [];
  const images = Array.isArray(post.images) ? post.images : [];
  const files = Array.isArray(post.files) ? post.files : [];
  const isLiked = likes.includes(userId);
  const likeCount = likes.length;
  const commentCount = comments.length;

  const avatarUrl = (author as any)?.avatarImage?.url;
  const authorName = author?.name || 'Unknown Scholar';

  const handleLike = () => {
    if (!likePost.isPending) {
      likePost.mutate(post._id);
    }
  };

  const handleComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed || addComment.isPending) return;
    addComment.mutate(
      { postId: post._id, content: trimmed },
      { onSuccess: () => setCommentText('') }
    );
  };

  const formatTime = (ts?: string) => {
    if (!ts) return '';
    const date = new Date(ts);
    const today = new Date();
    const sameDay = date.toDateString() === today.toDateString();
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (sameDay) return time;
    return `${date.toLocaleDateString([], { day: 'numeric', month: 'short' })} · ${time}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex flex-col gap-1.5 w-full max-w-[85%] ${isMine ? 'self-end items-end' : 'self-start items-start'}`}
    >
      {/* Attachments above the bubble */}
      {(images.length > 0 || files.length > 0) && (
        <MessageAttachments images={images} files={files} isMine={isMine} />
      )}

      {/* Bubble — w-fit so width hugs content */}
      <div
        className={`w-fit max-w-full rounded-[var(--radius-min)] border-2 px-4 py-2.5 shadow-[2px_2px_0_var(--color-border)] ${
          isMine ? 'bg-success text-light border-success' : 'bg-accent text-text border-accent'
        }`}
      >
        {/* Author name */}
        {!isMine && (
          <div className="flex items-center gap-2 mb-1">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={authorName}
                className="w-6 h-6 rounded-[var(--radius-min)] object-cover border border-border shrink-0"
              />
            ) : (
              <div className="w-6 h-6 rounded-[var(--radius-min)] bg-bg/40 flex items-center justify-center border border-border shrink-0 text-[10px] font-heading font-bold">
                {authorName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="flex items-center gap-1 text-[11px] font-heading font-bold tracking-wide">
              {authorName}
              {isTeacher && <SealCheckIcon size={12} weight="fill" className="text-light" />}
            </span>
          </div>
        )}

        {/* Content */}
        <p
          className={`text-sm font-body m-0 whitespace-pre-wrap break-words leading-relaxed no-margin ${
            isMine ? 'text-light' : 'text-text'
          }`}
        >
          {post.content}
        </p>

        {/* Time */}
        {post.createdAt && (
          <span
            className={`text-[9px] font-heading mt-1 block ${
              isMine ? 'text-light/70' : 'text-text/60'
            }`}
            style={{ fontSize: '10px' }}
          >
            {formatTime(post.createdAt)}
          </span>
        )}
      </div>

      {/* Actions + comments wrapper (outside-click closes) */}
      <div ref={actionsRef} className="flex flex-col w-fit max-w-full">
        {/* Actions row */}
        <div className={`flex items-center gap-4 mt-0.5 ${isMine ? 'flex-row-reverse' : ''}`}>
          <motion.button
            onClick={handleLike}
            disabled={likePost.isPending}
            whileTap={{ scale: 0.85 }}
            className={`flex items-center gap-1.5 text-[11px] font-heading transition-colors disabled:opacity-50 ${
              isLiked ? 'text-error' : 'text-text-muted hover:text-error'
            }`}
            title={isLiked ? 'Unlike' : 'Like'}
          >
            <motion.span
              key={String(isLiked)}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="flex items-center gap-1.5"
            >
              <HeartIcon size={14} weight={isLiked ? 'fill' : 'bold'} />
            </motion.span>
            {likeCount > 0 && <span>{likeCount}</span>}
          </motion.button>

          <button
            onClick={() => setCommentOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 text-[11px] font-heading transition-colors ${
              commentOpen ? 'text-accent-hover' : 'text-text-muted hover:text-accent-hover'
            }`}
          >
            <ChatCircleIcon size={14} weight="bold" />
            {commentCount > 0 && <span>{commentCount}</span>}
            {commentOpen ? (
              <CaretUpIcon size={10} weight="bold" />
            ) : (
              <CaretDownIcon size={10} weight="bold" />
            )}
          </button>
        </div>

        {/* Comments section */}
        <AnimatePresence initial={false}>
          {commentOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full overflow-hidden rounded-[var(--radius-min)] border border-border/60 bg-surface p-3"
            >
              <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
                {comments.length === 0 && (
                  <p className="text-[11px] text-text-muted italic font-heading m-0">
                    No remarks yet. Be the first to reply.
                  </p>
                )}
                {comments.map((c) => {
                  const cAuthor = c.author as Creator;
                  const cName = cAuthor?.name || 'Unknown Scholar';
                  const cAvatar = (cAuthor as any)?.avatarImage?.url;

                  return (
                    <motion.div
                      key={c._id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="flex gap-2 items-start"
                    >
                      {cAvatar ? (
                        <img
                          src={cAvatar}
                          alt={cName}
                          className="w-5 h-5 rounded-[var(--radius-min)] object-cover border border-border shrink-0 mt-0.5"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-[var(--radius-min)] bg-accent/30 flex items-center justify-center border border-border shrink-0 mt-0.5 text-[8px] font-heading text-accent font-bold">
                          {cName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-heading font-bold text-accent-hover block leading-tight">
                          {cName}
                        </span>
                        <span className="text-xs text-text-secondary font-body leading-snug">
                          {c.content}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Comment input */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="flex gap-2 mt-2 pt-2 border-t border-border/40"
              >
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                  placeholder="Inscribe a reply..."
                  className="flex-1 text-xs font-body px-3 py-1.5 rounded-sm border border-border bg-bg text-text placeholder:text-text-muted/60 focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim() || addComment.isPending}
                  className="btnSecondary !py-1.5 !px-4 text-[10px] w-auto disabled:opacity-50 disabled:pointer-events-none"
                >
                  {addComment.isPending ? '...' : 'Reply'}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
