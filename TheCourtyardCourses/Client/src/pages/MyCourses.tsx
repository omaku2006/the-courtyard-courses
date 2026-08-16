import { MagnifyingGlassIcon, PlusIcon, VideoIcon, XIcon } from '@phosphor-icons/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      className="col-span-full py-10 flex flex-col items-center justify-center gap-2"
    >
      <span className="font-heading text-xs uppercase tracking-widest text-text-muted animate-pulse">
        {isFetching ? 'Summoning more manuscripts...' : 'Scroll to reveal more'}
      </span>
      <div className="w-10 h-1 bg-primary/30 rounded-full"></div>
    </div>
  );
};

const EmptyGridMessage = ({ message }: { message: string }) => (
  <div className="col-span-full w-full flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-sm">
    <p className="text-text-muted italic font-body text-lg m-0">{message}</p>
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
      <div className="myCourses mb-12">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="font-heading text-3xl md:text-4xl text-text m-0 flex items-center gap-4">
            <VideoIcon size={32} weight="fill" className="text-primary hidden sm:block" />
            My Courses
          </h2>

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
        <div className="w-20 h-1 bg-primary mt-4 rounded-full"></div>
      </div>

      {isTeacher ? (
        <div className="teacherThingsContainer">
          {/* ✅ FIX: Auto-fit grid for consistency */}
          <div className="mt-6 grid justify-items-center gap-8 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
            {filteredTeacher.length === 0 && (
              <EmptyGridMessage
                message={
                  teacherCourseList.length === 0
                    ? 'Your archives are empty. Add your first curriculum above!'
                    : 'No courses match your search.'
                }
              />
            )}

            {filteredTeacher.map((course) => (
              <TeacherCourseCard
                key={course._id}
                course={course}
                onPublish={handlePublish}
                isPending={publishMutation.isPending}
              />
            ))}

            <LoadMoreTrigger
              refProp={teacherLoadMoreRef}
              isFetching={teacherCourses.isFetchingNextPage}
              hasNextPage={!!teacherCourses.hasNextPage}
            />
          </div>

          {/* ✅ FIX: Modal Z-Index and Theme classes */}
          {formIsOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
              <div className="relative flex h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-sm border-2 border-border bg-surface shadow-[6px_6px_0_var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setFormIsOpen(false)}
                  aria-label="Close"
                  className="absolute right-3 top-3 z-50 rounded-sm border-2 border-primary bg-surface p-2 text-text transition-colors hover:bg-primary hover:text-background"
                >
                  <XIcon size={20} weight="bold" />
                </button>
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <AddCourseForm />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 grid justify-items-center gap-8 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
          {filteredEnrolled.length === 0 && (
            <EmptyGridMessage
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
      )}

      {/* Wishlist Section */}
      <div className="mt-20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h3 className="font-heading text-2xl md:text-3xl text-text m-0">Your Wishlist</h3>
          <span className="font-heading text-xs uppercase tracking-widest text-text-muted">
            Marked for future study
          </span>
        </div>
        <div className="w-20 h-1 bg-primary mt-4 rounded-full"></div>

        {wishlist.length === 0 ? (
          <EmptyGridMessage message="Empty wishlist. Mark your chosen studies and they shall await you here." />
        ) : filteredWishlist.length === 0 ? (
          <EmptyGridMessage message="No courses match your search." />
        ) : (
          <div className="mt-6 grid justify-items-center gap-8 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
            {filteredWishlist.map((course) => renderPublicCard(course))}

            <LoadMoreTrigger
              refProp={wishlistLoadMoreRef}
              isFetching={myWishlist.isFetchingNextPage}
              hasNextPage={!!myWishlist.hasNextPage}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default MyCourses;
