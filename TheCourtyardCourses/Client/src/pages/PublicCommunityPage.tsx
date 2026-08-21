import { useState, useMemo } from 'react';
import {
  GlobeHemisphereWestIcon,
  MagnifyingGlassIcon,
  SpinnerGapIcon,
} from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useFetchAllUser } from '../features/auth/useAuth';
import { useFetchCommunities } from '../features/community/useCommunity';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import type { Community } from '../types/FetchDataTypes';
import type { User } from '../features/auth/authSlice';
import CommunityCard from '../components/community/CommunityCard';
import TeacherCard from '../components/ui/TeacherCard';

const PublicCommunityPage = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useFetchCommunities();
  const fetchedUsers = useFetchAllUser();

  const allPages = data?.pages ?? [];
  const allCommunities: Community[] = allPages.flatMap((p) => p.communities ?? []);

  // Only public communities
  const publicCommunities = useMemo(() => allCommunities.filter((c) => !c.isPrivate), [allCommunities]);

  const [search, setSearch] = useState('');
  const [accessFilter, setAccessFilter] = useState('all');
  const communityQuery = search.trim().toLowerCase();

  const isSearchingTeacher = search.trim().startsWith('@');
  const teacherQuery = search.trim().slice(1).toLowerCase();

  const allProfiles: User[] = fetchedUsers?.data?.users ?? [];
  const teachers = allProfiles.filter((u) => u.role === 'teacher');
  const filteredTeachers = isSearchingTeacher
    ? teachers.filter(
        (t) =>
          !teacherQuery ||
          t.name.toLowerCase().includes(teacherQuery) ||
          t.username.toLowerCase().includes(teacherQuery)
      )
    : [];

  const filteredCommunities = useMemo(() => {
    if (isSearchingTeacher) return publicCommunities;
    return publicCommunities.filter((c) => {
      return !communityQuery || c.name.toLowerCase().includes(communityQuery);
    });
  }, [publicCommunities, communityQuery, isSearchingTeacher]);

  const loadMoreRef = useInfiniteScroll<HTMLDivElement>(
    () => fetchNextPage(),
    !!hasNextPage && !isFetchingNextPage
  );

  const selectClass =
    'bg-background border border-border px-3 py-2 text-sm rounded-sm focus:outline-none focus:border-primary transition-colors cursor-pointer';

  return (
    <section className="min-h-screen w-full max-w-7xl mx-auto px-4 md:px-8 py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <span className="font-heading text-xs uppercase tracking-widest text-primary block mb-2">
          Open to All
        </span>
        <h2 className="font-heading text-3xl md:text-4xl text-text m-0">
          {isSearchingTeacher ? 'Masters of the Courtyard' : 'Public Communities'}
        </h2>
        <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full" />
      </div>

      {/* Search & Filter */}
      <div className="mb-8 border-2 border-border bg-surface p-4 rounded-sm shadow-[4px_4px_0_var(--color-border)]">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:max-w-xs">
            <MagnifyingGlassIcon
              size={18}
              weight="bold"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            />
            <input
              type="search"
              name="search"
              placeholder="Search communities... (use @ for masters)"
              className="inputField w-full"
              style={{ paddingLeft: '40px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {!isSearchingTeacher && (
            <div className="flex flex-wrap gap-3 items-center justify-center w-full lg:w-auto">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-heading uppercase tracking-widest text-text-muted">
                  Access
                </label>
                <select
                  value={accessFilter}
                  onChange={(e) => setAccessFilter(e.target.value)}
                  className={selectClass}
                >
                  <option value="all">All</option>
                  <option value="public">Public</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Teacher Search */}
      {isSearchingTeacher ? (
        filteredTeachers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-sm">
            <p className="text-text-muted italic font-body text-lg m-0">
              No faculty found matching &quot;{teacherQuery}&quot;.
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid items-start gap-8 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] [grid-auto-rows:auto]"
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
                  className="w-full"
                >
                  <TeacherCard teacher={teacher} to={`/user/${teacher.username}`} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )
      ) : isLoading ? (
        <div className="flex items-center justify-center gap-3 py-20 text-text-muted italic font-heading">
          <SpinnerGapIcon size={22} weight="bold" className="text-primary animate-spin" />
          Discovering communities...
        </div>
      ) : filteredCommunities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-sm">
          <GlobeHemisphereWestIcon size={48} weight="thin" className="text-primary/40 mb-2" />
          <p className="text-text-muted italic font-body text-lg m-0">
            No public communities found. Pray, check back soon.
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid items-start gap-8 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]"
        >
          <AnimatePresence mode="popLayout">
            {filteredCommunities.map((community) => (
              <motion.div
                key={community._id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-full h-full"
              >
                <CommunityCard community={community} />
              </motion.div>
            ))}
          </AnimatePresence>

          {hasNextPage && (
            <div
              ref={loadMoreRef}
              className="col-span-full py-10 flex flex-col items-center justify-center gap-2"
            >
              <span className="font-heading text-xs uppercase tracking-widest text-text-muted animate-pulse">
                {isFetchingNextPage ? 'Summoning more gatherings...' : 'Scroll to reveal more'}
              </span>
              <div className="w-10 h-1 bg-primary/30 rounded-full" />
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
};

export default PublicCommunityPage;
