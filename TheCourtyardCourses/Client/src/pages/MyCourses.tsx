import { PlusIcon, VideoIcon, XIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import AddCourseForm from '../components/course/AddCourseForm';
import { useMyCourses, usePublishCourse } from '../features/course/useCourse';
import { imageUrl } from '../utils/imageUrl';

type Course = {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: { url?: string | null; publicId?: string | null } | string | null;
  category?: string;
  level?: string;
  publishedAt?: string | null;
  price?: number;
};

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

const STATUS_STYLES: Record<CourseStatus, string> = {
  Draft: 'bg-text-muted text-light',
  Scheduled: 'bg-highlight text-light',
  Published: 'bg-success text-light',
};

const CourseCard = ({
  course,
  onPublish,
  isPending,
}: {
  course: Course;
  onPublish: (courseId: string, publishedAt?: string | null) => void;
  isPending: boolean;
}) => {
  const [schedule, setSchedule] = useState(toLocalInputValue(course.publishedAt));
  const status = getStatus(course.publishedAt);

  return (
    <div className="flex flex-col gap-3 rounded-[4px] border-2 border-accent bg-surface p-4">
      {imageUrl(course.thumbnail) && (
        <img
          src={imageUrl(course.thumbnail)}
          alt={course.title}
          className="h-40 w-full rounded-[2px] object-cover"
        />
      )}

      <div className="flex items-center justify-between gap-3">
        <h3 className="font-heading truncate">{course.title}</h3>
        <span className={`shrink-0 rounded-[2px] px-2 py-0.5 text-xs font-heading ${STATUS_STYLES[status]}`}>
          {status}
        </span>
      </div>

      {course.category && (
        <p className="text-xs text-text-secondary">
          {course.category}
          {course.level ? ` · ${course.level}` : ''}
        </p>
      )}

      {status === 'Draft' && (
        <p className="text-xs text-text-muted">Not visible to students yet.</p>
      )}
      {status === 'Scheduled' && (
        <p className="text-xs text-text-muted">
          Students can see it. Unlocks on {formatDate(course.publishedAt)}.
        </p>
      )}
      {status === 'Published' && (
        <p className="text-xs text-text-muted">Live since {formatDate(course.publishedAt)}.</p>
      )}

      <div className="mt-auto flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            type="datetime-local"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className="inputField w-full"
          />
          <button
            type="button"
            disabled={!schedule || isPending}
            onClick={() => onPublish(course._id, new Date(schedule).toISOString())}
            className="btnSecondary disabled:opacity-50"
          >
            Schedule
          </button>
        </div>

        <div className="flex gap-2">
          {status !== 'Published' && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => onPublish(course._id)}
              className="btnPrimary flex-1 disabled:opacity-50"
            >
              Publish Now
            </button>
          )}
          {status !== 'Draft' && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => onPublish(course._id, null)}
              className="btnSecondary flex-1 disabled:opacity-50"
            >
              Set Draft
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const MyCourses = () => {
  const [formIsOpen, setFormIsOpen] = useState<boolean>(false);

  const { data, isLoading } = useMyCourses();
  const publishMutation = usePublishCourse();

  const courses: Course[] = data?.courses ?? [];

  const toggleForm = () => {
    setFormIsOpen(!formIsOpen);
  };

  const handlePublish = (courseId: string, publishedAt?: string | null) => {
    publishMutation.mutate({ courseId, publishedAt });
  };

  return (
    <section className="relative">
      <div className="myCourses">
        <div className="header flex items-center justify-between">
          <h2 className="flex items-center gap-5">
            <VideoIcon className="text-6xl" weight="fill" /> My Courses
          </h2>
          <button className="btnSecondary flex items-center gap-3" onClick={toggleForm}>
            <PlusIcon weight="fill" className="text-2xl" /> Add Course
          </button>
        </div>
        <hr className="rounded-[2px] mt-3 border-2" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && <p className="text-text-muted">Fetching your courses...</p>}

        {!isLoading && courses.length === 0 && (
          <p className="text-text-muted">No courses yet. Add your first course above!</p>
        )}

        {courses.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
            onPublish={handlePublish}
            isPending={publishMutation.isPending}
          />
        ))}
      </div>

      {formIsOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 p-4">
          <div className="relative flex h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-[4px] bg-surface">
            <button
              type="button"
              onClick={() => setFormIsOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 z-20 rounded-[4px] border-2 border-accent bg-surface p-2 text-text-primary transition-colors hover:bg-accent hover:text-light"
            >
              <XIcon size={20} weight="bold" />
            </button>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <AddCourseForm />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyCourses;
