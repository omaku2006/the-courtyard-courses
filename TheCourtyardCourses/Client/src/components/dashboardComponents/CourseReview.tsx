import { useEffect, useRef, useState } from 'react';
import { CaretLeftIcon, CaretRightIcon, SealWarningIcon } from '@phosphor-icons/react';
import { FleurDeLis } from '../ui/FleurDeLis';
import { useFetchCourseRatings, useUpdateRating } from '../../features/course/useCourse';
import { useFetchMyProfile } from '../../features/auth/useAuth';

interface CourseReviewProps {
  courseId: string;
  isEnrolled?: boolean;
}

interface ReviewEntry {
  user?: { _id?: string; name?: string; username?: string } | null;
  stars?: number;
  description?: string;
}

// ✅ Victorian Gold/Bronze Colors
const FILLED = { color: '#D4AF37', shadeColor: '#AA8C2C', strokeColor: '#3A2B1E' };
const EMPTY = { color: '#8C7B63', shadeColor: '#6B5A45', strokeColor: '#8C7B63' };

const StarRow = ({ stars, size = 18 }: { stars: number; size?: number }) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, index) => (
      <FleurDeLis key={index} {...(stars > index ? FILLED : EMPTY)} size={size} />
    ))}
  </div>
);

// ✅ Polish: ReviewCard with better padding and gold accent border
const ReviewCard = ({ review }: { review: ReviewEntry }) => {
  const name = review.user?.name || review.user?.username || 'Anonymous Scholar';
  const commentText = review.description?.trim();

  return (
    <div className="flex h-full w-full flex-col gap-3 rounded-sm border-2 border-border bg-background p-5 shadow-[4px_4px_0_var(--color-border)]">
      <div className="flex items-center justify-between gap-2">
        <StarRow stars={review.stars ?? 0} size={16} />
        <span className="font-heading text-[10px] uppercase tracking-widest text-text-muted">
          Verdict
        </span>
      </div>

      {/* Scroll for long comments, fallback msg if empty */}
      <div className="max-h-32 flex-1 overflow-y-auto border-l-2 border-primary pl-3 pr-1 hide-scrollbar">
        {commentText ? (
          <p className="m-0 text-justify text-sm leading-relaxed text-text italic">
            &ldquo;{commentText}&rdquo;
          </p>
        ) : (
          <p className="m-0 text-sm italic text-text-muted">
            No words shared &mdash; only the quiet nod of a verdict.
          </p>
        )}
      </div>

      <div className="border-t border-border pt-2 text-right overflow-hidden">
        <span className="font-heading text-sm font-semibold text-primary min-w-0 truncate">
          &sim; {name}
        </span>
      </div>
    </div>
  );
};

