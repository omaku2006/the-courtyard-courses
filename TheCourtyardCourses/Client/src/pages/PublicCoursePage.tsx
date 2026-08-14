import PublicCourseCard from '../components/ui/PublicCourseCard';
import { useFetchCourses } from '../features/course/useCourse';
import { imageUrl } from '../utils/imageUrl';
import type { Course } from '../types/FetchDataTypes';
import LoadingPage from './system/LoadingPage';
import ServerErrorPage from './system/ServerErrorPage';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

const PublicCoursePage = () => {
  const { data, isError, isLoading } = useFetchCourses();
  const courses: Course[] = data?.courses ?? [];

  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('all');
  const [level, setLevel] = useState('all');
  const [category, setCategory] = useState('all');
  const [tag, setTag] = useState('all');

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

  const filteredCourses = courses.filter((course) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || course.title.toLowerCase().includes(q);
    const matchesLanguage = language === 'all' || course.language === language;
    const matchesLevel = level === 'all' || course.level === level;
    const matchesCategory = category === 'all' || course.category === category;
    const matchesTag = tag === 'all' || (course.tags ?? []).includes(tag);
    return matchesSearch && matchesLanguage && matchesLevel && matchesCategory && matchesTag;
  });

  if (isLoading) return <LoadingPage />;
  if (isError) return <ServerErrorPage />;

  // Reusable select class for consistency
  const selectClass =
    'bg-background border border-border px-3 py-2 text-sm rounded-sm focus:outline-none focus:border-primary transition-colors cursor-pointer';

  return (
    // Removed outer AnimatePresence to avoid route transition bugs
    <section className="min-h-screen w-full max-w-7xl mx-auto px-4 md:px-8 py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <span className="font-heading text-xs uppercase tracking-widest text-primary block mb-2">
          The Grand Library
        </span>
        <h2 className="font-heading text-3xl md:text-4xl text-text m-0">The Prospectus</h2>
        <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
      </div>

      {/* ✅ POLISH: Filter & Sorting Panel (Librarian's Desk) */}
      <div className="mb-8 border-2 border-border bg-surface p-4 rounded-sm shadow-[4px_4px_0_var(--color-border)]">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full lg:max-w-xs">
            <MagnifyingGlassIcon
              size={18}
              weight="bold"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            />
            <input
              type="search"
              name="search"
              placeholder="Search the archives..."
              className="inputField w-full" // pl-10 to leave space for icon
              style={{ paddingLeft: '40px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filters Dropdown */}
          <div className="flex flex-wrap gap-3 items-center justify-center w-full lg:w-auto">
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
              <select value={tag} onChange={(e) => setTag(e.target.value)} className={selectClass}>
                {Array.from(tagSet).map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      {filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-sm">
          <p className="text-text-muted italic font-body text-lg">
            The archives are currently empty. Pray, check back soon.
          </p>
        </div>
      ) : (
        // ✅ ANIMATION: Added layout and AnimatePresence for smooth filtering
        <motion.div
          layout
          className="grid justify-items-center gap-8 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]"
        >
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course) => {
              const creator = typeof course.creator === 'object' ? course.creator : null;
              return (
                <motion.div
                  key={course._id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="w-full h-full cursor-pointer"
                  onClick={() => {
                    navigate(`/dashboard/${course.slug}`);
                  }}
                >
                  <PublicCourseCard>
                    <PublicCourseCard.CoverImage
                      url={imageUrl(course.coverImage)}
                      name={course.title}
                    />
                    <PublicCourseCard.Title title={course.title} />
                    <PublicCourseCard.Hr name={course.category} />
                    <PublicCourseCard.Description
                      description={course.description}
                      duration={course.duration} // Added duration back
                      level={course.level}
                      language={course.language}
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
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
};

export default PublicCoursePage;
