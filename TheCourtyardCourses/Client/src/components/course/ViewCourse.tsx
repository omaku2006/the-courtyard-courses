import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useFetchCourse, usePublishCourse } from '../../features/course/useCourse';
import { useFetchMyProfile } from '../../features/auth/useAuth';
import LoadingPage from '../../pages/system/LoadingPage';
import ServerErrorPage from '../../pages/system/ServerErrorPage';
import CourseHeadline from '../dashboardComponents/CourseHeadline';
import CourseTeacher from '../dashboardComponents/CourseTeacher';
import CourseChapterInfo from '../dashboardComponents/CourseChapterInfo';
import CourseCommunity from '../dashboardComponents/CourseCommunity';
import CourseVideo from '../dashboardComponents/CourseVideo';
import CourseDescription from '../dashboardComponents/CourseDescription';
import CourseReview from '../dashboardComponents/CourseReview';
import CourseChapterProgress from '../dashboardComponents/CourseChapterProgress';
import AddCourseForm from './AddCourseForm';
import ConfirmModal from '../ui/ConfirmModal';
import { XIcon } from '@phosphor-icons/react';

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

const ViewCourse = () => {
  const { slug } = useParams();
  const { data, isLoading, isError } = useFetchCourse(slug ?? '');
  const { data: profile } = useFetchMyProfile();
  const course = data?.courseDetails;

  const [selectedChapter, setSelectedChapter] = useState<number>(0);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [schedule, setSchedule] = useState(toLocalInputValue(course?.publishedAt));
  const publishMutation = usePublishCourse();

  const isTeacherOwner =
    typeof course?.creator === 'object' &&
    !!course.creator?._id &&
    profile?.user?._id === course.creator._id;

  if (isLoading) return <LoadingPage />;
  if (isError || !course) return <ServerErrorPage />;

  const status = getStatus(course.publishedAt);

  const handleConfirmPublish = () => {
    publishMutation.mutate({ courseId: course._id });
    setConfirmOpen(false);
  };

  return (
    <section
      id="course"
      className={`gap-4 p-4 content-start ${isTeacherOwner ? 'h-[130vh]' : 'h-screen'}`}
    >
      <CourseHeadline title={course.title} />
      <CourseTeacher course={course} />
      <CourseChapterInfo
        course={course}
        selectChapter={selectedChapter}
        setSelectChapter={setSelectedChapter}
      />
      <CourseCommunity />
      <CourseVideo course={course} selectedChapter={selectedChapter} />
      <CourseDescription course={course} selectedChapter={selectedChapter} />
      <CourseReview courseId={course._id} />
      <CourseChapterProgress />

      {isTeacherOwner && (
        <div
          id="courseManage"
          className="col-span-full bg-surface p-4 flex flex-col gap-4 border-2 border-border"
        >
          <div className="flex items-center justify-between gap-3">
            <h3>Manage Curriculum</h3>
            <span
              className={`shrink-0 rounded-[2px] px-2 py-1 text-[10px] font-heading uppercase tracking-widest ${STATUS_STYLES[status]}`}
            >
              {status}
            </span>
          </div>
          <div className="courseManageContainer flex flex-row flex-wrap items-start gap-4">
            <button
              type="button"
              className="btnPrimary flex-1 min-w-50"
              onClick={() => setEditOpen(true)}
            >
              Update Course
            </button>

            <div className="flex flex-1 min-w-65 flex-col gap-3 border-l-2 border-border pl-4">
              <div className="flex items-center gap-2">
                <input
                  type="datetime-local"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="inputField w-full text-xs"
                />
                <button
                  type="button"
                  disabled={!schedule || publishMutation.isPending}
                  onClick={() =>
                    publishMutation.mutate({
                      courseId: course._id,
                      publishedAt: new Date(schedule).toISOString(),
                    })
                  }
                  className="btnSecondary disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap text-xs"
                >
                  Schedule
                </button>
              </div>

              <div className="flex gap-2">
                {status !== 'Published' && (
                  <button
                    type="button"
                    disabled={publishMutation.isPending}
                    onClick={() => setConfirmOpen(true)}
                    className="btnPrimary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Publish Now
                  </button>
                )}
                {status !== 'Draft' && (
                  <button
                    type="button"
                    disabled={publishMutation.isPending}
                    onClick={() =>
                      publishMutation.mutate({ courseId: course._id, publishedAt: null })
                    }
                    className="btnSecondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Revert to Draft
                  </button>
                )}
              </div>
              <p className="no-margin text-xs text-text-muted italic">
                {status === 'Draft' && 'Currently secluded from the scholars.'}
                {status === 'Scheduled' &&
                  `Scholars may anticipate its arrival on ${formatDate(course.publishedAt)}.`}
                {status === 'Published' && 'Currently available to all scholars.'}
              </p>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmOpen}
        title="Publish this course?"
        message={`Publish "${course.title}" now? Scholars will be able to view and enrol in the curriculum immediately.`}
        confirmLabel="Publish"
        cancelLabel="Hold On"
        isPending={publishMutation.isPending}
        onConfirm={handleConfirmPublish}
        onCancel={() => setConfirmOpen(false)}
      />

      {editOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 p-4">
          <div className="relative flex h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-[4px] bg-surface">
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 z-20 rounded-[4px] border-2 border-accent bg-surface p-2 text-text-primary transition-colors hover:bg-accent hover:text-light"
            >
              <XIcon size={20} weight="bold" />
            </button>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <AddCourseForm course={course} onSaved={() => setEditOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ViewCourse;
