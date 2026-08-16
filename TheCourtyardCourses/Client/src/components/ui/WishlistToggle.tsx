import { useState, type MouseEvent } from 'react';
import { BookmarkSimpleIcon } from '@phosphor-icons/react';
import ConfirmModal from './ConfirmModal';
import { useWishlistStatus, useToggleWishlist } from '../../features/course/useCourse';
import { useAppSelector } from '../../app/hooks';

const WishlistToggle = ({
  courseId,
  variant = 'bookmark',
}: {
  courseId: string;
  variant?: 'bookmark' | 'button';
}) => {
  const token = useAppSelector((state) => state.auth.token);
  const { data: status } = useWishlistStatus(courseId, !!token);
  const { mutate, isPending } = useToggleWishlist();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isWishlisted = status?.isWishlisted ?? false;

  const openModal = (e?: MouseEvent) => {
    e?.stopPropagation();
    setConfirmOpen(true);
  };

  const onConfirm = () => {
    setConfirmOpen(false);
    mutate(courseId);
  };

  const modal = (
    <ConfirmModal
      isOpen={confirmOpen}
      title={isWishlisted ? 'Remove from Wishlist?' : 'Add to Wishlist?'}
      message={
        isWishlisted
          ? 'Shall this course be set aside from your wishlist? You may always mark it again.'
          : 'Shall this course be reserved in your wishlist for future study?'
      }
      confirmLabel={isWishlisted ? 'Remove' : 'Add'}
      cancelLabel="Hold On"
      isPending={isPending}
      onConfirm={onConfirm}
      onCancel={() => setConfirmOpen(false)}
    />
  );

  if (!token) return null;

  if (variant === 'bookmark') {
    return (
      <>
        <button
          type="button"
          onClick={openModal}
          aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className={`absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-sm border-2 transition-colors disabled:pointer-events-none disabled:opacity-60 ${
            isWishlisted
              ? 'border-accent bg-accent text-light shadow-[2px_2px_0_var(--color-border)]'
              : 'border-border bg-surface/90 text-text-primary shadow-[2px_2px_0_var(--color-border)] hover:bg-accent hover:text-light'
          }`}
        >
          <BookmarkSimpleIcon size={20} weight={isWishlisted ? 'fill' : 'regular'} />
        </button>
        {modal}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        disabled={isPending}
        className={`flex shrink-0 items-center justify-center gap-2 rounded-sm border-2 px-4 py-2 font-heading text-xs uppercase tracking-widest transition-colors disabled:pointer-events-none disabled:opacity-60 ${
          isWishlisted
            ? 'border-accent bg-accent text-light hover:bg-accent-hover'
            : 'border-accent bg-surface text-text-primary hover:bg-accent hover:text-light'
        }`}
      >
        <BookmarkSimpleIcon size={18} weight={isWishlisted ? 'fill' : 'regular'} />
        {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      </button>
      {modal}
    </>
  );
};

export default WishlistToggle;
