import PublicCourseCard from '../components/ui/PublicCourseCard';
import PublicTeacherCard from '../components/ui/PublicTeacherCard';
import WishlistToggle from '../components/ui/WishlistToggle';
import { useFetchCourses } from '../features/course/useCourse';
import { useFetchAllUser, useFetchMyProfile } from '../features/auth/useAuth';
import { imageUrl } from '../utils/imageUrl';
import type { Course } from '../types/FetchDataTypes';
import LoadingPage from './system/LoadingPage';
import ServerErrorPage from './system/ServerErrorPage';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import type { User } from '../features/auth/authSlice';

const PublicCoursePage = () => {
  const [sortBy, setSortBy] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, isError, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFetchCourses({
      sortBy: sortBy === 'newest' ? undefined : sortBy,
      status: statusFilter === 'all' ? undefined : statusFilter,
    });
  const fetchedUser = useFetchAllUser();
  const { data: profile } = useFetchMyProfile();

  const allProfiles: User[] = fetchedUser?.data?.users ?? [];
  const teachers = allProfiles.filter((u) => u.role === 'teacher');
  const userId = profile?.user?._id;
  const courses: Course[] = data?.pages.flatMap((p) => p.courses) ?? [];

  const loadMoreRef = useInfiniteScroll<HTMLDivElement>(
    () => fetchNextPage(),
    !!hasNextPage && !isFetchingNextPage
  );

  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('all');
  const [level, setLevel] = useState('all');
  const [category, setCategory] = useState('all');
  const [tag, setTag] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  const languageSet = new Set<string>(['all']);
  const levelSet = new Set<string>(['all']);
  const categorySet = new Set<string>(['all']);
  const tagSet = new Set<string>(['all']);

  const navigate = useNavigate();

  courses.forEach((course) => {
    languageSet.add(course.language);
    levelSet.add(course.level);
    categorySet.add(course.category);
    course.tags?.forEach((t) => tagSet.add(t));
  });

  // ✅ Search Logic: @ prefix for Teachers, normal for Courses
  const isSearchingTeachers = search.trim().startsWith('@');
  const teacherQuery = search.trim().slice(1).toLowerCase();
  const courseQuery = search.trim().toLowerCase();

  const filteredTeachers = isSearchingTeachers
    ? teachers.filter(
        (t) =>
          !teacherQuery ||
          t.name.toLowerCase().includes(teacherQuery) ||
          t.username.toLowerCase().includes(teacherQuery)
      )
    : [];

  const filteredCourses = !isSearchingTeachers
    ? courses.filter((course) => {
        const matchesSearch = !courseQuery || course.title.toLowerCase().includes(courseQuery);
        const matchesLanguage = language === 'all' || course.language === language;
        const matchesLevel = level === 'all' || course.level === level;
        const matchesCategory = category === 'all' || course.category === category;
        const matchesTag = tag === 'all' || (course.tags ?? []).includes(tag);
        const matchesPrice =
          priceFilter === 'all' ||
          (priceFilter === 'free' ? (course.price ?? 0) === 0 : (course.price ?? 0) > 0);

        return (
          matchesSearch &&
          matchesLanguage &&
          matchesLevel &&
          matchesCategory &&
          matchesTag &&
          matchesPrice
        );
      })
    : [];

  if (isLoading || fetchedUser.isLoading) return <LoadingPage />;
  if (isError || fetchedUser.isError) return <ServerErrorPage />;

  const selectClass =
    'bg-background border border-border px-3 py-2 text-sm rounded-sm focus:outline-none focus:border-primary transition-colors cursor-pointer';

  return (
    <section className="min-h-screen w-full max-w-7xl mx-auto px-4 md:px-8 py-12">
      {/* Page Header (Dynamic) */}
      <div className="text-center mb-12">
        <span className="font-heading text-xs uppercase tracking-widest text-primary block mb-2">
          {isSearchingTeachers ? 'The Esteemed Faculty' : 'The Grand Library'}
        </span>
        <h2 className="font-heading text-3xl md:text-4xl text-text m-0">
          {isSearchingTeachers ? 'Masters of the Courtyard' : 'The Prospectus'}
        </h2>
        <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
      </div>

      {/* ✅ Filter & Sorting Panel (ALWAYS VISIBLE - Search Box Never Disappears) */}
      <div className="mb-8 border-2 border-border bg-surface p-4 rounded-sm shadow-[4px_4px_0_var(--color-border)]">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search Bar (Always here) */}
          <div className="relative w-full lg:max-w-xs">
            <MagnifyingGlassIcon
              size={18}
              weight="bold"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            />
            <input
              type="search"
              name="search"
              placeholder="Search courses... (use @ for masters)"
              className="inputField w-full"
              style={{ paddingLeft: '40px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filters Dropdown (Only visible when searching courses) */}
          {!isSearchingTeachers && (
            <div className="flex flex-wrap gap-3 items-center justify-center w-full lg:w-auto">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-heading uppercase tracking-widest text-text-muted">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={selectClass}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popularity">Popularity</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-heading uppercase tracking-widest text-text-muted">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={selectClass}
                >
                  <option value="all">All</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-heading uppercase tracking-widest text-text-muted">
                  Access
                </label>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className={selectClass}
                >
                  <option value="all">All</option>
                  <option value="free">Complimentary</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-heading uppercase tracking-widest text-text-muted">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={selectClass}
                >
                  {Array.from(languageSet).map((lang) => (
                    <option key={lang} value={lang}>
                      {lang === 'all' ? 'All' : lang}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-heading uppercase tracking-widest text-text-muted">
                  Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className={selectClass}
                >
                  {Array.from(levelSet).map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-heading uppercase tracking-widest text-text-muted">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={selectClass}
                >
                  {Array.from(categorySet).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-heading uppercase tracking-widest text-text-muted">
                  Tags
                </label>
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className={selectClass}
                >
                  {Array.from(tagSet).map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Teacher Grid (Shows when search starts with @) */}
      {isSearchingTeachers ? (
        filteredTeachers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-sm">
            <p className="text-text-muted italic font-body text-lg m-0">
              No faculty found matching "{teacherQuery}".
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid justify-items-center gap-8 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]"
          >
            <AnimatePresence mode="popLayout">
              {filteredTeachers.map((teacher) => (
                <motion.div
                  key={teacher._id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="w-full h-full cursor-pointer"
                  onClick={() => navigate(`/dashboard/users/${teacher.username}`)}
                >
                  <PublicTeacherCard>
                    {imageUrl(teacher.headerImage) && (
                      <PublicTeacherCard.HeaderImage
                        url={imageUrl(teacher.headerImage)!}
                        alt={`${teacher.name}'s banner`}
                      />
                    )}
                    {imageUrl(teacher.avatarImage) && (
                      <PublicTeacherCard.AvatarImage
                        url={imageUrl(teacher.avatarImage)!}
                        alt={teacher.name}
                      />
                    )}
                    <PublicTeacherCard.Title name={teacher.name} />
                    <PublicTeacherCard.Username username={teacher.username} />
                    {teacher.description && (
                      <PublicTeacherCard.Description description={teacher.description} />
                    )}
                    {teacher.occupation && (
                      <PublicTeacherCard.Occupation occupation={teacher.occupation} />
                    )}
                  </PublicTeacherCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )
      ) : /* ✅ Course Grid (Shows normally) */
      filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-sm">
          <p className="text-text-muted italic font-body text-lg m-0">
            The archives are currently empty. Pray, check back soon.
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid justify-items-center gap-8 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]"
        >
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course) => {
              const creator = typeof course.creator === 'object' ? course.creator : null;
              const isEnrolled = !!userId && !!course.students?.includes(userId);
              return (
                <motion.div
                  key={course._id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="w-full h-full cursor-pointer"
                  onClick={() => navigate(`/dashboard/${course.slug}`)}
                >
                  <PublicCourseCard>
                    <div className="relative">
                      <PublicCourseCard.CoverImage
                        url={imageUrl(course.coverImage)}
                        name={course.title}
                      />
                      <WishlistToggle courseId={course._id} variant="bookmark" />
                      {isEnrolled && <PublicCourseCard.EnrolledBadge />}
                    </div>
                    <PublicCourseCard.Title title={course.title} />
                    <PublicCourseCard.Hr name={course.category} />
                    <PublicCourseCard.Description
                      description={course.description}
                      duration={course.duration}
                      level={course.level}
                      language={course.language}
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
                    <hr className="border-border/50" />
                    <div className="flex justify-between items-center">
                      <PublicCourseCard.PublishAt publishAt={course.publishedAt ?? ''} />
                      <PublicCourseCard.StudentCount
                        count={course.studentCount ?? course.students?.length}
                      />
                    </div>
                  </PublicCourseCard>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Infinite Scroll Trigger */}
          {hasNextPage && (
            <div
              ref={loadMoreRef}
              className="col-span-full py-10 flex flex-col items-center justify-center gap-2"
            >
              <span className="font-heading text-xs uppercase tracking-widest text-text-muted animate-pulse">
                {isFetchingNextPage ? 'Summoning more manuscripts...' : 'Scroll to reveal more'}
              </span>
              <div className="w-10 h-1 bg-primary/30 rounded-full"></div>
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
};

export default PublicCoursePage;
