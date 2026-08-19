import { useState, useMemo, useRef, useCallback } from 'react';
import {
  UsersThreeIcon,
  PlusIcon,
  XIcon,
  MagnifyingGlassIcon,
  SpinnerGapIcon,
  GlobeHemisphereWestIcon,
} from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useFetchMyProfile, useFetchAllUser } from '../features/auth/useAuth';
import {
  useFetchJoinedCommunities,
  useFetchCommunities,
} from '../features/community/useCommunity';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import type { Community } from '../types/FetchDataTypes';
import type { User } from '../features/auth/authSlice';
import CommunityCard from '../components/community/CommunityCard';
import CommunityForm from '../components/community/CommunityForm';
import TeacherCard from '../components/ui/TeacherCard';
import HrWrapper from '../components/ui/HrWrapper';
import LoadingPage from './system/LoadingPage';
import ServerErrorPage from './system/ServerErrorPage';

const CommunityPage = () => {
  const { data: profileData, isLoading: profileLoading, isError: profileError } = useFetchMyProfile();
  const { data: joinedData, isLoading: joinedLoading, isError: joinedError } = useFetchJoinedCommunities();
  const {
    data: allData,
    isLoading: allLoading,
    isError: allError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchCommunities();
  const fetchedUsers = useFetchAllUser();

  const user: User | undefined = profileData?.user;
  const userId = user?._id;
  const userCourseIds: string[] = (user?.courses as any[])?.map((c: any) => String(c?._id ?? c)) ?? [];
  const joinedCommunities: Community[] = joinedData?.communities ?? [];
  const joinedIds = new Set(joinedCommunities.map((c) => c._id));
  const allPages = allData?.pages ?? [];
  const allCommunities: Community[] = allPages.flatMap((p) => p.communities ?? []);

  const otherCommunities = useMemo(() => {
    return allCommunities.filter((c) => {
      if (joinedIds.has(c._id)) return false;
      if (!c.isPrivate) return true;
      const courseIds = (c.courses ?? []).map((cr) => String(typeof cr === 'string' ? cr : cr._id));
      return courseIds.some((cid) => userCourseIds.includes(cid));
    });
  }, [allCommunities, joinedIds, userCourseIds]);

  const [search, setSearch] = useState('');
  const [accessFilter, setAccessFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);

  const closeForm = () => setFormOpen(false);

  const isSearchingTeacher = search.trim().startsWith('@');
  const teacherQuery = search.trim().slice(1).toLowerCase();
  const communityQuery = search.trim().toLowerCase();

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

  const filteredJoined = useMemo(() => {
    if (isSearchingTeacher) return joinedCommunities;
    return joinedCommunities.filter((c) => {
      const matchesSearch = !communityQuery || c.name.toLowerCase().includes(communityQuery);
      const matchesAccess =
        accessFilter === 'all' ||
        (accessFilter === 'private' && c.isPrivate) ||
        (accessFilter === 'public' && !c.isPrivate);
      return matchesSearch && matchesAccess;
    });
  }, [joinedCommunities, communityQuery, accessFilter, isSearchingTeacher]);

  const filteredOther = useMemo(() => {
    if (isSearchingTeacher) return otherCommunities;
    return otherCommunities.filter((c) => {
      const matchesSearch = !communityQuery || c.name.toLowerCase().includes(communityQuery);
      const matchesAccess =
        accessFilter === 'all' ||
        (accessFilter === 'private' && c.isPrivate) ||
        (accessFilter === 'public' && !c.isPrivate);
      return matchesSearch && matchesAccess;
    });
  }, [otherCommunities, communityQuery, accessFilter, isSearchingTeacher]);

  const loadMoreRef = useInfiniteScroll<HTMLDivElement>(
    () => fetchNextPage(),
    !!hasNextPage && !isFetchingNextPage
  );

  if (profileLoading || joinedLoading) return <LoadingPage />;
  if (profileError || joinedError) return <ServerErrorPage />;

  const selectClass =
    'bg-background border border-border px-3 py-2 text-sm rounded-sm focus:outline-none focus:border-primary transition-colors cursor-pointer';

  return (
    <section className="min-h-screen w-full max-w-7xl mx-auto px-4 md:px-8 py-12">
      {/* Page Header */}
      <div className="text-center mb-8">
        <span className="font-heading text-xs uppercase tracking-widest text-accent block mb-2">
          The Gathering Hall
        </span>
        <h2 className="font-heading text-3xl md:text-4xl text-text m-0">
          {isSearchingTeacher ? 'Masters of the Courtyard' : 'Communities'}
        </h2>
        <div className="w-20 h-1 bg-accent mx-auto mt-4 rounded-full" />
      </div>

      {/* Search & Filter Panel */}
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
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Teacher Search Results */}
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
                  <TeacherCard teacher={teacher} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )
      ) : (
        <>
          {/* MY COMMUNITIES (Horizontal Scroll) */}
          <div className="mb-10">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-2">
              <h3 className="flex gap-4 items-center font-heading text-2xl text-text m-0">
                <UsersThreeIcon size={32} weight="fill" className="text-accent-hover" />
                My Communities
              </h3>
              {user?.role === 'teacher' && (
                <button
                  className="btnSecondary inline-flex items-center gap-2 hover:-translate-y-0.5 transition-transform"
                  onClick={() => setFormOpen(true)}
                >
                  <PlusIcon weight="fill" size={20} />
                  Add Community
                </button>
              )}
            </div>
            <HrWrapper name="Your Gatherings" className="my-4" />

            {filteredJoined.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-12 text-text-muted">
                <UsersThreeIcon size={48} weight="thin" className="text-accent/40" />
                <p className="font-heading text-lg m-0">No communities yet.</p>
                <p className="text-sm italic m-0">Establish your first community to begin.</p>
                {user?.role === 'teacher' && (
                  <button
                    className="btnSecondary inline-flex items-center gap-2 mt-2"
                    onClick={() => setFormOpen(true)}
                  >
                    <PlusIcon weight="fill" size={18} />
                    Establish One
                  </button>
                )}
              </div>
            ) : (
              <div className="community-scroll hide-scrollbar">
                {filteredJoined.map((community) => (
                  <CommunityCard key={community._id} community={community} />
                ))}
              </div>
            )}
          </div>

          {/* OTHER COMMUNITIES (Grid) */}
          <div>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-2">
              <h3 className="flex gap-4 items-center font-heading text-2xl text-text m-0">
                <GlobeHemisphereWestIcon size={32} weight="fill" className="text-accent-hover" />
                Other Communities
              </h3>
            </div>
            <HrWrapper name="Discover" className="my-4" />

            {allLoading ? (
              <div className="flex items-center justify-center gap-3 py-12 text-text-muted italic font-heading">
                <SpinnerGapIcon size={22} weight="bold" className="text-accent animate-spin" />
                Discovering communities...
              </div>
            ) : filteredOther.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-border rounded-sm">
                <GlobeHemisphereWestIcon size={48} weight="thin" className="text-accent/40 mb-2" />
                <p className="text-text-muted italic font-heading text-lg m-0">
                  No other communities to discover at this time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOther.map((community) => (
                  <CommunityCard key={community._id} community={community} />
                ))}
              </div>
            )}

            {hasNextPage && (
              <div
                ref={loadMoreRef}
                className="col-span-full py-10 flex flex-col items-center justify-center gap-2"
              >
                <span className="font-heading text-xs uppercase tracking-widest text-text-muted animate-pulse">
                  {isFetchingNextPage ? 'Summoning more gatherings...' : 'Scroll to reveal more'}
                </span>
                <div className="w-10 h-1 bg-accent/30 rounded-full" />
              </div>
            )}
          </div>
        </>
      )}

      {/* Community Form Modal */}
      <AnimatePresence>
        {formOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeForm}
          >
            <motion.div
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-sm border-2 border-border bg-surface p-6 shadow-[6px_6px_0_var(--color-border)]"
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                <div>
                  <h4 className="m-0 font-heading text-lg text-text">Establish a Community</h4>
                  <p className="m-0 text-[10px] text-text-muted italic mt-0.5 font-heading">
                    Gather your scholars under one banner.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeForm}
                  className="p-2 rounded-sm border-2 border-border text-text-muted hover:bg-bg hover:text-text transition-colors"
                >
                  <XIcon size={20} weight="bold" />
                </button>
              </div>
              <CommunityForm onCreated={closeForm} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CommunityPage;
