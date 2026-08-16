import { CheckCircleIcon, SealCheckIcon, CircleDashedIcon, PlayIcon } from '@phosphor-icons/react';
import { useToggleChapterComplete } from '../../features/course/useCourse';
import Fence from '../ui/Fence';
import type { Course } from '../../types/FetchDataTypes';

const formatDuration = (minutes: number) => {
  if (!minutes) return '—';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m} min`;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

type ProgressData = {
  progress?: number;
  completedChapters?: number[];
  totalChapters?: number;
  totalDurationMinutes?: number;
  completedDurationMinutes?: number;
  completed?: boolean;
};

const CourseChapterProgress = ({
  course,
  courseId,
  selectedChapter,
  isEnrolled,
  progressData,
}: {
  course: Course;
  courseId: string;
  selectedChapter: number;
  isEnrolled: boolean;
  progressData?: ProgressData;
}) => {
  const toggleMutation = useToggleChapterComplete();

  const progress = progressData?.progress ?? 0;
  const completedChapters = progressData?.completedChapters ?? [];
  const totalChapters = progressData?.totalChapters ?? course.chapters.length;
  const totalDurationMinutes = progressData?.totalDurationMinutes ?? 0;
  const completedDurationMinutes = progressData?.completedDurationMinutes ?? 0;
  const completed = progressData?.completed ?? false;

  const isCurrentComplete = completedChapters.includes(selectedChapter);

  const handleToggle = () => {
    if (isEnrolled) toggleMutation.mutate({ courseId, chapterIndex: selectedChapter });
  };

  return (
    <div
      id="courseChapterProgress"
      className="bg-surface p-4 flex flex-col gap-3 min-h-0 overflow-y-auto"
    >
      <h4 className="font-heading text-sm uppercase tracking-widest text-text-secondary border-b border-border pb-2 mb-1">
        Course Progress
      </h4>

      {!isEnrolled ? (
        <p className="m-0 text-sm italic text-text-muted font-body">
          Enrol in this curriculum to begin tracking your progress.
        </p>
      ) : (
        <>
          {/* ✅ Current Chapter & Title */}
          {course.chapters[selectedChapter] && (
            <div className="flex items-center gap-3 rounded-sm border-2 border-primary bg-background p-3 shrink-0">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-primary text-light">
                <PlayIcon size={18} weight="fill" />
              </span>
              <div className="flex flex-col min-w-0">
                <span
                  className="font-headin uppercase tracking-widest text-text-muted"
                  style={{ fontSize: '10px' }}
                >
                  Currently Viewing
                </span>
                <p className="m-0 no-margin truncate font-heading text-sm text-text-primary leading-snug">
                  Chapter {selectedChapter + 1}: {course.chapters[selectedChapter].title}
                </p>
              </div>
            </div>
          )}

          {/* Fenced Progress Bar: CLIP div > Fence — pickets fill (green) left-to-right */}
          <div
            className="relative w-full shrink-0 overflow-hidden border-2 border-border bg-background"
            style={{ height: 28 }}
          >
            <Fence fill size={22} spacing={0} tileHeight={28} />
            <div
              className="absolute inset-0 overflow-hidden transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            >
              <Fence fill size={22} spacing={0} tileHeight={28} color="var(--color-success)" />
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between text-xs">
            <span className="font-heading uppercase tracking-widest text-text-secondary">
              {progress}% complete
            </span>
            {completed ? (
              <span className="flex items-center gap-1 font-heading uppercase tracking-widest text-success">
                <SealCheckIcon size={16} weight="fill" /> Completed
              </span>
            ) : (
              <span className="font-heading uppercase tracking-widest text-text-muted">
                {completedChapters.length} of {totalChapters} chapters
              </span>
            )}
          </div>

          <p className="m-0 shrink-0 text-xs text-text-muted italic font-body">
            Total duration: {formatDuration(totalDurationMinutes)}
            {completedDurationMinutes > 0 &&
              ` · ${formatDuration(completedDurationMinutes)} studied`}
          </p>

          {/* Mark Selected Chapter Complete */}
          <button
            type="button"
            onClick={handleToggle}
            disabled={toggleMutation.isPending}
            className={`mt-1 flex shrink-0 items-center justify-center gap-2 rounded-sm border-2 px-3 py-2 font-heading text-xs uppercase tracking-widest transition-colors disabled:pointer-events-none disabled:opacity-60 ${
              isCurrentComplete
                ? 'border-success bg-success text-light hover:opacity-80'
                : 'border-border bg-background text-text hover:border-success hover:bg-success hover:text-light'
            }`}
          >
            {isCurrentComplete ? (
              <CheckCircleIcon size={18} weight="fill" />
            ) : (
              <CircleDashedIcon size={18} weight="fill" />
            )}
            {isCurrentComplete
              ? `Mark Chapter ${selectedChapter + 1} Incomplete`
              : `Mark Chapter ${selectedChapter + 1} as Complete`}
          </button>
        </>
      )}
    </div>
  );
};

export default CourseChapterProgress;
