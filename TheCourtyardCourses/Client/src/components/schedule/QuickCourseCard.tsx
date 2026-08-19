import { TrashIcon, CheckIcon } from '@phosphor-icons/react';
import type { Course } from '../../types/FetchDataTypes';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface Schedule {
  _id: string;
  course: Course & { chapters?: any[] };
  days: number[];
  targetChaptersPerDay: number;
}

interface TodayInfo {
  completed: number;
  target: number;
  scheduledToday: boolean;
}

interface QuickCourseCardProps {
  schedule: Schedule;
  todayInfo?: TodayInfo;
  onDelete: () => void;
}

const QuickCourseCard = ({ schedule, todayInfo, onDelete }: QuickCourseCardProps) => {
  const course = schedule.course;
  const totalChapters = course?.chapters?.length || 0;
  const todayCompleted = todayInfo?.completed || 0;
  const todayTarget = todayInfo?.target || 0;
  const scheduledToday = todayInfo?.scheduledToday || false;
  const targetMet = scheduledToday && todayCompleted >= todayTarget && todayTarget > 0;

  return (
    <div className="flex items-center gap-3 p-3 rounded-sm border-2 border-border bg-surface">
      {course?.thumbnail?.url ? (
        <img
          src={course.thumbnail.url}
          alt={course.title}
          className="w-14 h-14 rounded-sm object-cover border-2 border-border shrink-0"
        />
      ) : (
        <div className="w-14 h-14 rounded-sm bg-accent/20 flex items-center justify-center border-2 border-border shrink-0">
          <span className="no-margin font-heading font-bold text-accent" style={{ fontSize: '1.125rem' }}>
            {course?.title?.charAt(0) || '?'}
          </span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h4 className="no-margin font-heading font-bold text-text truncate" style={{ fontSize: '0.875rem' }}>{course?.title}</h4>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {schedule.days.map((d) => (
            <span
              key={d}
              className="no-margin font-heading uppercase tracking-wider px-1.5 py-0.5 rounded-sm border border-border bg-bg text-text-muted"
              style={{ fontSize: '0.5625rem' }}
            >
              {DAY_NAMES[d]}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="no-margin text-text-muted font-heading" style={{ fontSize: '0.625rem' }}>
            {totalChapters} ch total
          </span>
          {scheduledToday && (
            <span
              className={`no-margin font-heading font-bold flex items-center gap-1 ${
                targetMet ? 'text-success' : 'text-accent'
              }`}
              style={{ fontSize: '0.625rem' }}
            >
              {targetMet ? (
                <CheckIcon size={10} weight="bold" />
              ) : null}
              Today: {todayCompleted}/{todayTarget}
            </span>
          )}
          {!scheduledToday && (
            <span className="no-margin text-text-muted font-heading italic" style={{ fontSize: '0.625rem' }}>
              Not scheduled today
            </span>
          )}
        </div>
      </div>
      <button
        onClick={onDelete}
        className="p-1.5 rounded-sm text-text-muted hover:text-error hover:bg-error/10 transition-colors shrink-0"
        aria-label="Remove from schedule"
        title="Remove"
      >
        <TrashIcon size={14} weight="bold" />
      </button>
    </div>
  );
};

export default QuickCourseCard;
