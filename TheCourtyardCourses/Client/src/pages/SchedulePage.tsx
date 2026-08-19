import { CalendarDotsIcon, CheckIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { useFetchSchedule, useDeleteSchedule } from '../features/schedule/useSchedule';
import { useFetchEnrolledCourses } from '../features/course/useCourse';
import ScheduleCalendar from '../components/schedule/ScheduleCalendar';
import ScheduleCreator from '../components/schedule/ScheduleCreator';
import QuickCourseCard from '../components/schedule/QuickCourseCard';
import LoadingPage from './system/LoadingPage';
import NotFoundPage from './system/NotFoundPage';

const SchedulePage = () => {
  const { data: scheduleData, isLoading, isError } = useFetchSchedule();
  const { data: enrolledData } = useFetchEnrolledCourses();
  const deleteSchedule = useDeleteSchedule();

  const [creatorOpen, setCreatorOpen] = useState(false);

  if (isLoading) return <LoadingPage />;
  if (isError) return <NotFoundPage />;

  const schedules = scheduleData?.schedules || [];
  const todayActivity = scheduleData?.todayActivity || { entries: [], totalCompleted: 0 };
  const todayByCourse = scheduleData?.todayByCourse || {};
  const stats = scheduleData?.stats || { totalEnrolled: 0, scheduled: 0, unscheduled: 0 };
  const enrolledCourses = enrolledData?.pages?.flatMap((p) => p.courses ?? []) || [];

  const todayTarget = schedules.reduce((sum, s) => {
    const info = todayByCourse[s.course?._id];
    return sum + (info?.scheduledToday ? s.targetChaptersPerDay || 1 : 0);
  }, 0);
  const todayDone = schedules.reduce((sum, s) => {
    const info = todayByCourse[s.course?._id];
    return sum + (info?.completed || 0);
  }, 0);

  return (
    <section className="flex flex-col gap-6 w-full min-h-0 p-4">
{/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1
            className="no-margin font-heading text-text"
            style={{ fontSize: 'clamp(1.5rem, 1.2rem + 1vw, 1.875rem)' }}
          >
            Schedule
          </h1>
          <p className="no-margin mt-1 text-text-muted" style={{ fontSize: '0.875rem' }}>
            Plan your study sessions and track daily progress.
          </p>
        </div>
        <button
          onClick={() => setCreatorOpen(true)}
          className="btnSecondary py-1.5! px-4! text-xs!"
        >
          + Set Schedule
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="flex flex-col gap-1 p-3 rounded-sm border-2 border-border bg-surface">
          <span
            className="no-margin font-heading uppercase tracking-wider text-text-muted"
            style={{ fontSize: '0.625rem' }}
          >
            Enrolled
          </span>
          <span
            className="no-margin font-heading font-bold text-text"
            style={{ fontSize: '1.25rem' }}
          >
            {stats.totalEnrolled}
          </span>
        </div>
        <div className="flex flex-col gap-1 p-3 rounded-sm border-2 border-border bg-surface">
          <span
            className="no-margin font-heading uppercase tracking-wider text-text-muted"
            style={{ fontSize: '0.625rem' }}
          >
            Scheduled
          </span>
          <span
            className="no-margin font-heading font-bold text-accent"
            style={{ fontSize: '1.25rem' }}
          >
            {stats.scheduled}
          </span>
        </div>
        <div className="flex flex-col gap-1 p-3 rounded-sm border-2 border-border bg-surface">
          <span
            className="no-margin font-heading uppercase tracking-wider text-text-muted"
            style={{ fontSize: '0.625rem' }}
          >
            Unscheduled
          </span>
          <span
            className="no-margin font-heading font-bold text-text-muted"
            style={{ fontSize: '1.25rem' }}
          >
            {stats.unscheduled}
          </span>
        </div>
        <div className="flex flex-col gap-1 p-3 rounded-sm border-2 border-border bg-surface">
          <span
            className="no-margin font-heading uppercase tracking-wider text-text-muted"
            style={{ fontSize: '0.625rem' }}
          >
            Today
          </span>
          <div className="flex items-baseline gap-1">
            <span
              className="no-margin font-heading font-bold text-text"
              style={{ fontSize: '1.25rem' }}
            >
              {todayDone}
            </span>
            <span className="no-margin text-text-muted" style={{ fontSize: '0.75rem' }}>
              / {todayTarget}
            </span>
            {todayDone >= todayTarget && todayTarget > 0 && (
              <CheckIcon size={16} weight="bold" className="text-success" />
            )}
          </div>
        </div>
      </div>

      {creatorOpen && (
        <ScheduleCreator
          enrolledCourses={enrolledCourses}
          schedules={schedules}
          onClose={() => setCreatorOpen(false)}
        />
      )}

      {/* View */}
      <div className="flex flex-col md:flex-row gap-6 min-h-0">
        {/* List — 2/3 on desktop, full on mobile */}
        <div className="flex flex-col gap-3 md:w-2/3">
          {schedules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CalendarDotsIcon size={48} weight="light" className="text-text-muted mb-3" />
              <p
                className="no-margin text-text-muted font-heading"
                style={{ fontSize: '0.875rem' }}
              >
                No courses scheduled yet. Set a schedule to get started!
              </p>
            </div>
          ) : (
            schedules.map((schedule) => (
              <QuickCourseCard
                key={schedule._id}
                schedule={schedule}
                todayInfo={todayByCourse[schedule.course?._id]}
                onDelete={() => deleteSchedule.mutate(schedule._id)}
              />
            ))
          )}
        </div>

        {/* Calendar — 1/3 on desktop, full on mobile */}
        <div className="md:w-1/3 md:sticky md:top-4 md:self-start">
          <ScheduleCalendar schedules={schedules} />
        </div>
      </div>
    </section>
  );
};

export default SchedulePage;
