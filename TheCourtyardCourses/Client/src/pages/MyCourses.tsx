import {
  BookOpenIcon,
  CalendarBlankIcon,
  ChalkboardTeacherIcon,
  GraduationCapIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  SpinnerGapIcon,
  VideoIcon,
  XIcon,
} from '@phosphor-icons/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import AddCourseForm from '../components/course/AddCourseForm';
import {
  useMyCourses,
  usePublishCourse,
  useFetchEnrolledCourses,
} from '../features/course/useCourse';
import { useFetchMyProfile, useFetchWishlist } from '../features/auth/useAuth';
import TeacherCourseCard from '../components/ui/TeacherCourseCard';
import PublicCourseCard from '../components/ui/PublicCourseCard';
import WishlistToggle from '../components/ui/WishlistToggle';
import HrWrapper from '../components/ui/HrWrapper';
import { imageUrl } from '../utils/imageUrl';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import LoadingPage from './system/LoadingPage';
import ServerErrorPage from './system/ServerErrorPage';

export type Course = {
  _id: string;
  title: string;
  description?: string;
  slug: string;
  thumbnail?: { url?: string | null; publicId?: string | null } | string | null;
  coverImage?: { url?: string | null; publicId?: string | null } | string | null;
  category?: string;
  level?: string;
  language?: string;
  duration?: string;
  price?: number;
  averageRating?: number;
  publishedAt?: string | null;
  creator?: {
    _id?: string;
    name: string;
    username: string;
    avatarImage?: { url?: string | null; publicId?: string | null } | null;
  };
};

const isDraft = (c: Course) => !c.publishedAt;
const isScheduled = (c: Course) =>
  !!c.publishedAt && new Date(c.publishedAt).getTime() > Date.now();
const isPublished = (c: Course) =>
  !!c.publishedAt && new Date(c.publishedAt).getTime() <= Date.now();

// ✅ Reusable Load More Component
const LoadMoreTrigger = ({
  refProp,
  isFetching,
  hasNextPage,
}: {
  refProp: any;
  isFetching: boolean;
  hasNextPage: boolean;
}) => {
  if (!hasNextPage) return null;
  return (
    <div
      ref={refProp}
      className="col-span-full py-10 flex flex-col items-center justify-center gap-3"
    >
      {isFetching && (
        <SpinnerGapIcon size={24} weight="bold" className="text-accent animate-spin" />
      )}
      <span className="font-heading text-xs uppercase tracking-widest text-text-muted animate-pulse">
        {isFetching ? 'Summoning more manuscripts...' : 'Scroll to reveal more'}
      </span>
      <div className="w-24 h-0.5 bg-accent/40 rounded-full"></div>
    </div>
  );
};

const EmptyGridMessage = ({ icon, message }: { icon: React.ReactNode; message: string }) => (
  <div className="col-span-full w-full flex flex-col items-center justify-center gap-4 py-20 border-2 border-dashed border-border rounded-sm bg-surface/50">
    <span className="text-accent/60 [&>svg]:w-12 [&>svg]:h-12 [&>svg]:shrink-0">{icon}</span>
    <p className="text-text-muted italic font-body text-lg m-0 text-center">{message}</p>
  </div>
);

const matchesSearch = (course: Course, query: string) => {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  const creatorName =
    typeof course.creator === 'object' && course.creator ? course.creator.name.toLowerCase() : '';
  return (
    course.title.toLowerCase().includes(q) ||
    (course.category ?? '').toLowerCase().includes(q) ||
    (course.description ?? '').toLowerCase().includes(q) ||
    creatorName.includes(q)
  );
};

