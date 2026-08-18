import { useState } from 'react';
import type { Course } from '../../pages/MyCourses';
import { imageUrl } from '../../utils/imageUrl';
import ConfirmModal from './ConfirmModal';
import { useNavigate } from 'react-router-dom';

type CourseStatus = 'Draft' | 'Scheduled' | 'Published';

const getStatus = (publishedAt?: string | null): CourseStatus => {
  if (!publishedAt) return 'Draft';
  return new Date(publishedAt).getTime() > Date.now() ? 'Scheduled' : 'Published';
};

const toLocalInputValue = (iso?: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '';

// ✅ Polished: Wax Seal jovi status badges
const STATUS_STYLES: Record<CourseStatus, string> = {
  Draft: 'bg-text-muted text-light',
  Scheduled: 'bg-highlight text-light',
  Published: 'bg-success text-light',
};

const TeacherCourseCard = ({
  course,
  onPublish,
  isPending,
}: {
  course: Course;
  onPublish: (courseId: string, publishedAt?: string | null) => void;
  isPending: boolean;
}) => {
  const [schedule, setSchedule] = useState(toLocalInputValue(course.publishedAt));
  const [confirmOpen, setConfirmOpen] = useState(false);
  const status = getStatus(course.publishedAt);
  const isPublished = status === 'Published';
  const navigate = useNavigate();
  const handlePublishNow = () => setConfirmOpen(true);

  const handleConfirmPublish = () => {
    onPublish(course._id);
    setConfirmOpen(false);
  };

  return (
    // ✅ Polished: Classic frame shadow ane padding
    <div
      className="flex h-full flex-col gap-4 rounded-[2px] border-2 border-border bg-surface p-5 shadow-[4px_4px_0_var(--color-border)] hover:shadow-[6px_6px_0_var(--color-border)] cursor-pointer hover:-translate-y-1 hover:border-accent-hover transition-all duration-300"
      onClick={() => navigate(`/dashboard/${course.slug}`)}
    >
      {/* Thumbnail with subtle border */}
      {imageUrl(course.thumbnail) && (
        <div className="overflow-hidden rounded-[2px] border border-border">
          <img
            src={imageUrl(course.thumbnail)}
            alt={course.title}
            className="h-40 w-full object-cover"
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading text-lg leading-tight text-text">{course.title}</h3>
        {/* ✅ Status Stamp: slim vertical tag (90° read) beside the title — never overflows */}
        <span
          style={{ writingMode: 'vertical-rl' }}
          className={`shrink-0 rounded-[2px] border px-1.5 py-2 text-[10px] font-heading uppercase tracking-widest shadow-[2px_2px_0_var(--color-border)] ${STATUS_STYLES[status]}`}
          aria-label={`Status: ${status}`}
        >
          {status}
        </span>
      </div>

      {course.category && (
        <p className="text-xs uppercase tracking-wide text-text-secondary font-heading">
          {course.category}
          {course.level ? ` · ${course.level}` : ''}
        </p>
      )}

      {/* ✅ Polished: Victorian vocabulary for descriptions */}
      <div className="text-xs text-text-muted italic font-body">
        {status === 'Draft' && 'Currently secluded from the scholars.'}
        {status === 'Scheduled' &&
          `Scholars may anticipate its arrival on ${formatDate(course.publishedAt)}.`}
        {status === 'Published' && `Live in the courtyard since ${formatDate(course.publishedAt)}.`}
      </div>

      {!isPublished && (
        <div
          className="mt-auto flex flex-col gap-3 pt-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Schedule Section */}
          <div className="flex items-center gap-2">
            <input
              type="datetime-local"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="inputField w-full text-xs"
            />
            <button
              type="button"
              disabled={!schedule || isPending}
              onClick={() => onPublish(course._id, new Date(schedule).toISOString())}
              className="btnSecondary disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap text-xs"
            >
              Schedule
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={handlePublishNow}
              className="btnPrimary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publish Now
            </button>
            {status === 'Scheduled' && (
              <button
                type="button"
                disabled={isPending}
                onClick={() => onPublish(course._id, null)}
                className="btnSecondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Revert to Draft
              </button>
            )}
          </div>
        </div>
      )}

      <div onClick={(e) => e.stopPropagation()}>
        <ConfirmModal
          isOpen={confirmOpen}
          title="Publish this course?"
          message={`Publish "${course.title}" now? Scholars will be able to view and enrol in the curriculum immediately.`}
          confirmLabel="Publish"
          cancelLabel="Hold On"
          isPending={isPending}
          onConfirm={handleConfirmPublish}
          onCancel={() => setConfirmOpen(false)}
        />
      </div>
    </div>
  );
};

export default TeacherCourseCard;
