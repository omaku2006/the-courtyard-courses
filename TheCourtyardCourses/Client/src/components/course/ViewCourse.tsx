import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  useFetchCourse,
  usePublishCourse,
  useEnrollCourse,
  useCourseProgress,
  useDeleteCourse,
} from '../../features/course/useCourse';
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
import WishlistToggle from '../ui/WishlistToggle';
import { XIcon, TrashIcon } from '@phosphor-icons/react';

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
  const [enrollConfirmOpen, setEnrollConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [schedule, setSchedule] = useState(toLocalInputValue(course?.publishedAt));
  const { enroll, isPending: enrollPending } = useEnrollCourse();
  const publishMutation = usePublishCourse();
  const deleteMutation = useDeleteCourse();

  const isTeacherOwner =
    typeof course?.creator === 'object' &&
    !!course.creator?._id &&
    profile?.user?._id === course.creator._id;

  const isEnrolled = !!profile?.user?._id && !!course?.students?.includes(profile.user._id);

  const progressQuery = useCourseProgress(course?._id ?? '', isEnrolled && !!profile?.user);
  const completedChapters = progressQuery.data?.completedChapters ?? [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [course?._id]);

  if (isLoading) return <LoadingPage />;
  if (isError || !course) return <ServerErrorPage />;

  const status = getStatus(course.publishedAt);

  const handleConfirmPublish = () => {
    publishMutation.mutate({ courseId: course._id });
    setConfirmOpen(false);
  };

  return (
    <section id="course" className={`gap-4 p-4 content-start min-h-screen max-h-[130vh]`}>
      <div style={{ gridArea: 'header' }} className="flex flex-col gap-3">
        <CourseHeadline title={course.title} />

        {/* ✅ FIX: Removed !isEnrolled condition so enrolled users see the block too */}
        {!isTeacherOwner && (
          <div className="flex flex-col items-center justify-between gap-4 rounded-sm border-2 border-primary bg-surface p-4 text-center md:flex-row md:text-left ">
            {/* Left Side: Text (Changes based on enrollment status) */}
            <div className="flex flex-1 flex-col">
              {status === 'Scheduled' ? (
                <>
                  <h4 className="font-heading text-text m-0 text-lg">Coming Soon</h4>
                  <p className="m-0 italic text-text-muted font-body text-sm">
                    This course is scheduled to arrive on {formatDate(course.publishedAt)}. Pray,
                    check back then.
                  </p>
                </>
              ) : isEnrolled ? (
                <>
                  <h4 className="font-heading text-text m-0 text-lg">You are Enrolled</h4>
                  <p className="m-0 italic text-text-muted font-body text-sm">
                    Your journey through this curriculum has begun. Proceed to the first chapter.
                  </p>
                </>
              ) : (
                <>
                  <h4 className="font-heading text-text m-0 text-lg">Awaiting your Enrollment</h4>
                  <p className="m-0 italic text-text-muted font-body text-sm">
                    Join the Courtyard to access all video manuscripts, chapters, and community
                    discussions.
                  </p>
                </>
              )}
            </div>

            {/* Right Side: Price (Hidden if already enrolled) + Action + Wishlist */}
            <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6">
              {status === 'Scheduled' ? (
                <div className="flex items-center gap-2 rounded-sm border-2 border-text-primary bg-highlight/10 px-4 py-2">
                  <span className="font-heading text-sm uppercase tracking-wider text-text-primary">
                    Scheduled
                  </span>
                  <span className="text-text-muted text-xs">
                    Arrives {formatDate(course.publishedAt)}
                  </span>
                </div>
              ) : (
                <>
                  {/* Price Tag (Only show if NOT enrolled) */}
                  {!isEnrolled && (
                    <div className="text-center md:text-right border-r-2 border-border pr-0 md:pr-6">
                      {course.price > 0 ? (
                        <>
                          <span className="block text-[10px] font-heading uppercase tracking-widest text-text-muted">
                            Tuition Fee
                          </span>
                          <span className="font-heading text-2xl text-text">₹{course.price}</span>
                        </>
                      ) : (
                        <>
                          <span className="block text-[10px] font-heading uppercase tracking-widest text-text-muted">
                            Access
                          </span>
                          <span className="font-heading text-xl text-primary">Complimentary</span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Actions: Enroll / Continue Learning & Wishlist together */}
                  {profile?.user ? (
                    <div className="flex items-center gap-3">
                      {/* If already enrolled, show Continue Learning button */}
                      {!isEnrolled && (
                        <button
                          type="button"
                          onClick={() => setEnrollConfirmOpen(true)}
                          disabled={enrollPending}
                          className="btnPrimary shrink-0 w-full md:w-auto disabled:pointer-events-none disabled:opacity-60"
                        >
                          {enrollPending
                            ? 'Inscribing...'
                            : course.price > 0
                              ? 'Enroll Now'
                              : 'Enroll Free'}
                        </button>
                      )}

                      {/* Wishlist toggle remains visible for enrolled users too */}
                      <WishlistToggle courseId={course._id} variant="button" />
                    </div>
                  ) : (
                    <p className="m-0 italic text-text-secondary font-body text-sm">
                      Pray,{' '}
                      <Link
                        to="/login"
                        className="font-heading underline decoration-primary underline-offset-4 text-text transition-colors hover:text-primary"
                      >
                        sign in
                      </Link>{' '}
                      to enrol.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <CourseTeacher course={course} />
      <CourseChapterInfo
        course={course}
        selectChapter={selectedChapter}
        setSelectChapter={setSelectedChapter}
        completedChapters={completedChapters}
      />
      <CourseCommunity />
      <CourseVideo course={course} selectedChapter={selectedChapter} />
      <CourseDescription course={course} selectedChapter={selectedChapter} />
      <CourseReview courseId={course._id} isEnrolled={isEnrolled} />
      <CourseChapterProgress
        course={course}
        courseId={course._id}
        selectedChapter={selectedChapter}
        isEnrolled={isEnrolled}
        progressData={progressQuery.data}
      />

      {/* Teacher Manage Panel */}
      {isTeacherOwner && (
        <div
          id="courseManage"
          className="col-span-full bg-surface p-6 flex flex-col gap-4 border-2 border-border shadow-[4px_4px_0_var(--color-border)]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
            <h3 className="font-heading text-xl text-text m-0">Manage Curriculum</h3>
            <span
              className={`shrink-0 rounded-sm px-3 py-1 text-[10px] font-heading uppercase tracking-widest ${STATUS_STYLES[status]}`}
            >
              {status}
            </span>
          </div>

          <div className="courseManageContainer flex flex-col md:flex-row flex-wrap items-start gap-4 pt-2">
            <div className="leftPart flex flex-col flex-1 gap-4 my-auto">
              <button
                type="button"
                className="btnPrimary flex-1 min-w-[200px]"
                onClick={() => setEditOpen(true)}
              >
                Update Course
              </button>

              <button
                type="button"
                className="inline-flex flex-1 min-w-[200px] items-center justify-center gap-2 rounded-[2px] border-2 border-error/40 bg-error/10 px-4 py-4 font-heading text-sm text-error transition-colors hover:bg-error/20 disabled:pointer-events-none disabled:opacity-60"
                onClick={() => setDeleteConfirmOpen(true)}
              >
                <TrashIcon size={18} weight="bold" />
                Delete Course
              </button>
            </div>

            <div className="flex flex-1 min-w-[260px] flex-col gap-3 md:border-l-2 border-border md:pl-4">
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
              <p className="m-0 text-xs text-text-muted italic">
                {status === 'Draft' && 'Currently secluded from the scholars.'}
                {status === 'Scheduled' &&
                  `Scholars may anticipate its arrival on ${formatDate(course.publishedAt)}.`}
                {status === 'Published' && 'Currently available to all scholars.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ❌ REMOVED: Bottom Wishlist Block */}

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

      <ConfirmModal
        isOpen={enrollConfirmOpen}
        title="Confirm Enrolment"
        message={
          course.price > 0
            ? `Enrol in "${course.title}" for ₹${course.price}? Your payment shall be processed securely through Razorpay, and access granted upon completion.`
            : `Enrol in "${course.title}"? This curriculum is complimentary — access shall be granted immediately.`
        }
        confirmLabel={course.price > 0 ? 'Proceed to Pay' : 'Enrol Free'}
        cancelLabel="Hold On"
        isPending={enrollPending}
        onConfirm={() => {
          setEnrollConfirmOpen(false);
          enroll({ _id: course._id, title: course.title });
        }}
        onCancel={() => setEnrollConfirmOpen(false)}
      />

      <ConfirmModal
        isOpen={deleteConfirmOpen}
        title="Permanently Delete This Course?"
        message={`This action cannot be undone. "${course.title}" and all its chapters, ratings, and enrolments will be erased from the Courtyard forever.`}
        confirmLabel="Yes, Delete"
        cancelLabel="Keep Course"
        isPending={deleteMutation.isPending}
        onConfirm={() => {
          setDeleteConfirmOpen(false);
          deleteMutation.mutate(course._id);
        }}
        onCancel={() => setDeleteConfirmOpen(false)}
      />

      {/* ✅ FIX: Modal Z-Index z-10 -> z-50 */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative flex h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-sm border-2 border-border bg-surface shadow-[6px_6px_0_var(--color-border)]">
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 z-50 rounded-sm border-2 border-primary bg-surface p-2 text-text transition-colors hover:bg-primary hover:text-background"
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