const MyCourses = () => {
  const [formIsOpen, setFormIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const navigate = useNavigate();

  const myProfile = useFetchMyProfile();
  const role = myProfile.data?.user?.role;
  const isTeacher = role === 'teacher';

  const teacherCourses = useMyCourses(isTeacher);
  const enrolledCourses = useFetchEnrolledCourses(!isTeacher);
  const myWishlist = useFetchWishlist();
  const publishMutation = usePublishCourse();

  const teacherCourseList: Course[] = teacherCourses.data?.pages.flatMap((p) => p.courses) ?? [];
  const enrolledCourseList: Course[] = enrolledCourses.data?.pages.flatMap((p) => p.courses) ?? [];
  const wishlist: Course[] = myWishlist.data?.pages.flatMap((p) => p.wishlist) ?? [];

  const q = search.trim();
  const filteredTeacher = teacherCourseList.filter((course) => matchesSearch(course, q));
  const filteredEnrolled = enrolledCourseList.filter((course) => matchesSearch(course, q));
  const filteredWishlist = wishlist.filter((course) => matchesSearch(course, q));

  const publishedCount = teacherCourseList.filter(isPublished).length;
  const scheduledCount = teacherCourseList.filter(isScheduled).length;
  const draftCount = teacherCourseList.filter(isDraft).length;

  const teacherLoadMoreRef = useInfiniteScroll<HTMLDivElement>(
    () => teacherCourses.fetchNextPage(),
    isTeacher && !!teacherCourses.hasNextPage && !teacherCourses.isFetchingNextPage
  );
  const enrolledLoadMoreRef = useInfiniteScroll<HTMLDivElement>(
    () => enrolledCourses.fetchNextPage(),
    !isTeacher && !!enrolledCourses.hasNextPage && !enrolledCourses.isFetchingNextPage
  );
  const wishlistLoadMoreRef = useInfiniteScroll<HTMLDivElement>(
    () => myWishlist.fetchNextPage(),
    !!myWishlist.hasNextPage && !myWishlist.isFetchingNextPage
  );

  const handlePublish = (courseId: string, publishedAt?: string | null) => {
    publishMutation.mutate({ courseId, publishedAt });
  };

  const renderPublicCard = (course: Course) => {
    const creator = typeof course.creator === 'object' && course.creator ? course.creator : null;
    return (
      <div
        key={course._id}
        className="h-full w-full cursor-pointer"
        onClick={() => navigate(`/dashboard/${course.slug}`)}
      >
        <PublicCourseCard>
          <div className="relative">
            <PublicCourseCard.CoverImage
              url={imageUrl(course.coverImage) ?? ''}
              name={course.title}
            />
            <WishlistToggle courseId={course._id} variant="bookmark" />
          </div>
          <PublicCourseCard.Title title={course.title} />
          <PublicCourseCard.Hr name={course.category ?? ''} />
          <PublicCourseCard.Description
            description={course.description ?? ''}
            duration={course.duration}
            level={course.level ?? ''}
            language={course.language ?? ''}
          />
          <PublicCourseCard.Price
            priceType={(course.price ?? 0) > 0 ? 'paid' : 'free'}
            price={course.price ?? 0}
          />
          {creator && (
            <PublicCourseCard.Creator
              avatarImage={creator.avatarImage}
              name={creator.name}
              username={creator.username}
            />
          )}
          <PublicCourseCard.Rating ratings={course.averageRating ?? 0} />
          <PublicCourseCard.PublishAt publishAt={course.publishedAt ?? ''} />
        </PublicCourseCard>
      </div>
    );
  };

  if (myProfile.isLoading) return <LoadingPage />;

  if (isTeacher) {
    if (teacherCourses.isLoading) return <LoadingPage />;
    if (teacherCourses.isError) return <ServerErrorPage />;
  } else {
    if (enrolledCourses.isLoading) return <LoadingPage />;
    if (enrolledCourses.isError) return <ServerErrorPage />;
  }

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 md:px-8 py-12">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[2px] border-2 border-border bg-surface shadow-[3px_3px_0_var(--color-border)]">
              <VideoIcon size={32} weight="fill" className="text-accent" />
            </div>
            <div>
              <h2 className="font-heading text-3xl md:text-4xl text-text m-0 mb-1">My Courses</h2>
              <p className="m-0 mt-1 text-sm italic text-text-muted no-margin">
                {isTeacher
                  ? 'Your personal curriculum library — draft, schedule and publish.'
                  : 'The studies you have inscribed upon your ledger.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Search Bar */}
            <div className="relative w-full sm:w-72">
              <div className="group relative flex items-center border-2 border-border bg-surface rounded-sm shadow-[3px_3px_0_var(--color-border)] transition-all duration-300 focus-within:border-accent focus-within:shadow-[4px_4px_0_var(--color-accent)]">
                <MagnifyingGlassIcon
                  size={18}
                  weight="bold"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none transition-colors group-focus-within:text-accent"
                />
                <input
                  type="search"
                  name="search"
                  placeholder="Search the archives..."
                  className="w-full bg-transparent py-2.5 pl-10 pr-10 font-body text-sm text-text placeholder:text-text-muted focus:outline-none"
                  value={search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-text-muted transition-colors hover:text-accent"
                  >
                    <XIcon size={16} weight="bold" />
                  </button>
                )}
              </div>
            </div>

            {isTeacher && (
              <button
                className="btnSecondary flex items-center gap-3"
                onClick={() => setFormIsOpen(true)}
              >
                <PlusIcon weight="fill" size={20} /> Add Course
              </button>
            )}
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 rounded-sm border-2 border-border bg-surface px-6 py-4 shadow-[3px_3px_0_var(--color-border)] md:justify-start">
          {isTeacher ? (
            <>
              <span className="flex items-center gap-2.5 text-text-secondary">
                <BookOpenIcon size={20} weight="fill" className="text-accent-hover" />
                <strong>{teacherCourseList.length}</strong> Manuscripts
              </span>
              <span className="flex items-center gap-2.5 text-text-secondary">
                <GraduationCapIcon size={20} weight="fill" className="text-accent-hover" />
                <strong>{publishedCount}</strong> Published
              </span>
              <span className="flex items-center gap-2.5 text-text-secondary">
                <CalendarBlankIcon size={20} weight="fill" className="text-accent-hover" />
                <strong>{scheduledCount}</strong> Scheduled
              </span>
              <span className="flex items-center gap-2.5 text-text-secondary">
                <ChalkboardTeacherIcon size={20} weight="fill" className="text-accent-hover" />
                <strong>{draftCount}</strong> Drafts
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-2.5 text-text-secondary">
                <GraduationCapIcon size={20} weight="fill" className="text-accent-hover" />
                <strong>{enrolledCourseList.length}</strong> Inscribed
              </span>
              <span className="flex items-center gap-2.5 text-text-secondary">
                <HeartIcon size={20} weight="fill" className="text-accent-hover" />
                <strong>{wishlist.length}</strong> Wishlisted
              </span>
            </>
          )}
        </div>

        <HrWrapper name="⚜" />
      </motion.div>

      {isTeacher ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
        >
          <div className="teacherThingsContainer">
            {/* Equal-height auto-fill grid */}
            <div className="mt-6 grid items-stretch gap-8 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
              {filteredTeacher.length === 0 && (
                <EmptyGridMessage
                  icon={
                    teacherCourseList.length === 0 ? (
                      <BookOpenIcon weight="thin" />
                    ) : (
                      <MagnifyingGlassIcon weight="thin" />
                    )
                  }
                  message={
                    teacherCourseList.length === 0
                      ? 'Your archives are empty. Add your first curriculum above!'
                      : 'No courses match your search.'
                  }
                />
              )}

              {filteredTeacher.map((course) => (
                <div key={course._id} className="h-full w-full">
                  <TeacherCourseCard
                    course={course}
                    onPublish={handlePublish}
                    isPending={publishMutation.isPending}
                  />
                </div>
              ))}

              <LoadMoreTrigger
                refProp={teacherLoadMoreRef}
                isFetching={teacherCourses.isFetchingNextPage}
                hasNextPage={!!teacherCourses.hasNextPage}
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
        >
          <div className="mt-6 grid items-stretch gap-8 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
            {filteredEnrolled.length === 0 && (
              <EmptyGridMessage
                icon={
                  enrolledCourseList.length === 0 ? (
                    <GraduationCapIcon weight="thin" />
                  ) : (
                    <MagnifyingGlassIcon weight="thin" />
                  )
                }
                message={
                  enrolledCourseList.length === 0
                    ? 'You have not inscribed any courses yet. Wander the Prospectus and pick your studies!'
                    : 'No courses match your search.'
                }
              />
            )}

            {filteredEnrolled.map((course) => renderPublicCard(course))}

            <LoadMoreTrigger
              refProp={enrolledLoadMoreRef}
              isFetching={enrolledCourses.isFetchingNextPage}
              hasNextPage={!!enrolledCourses.hasNextPage}
            />
          </div>
        </motion.div>
      )}

      {/* Add Course Modal */}
      {formIsOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setFormIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-sm border-2 border-border bg-surface shadow-[6px_6px_0_var(--color-border)]"
          >
            <button
              type="button"
              onClick={() => setFormIsOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 z-50 rounded-sm border-2 border-accent bg-surface p-2 text-text transition-colors hover:bg-accent hover:text-bg"
            >
              <XIcon size={20} weight="bold" />
            </button>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <AddCourseForm />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Wishlist Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut', delay: 0.1 }}
        className="mt-16"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[2px] border-2 border-border bg-surface shadow-[3px_3px_0_var(--color-border)]">
            <HeartIcon size={32} weight="fill" className="text-accent" />
          </div>
          <div>
            <h3 className="font-heading text-2xl md:text-3xl text-text m-0 mb-0.5">
              Your Wishlist
            </h3>
            <p className="m-0 mt-0.5 text-xs italic text-text-muted no-margin">
              Marked for future study
            </p>
          </div>
        </div>
        <HrWrapper name="⚜" />

        {wishlist.length === 0 ? (
          <EmptyGridMessage
            icon={<HeartIcon weight="thin" />}
            message="Empty wishlist. Mark your chosen studies and they shall await you here."
          />
        ) : filteredWishlist.length === 0 ? (
          <EmptyGridMessage
            icon={<MagnifyingGlassIcon weight="thin" />}
            message="No courses match your search."
          />
        ) : (
          <div className="mt-6 grid items-stretch gap-8 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
            {filteredWishlist.map((course) => renderPublicCard(course))}

            <LoadMoreTrigger
              refProp={wishlistLoadMoreRef}
              isFetching={myWishlist.isFetchingNextPage}
              hasNextPage={!!myWishlist.hasNextPage}
            />
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default MyCourses;