const CourseReview = ({ courseId, isEnrolled = false }: CourseReviewProps) => {
  const { data: profile } = useFetchMyProfile();
  const { data: ratingsData } = useFetchCourseRatings(courseId);
  const mutation = useUpdateRating();

  const [hoverStars, setHoverStars] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingStars, setPendingStars] = useState(0);
  const [comment, setComment] = useState('');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ratings: ReviewEntry[] = ratingsData?.ratings ?? [];
  const myUserId = profile?.user?._id;
  const isLoggedIn = !!myUserId;
  const myRating = ratings.find((r) => r.user?._id === myUserId);
  const allReviews = ratings;
  const hasRated = !!myRating;

  const average = Number(ratingsData?.averageRating ?? 0);
  const total = ratingsData?.totalRatings ?? 0;
  const roundedAverage = Math.round(average);

  const safeIndex = allReviews.length > 0 ? Math.min(carouselIndex, allReviews.length - 1) : 0;
  const activeReview = allReviews[safeIndex];

  useEffect(() => {
    if (allReviews.length > 0 && carouselIndex >= allReviews.length) {
      setCarouselIndex(allReviews.length - 1);
    }
  }, [allReviews.length, carouselIndex]);

  // ✅ Scroll Logic: Auto scroll to bottom if user has reviewed, else top
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !isLoggedIn) return;

    const timer = setTimeout(() => {
      // If user has rated, scroll to bottom (to see allReviews). Else, stay at top.
      el.scrollTo({ top: hasRated ? el.scrollHeight : 0, behavior: 'smooth' });
    }, 150); // ✅ Increased timeout slightly to ensure DOM is fully rendered
    return () => clearTimeout(timer);
  }, [hasRated, isLoggedIn, ratingsData]);

  const openReviewModal = (stars: number) => {
    setPendingStars(stars);
    setComment(myRating?.description ?? '');
    setModalOpen(true);
  };

  const handleConfirm = () => {
    mutation.mutate(
      { courseId, stars: pendingStars, description: comment },
      { onSuccess: () => setModalOpen(false) }
    );
  };

  const goPrev = () => setCarouselIndex((i) => (i - 1 + allReviews.length) % allReviews.length);
  const goNext = () => setCarouselIndex((i) => (i + 1) % allReviews.length);

  const displayStars = hoverStars || myRating?.stars || 0;

  const arrowButtonClass =
    'flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-sm border-2 border-border bg-background text-text transition-colors hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-30';

  return (
    // ✅ Fix: Removed extra space, added shadow to match other dashboard cards
    <div
      id="courseReview"
      className="bg-surface p-6 flex flex-col gap-4 border-2 border-border h-full "
    >
      {/* ✅ Whole box scrolls (header included) */}
      <div
        ref={scrollRef}
        className="flex h-full min-h-0 flex-col gap-8 overflow-y-auto overflow-x-hidden scroll-smooth snap-y snap-mandatory hide-scrollbar"
      >
        {/* Header Section */}
        <section className="flex flex-col items-center gap-2 snap-start shrink-0">
          <h3 className="font-heading text-lg uppercase tracking-widest text-text m-0">
            Scholars' Review
          </h3>
          <p className="m-0 text-xs text-text-muted italic font-body">
            {total > 0
              ? `Rated ${average} out of 5 by ${total} scholar${total === 1 ? '' : 's'}.`
              : 'No verdicts yet — be the first to share your thoughts.'}
          </p>
          <div className="flex items-center gap-3 justify-center border-b border-border pb-4 w-full">
            <StarRow stars={roundedAverage} size={20} />
            <span className="text-sm font-heading font-bold text-text">
              {average ? average : '—'}
            </span>
          </div>
        </section>

        {isLoggedIn && isEnrolled ? (
          <>
            {/* Own Review Section */}
            <section className="flex flex-col items-center gap-3 snap-start shrink-0">
              <h4 className="m-0 font-heading text-sm uppercase tracking-widest text-text-secondary">
                Your Review
              </h4>

              <span className="text-xs text-text-muted font-body text-center">
                {myRating?.stars
                  ? `Your current verdict: ${myRating.stars} / 5 — tap an emblem to update`
                  : 'Tap an emblem to leave your verdict'}
              </span>

              {/* Click on Star directly opens modal */}
              <div className="flex gap-2 pt-2">
                {Array.from({ length: 5 }).map((_, index) => {
                  const filled = displayStars > index;
                  return (
                    <FleurDeLis
                      key={index}
                      {...(filled ? FILLED : EMPTY)}
                      size={44}
                      role="button"
                      tabIndex={0}
                      aria-label={`Rate ${index + 1} out of 5`}
                      className="cursor-pointer rounded-sm transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      onMouseEnter={() => setHoverStars(index + 1)}
                      onMouseLeave={() => setHoverStars(0)}
                      onClick={() => openReviewModal(index + 1)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openReviewModal(index + 1);
                        }
                      }}
                    />
                  );
                })}
              </div>
            </section>

            {/* Other Reviews Section (Carousel) */}
            <section className="flex flex-col items-center gap-4 snap-start shrink-0">
              <h4 className="m-0 font-heading text-sm uppercase tracking-widest text-text-secondary">
                Scholars' Reviews
              </h4>

              {allReviews.length === 0 ? (
                <p className="m-0 text-sm italic text-text-muted py-4">
                  No verdicts yet. Be the first to guide your peers.
                </p>
              ) : (
                <div className="flex w-full items-stretch gap-3">
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={allReviews.length <= 1}
                    aria-label="Previous review"
                    className={arrowButtonClass}
                  >
                    <CaretLeftIcon size={18} weight="bold" />
                  </button>

                  <div className="min-h-[220px] flex-1 min-w-0">
                    {activeReview && <ReviewCard review={activeReview} />}
                  </div>

                  <button
                    type="button"
                    onClick={goNext}
                    disabled={allReviews.length <= 1}
                    aria-label="Next review"
                    className={arrowButtonClass}
                  >
                    <CaretRightIcon size={18} weight="bold" />
                  </button>
                </div>
              )}
            </section>
          </>
        ) : (
          /* ✅ Logged Out User View (Only Others Reviews) */
          <section className="flex flex-col items-center gap-4 snap-start shrink-0">
            <h4 className="m-0 font-heading text-sm uppercase tracking-widest text-text-secondary">
              Scholars' Reviews
            </h4>
            {allReviews.length === 0 ? (
              <p className="m-0 text-sm italic text-text-muted py-4">
                No reviews yet. Pray, sign in to be the first.
              </p>
            ) : (
              <div className="flex w-full items-stretch gap-3">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={allReviews.length <= 1}
                  aria-label="Previous review"
                  className={arrowButtonClass}
                >
                  <CaretLeftIcon size={18} weight="bold" />
                </button>

                <div className="min-h-[220px] flex-1 min-w-0">
                  {activeReview && <ReviewCard review={activeReview} />}
                </div>

                <button
                  type="button"
                  onClick={goNext}
                  disabled={allReviews.length <= 1}
                  aria-label="Next review"
                  className={arrowButtonClass}
                >
                  <CaretRightIcon size={18} weight="bold" />
                </button>
              </div>
            )}
          </section>
        )}
      </div>

      {/* ✅ Modal for Add/Update Review */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => !mutation.isPending && setModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-sm border-2 border-border bg-surface p-6 shadow-[6px_6px_0_var(--color-border)]"
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <SealWarningIcon size={40} weight="fill" className="text-primary" />
              <h3 className="font-heading text-lg text-text m-0">
                {myRating ? 'Update Your Review' : 'Leave a Review'}
              </h3>
              <p className="m-0 font-body text-sm text-text-secondary">
                {myRating
                  ? 'Refine your verdict — the Courtyard records shall be amended.'
                  : 'Your verdict shapes the Courtyard records.'}
              </p>
              <div className="py-2">
                <StarRow stars={pendingStars} size={28} />
              </div>
            </div>

            <div className="mt-4">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-text-muted font-heading uppercase tracking-widest">
                  A note for your fellow scholars (optional)
                </span>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts — what did this course teach you?"
                  className="w-full resize-none rounded-sm border border-border bg-background p-3 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={mutation.isPending}
                className="btnSecondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hold On
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={mutation.isPending}
                className="btnPrimary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? 'Recording...' : myRating ? 'Update Review' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseReview;
