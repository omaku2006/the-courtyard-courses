import { useEffect, useMemo, useState } from 'react';
import { FleurDeLis } from '../ui/FleurDeLis';
import { useFetchCourseRatings, useUpdateRating } from '../../features/course/useCourse';
import { useFetchMyProfile } from '../../features/auth/useAuth';

interface CourseReviewProps {
  courseId: string;
}

const FILLED = { color: '#FCEA2B', shadeColor: '#F1B31C', strokeColor: '#000000' };
const EMPTY = { color: '#C9A86A', shadeColor: '#9B8158', strokeColor: '#C9A86A' };

const CourseReview = ({ courseId }: CourseReviewProps) => {
  const { data: profile } = useFetchMyProfile();
  const { data: ratingsData } = useFetchCourseRatings(courseId);
  const mutation = useUpdateRating();

  const [selectedStars, setSelectedStars] = useState<number>(0);
  const [hoverStars, setHoverStars] = useState<number>(0);

  const myRating = useMemo(() => {
    const ratings: Array<{ user?: { _id?: string } | null; stars?: number }> =
      ratingsData?.ratings ?? [];
    return ratings.find((r) => r.user?._id === profile?.user?._id)?.stars ?? 0;
  }, [ratingsData, profile]);

  useEffect(() => {
    if (myRating > 0) setSelectedStars(myRating);
  }, [myRating]);

  const activeStars = hoverStars || selectedStars;
  const average = Number(ratingsData?.averageRating ?? 0);
  const total = ratingsData?.totalRatings ?? 0;
  const roundedAverage = Math.round(average);

  const handleKeyDown = (index: number) => (e: React.KeyboardEvent<SVGSVGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedStars(index + 1);
    }
  };

  return (
    <div id="courseReview" className="bg-surface p-4 flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-1">
        <h3 className="font-heading text-lg">Scholars' Review</h3>
        <p className="no-margin text-xs text-text-muted italic">
          {total > 0
            ? `Rated ${average} out of 5 by ${total} scholar${total === 1 ? '' : 's'}.`
            : 'No verdicts yet — be the first to share your thoughts.'}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <FleurDeLis key={index} {...(roundedAverage > index ? FILLED : EMPTY)} size={18} />
          ))}
        </div>
        <span className="text-sm font-medium">{average ? average : '—'}</span>
      </div>

      <div className="flex flex-col items-center gap-3">
        <span className="text-xs text-text-muted">
          {mutation.isPending
            ? 'Recording your verdict...'
            : selectedStars > 0
              ? `Your verdict: ${selectedStars} / 5`
              : myRating > 0
                ? `Your current verdict: ${myRating} / 5 — adjust below`
                : 'Tap the emblems to rate'}
        </span>

        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, index) => {
            const filled = activeStars > index;
            return (
              <FleurDeLis
                key={index}
                {...(filled ? FILLED : EMPTY)}
                size={44}
                role="button"
                tabIndex={0}
                aria-label={`Rate ${index + 1} out of 5`}
                className="cursor-pointer rounded-[2px] transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onMouseEnter={() => setHoverStars(index + 1)}
                onMouseLeave={() => setHoverStars(0)}
                onClick={() => setSelectedStars(index + 1)}
                onKeyDown={handleKeyDown(index)}
              />
            );
          })}
        </div>

        <button
          type="button"
          className="btnPrimary disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={selectedStars === 0 || mutation.isPending}
          onClick={() => mutation.mutate({ courseId, stars: selectedStars })}
        >
          {myRating > 0 ? 'Update Verdict' : 'Submit Verdict'}
        </button>
      </div>
    </div>
  );
};

export default CourseReview;
