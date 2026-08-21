import {
  BookBookmarkIcon,
  BookOpenIcon,
  BooksIcon,
  CalendarDotsIcon,
  ChartLineIcon,
  FireIcon,
  StarIcon,
  TrophyIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { useFetchMyProfile } from '../features/auth/useAuth';
import {
  useFetchStudentAnalytics,
  useFetchTeacherAnalytics,
} from '../features/analysis/useAnalysis';
import LoadingPage from './system/LoadingPage';
import StatsCard from '../components/analysis/StatsCard';
import ProgressChart from '../components/analysis/ProgressChart';
import Fence from '../components/ui/Fence';
import FadeInView from '../components/ui/Animate';

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const DashboardPage = () => {
  const { data: profileData, isLoading: profileLoading } = useFetchMyProfile();
  const user = profileData?.user;
  const isTeacher = user?.role === 'teacher';

  const { data: studentData, isLoading: studentLoading } = useFetchStudentAnalytics();
  const { data: teacherData, isLoading: teacherLoading } = useFetchTeacherAnalytics();

  const isLoading = profileLoading || (isTeacher ? teacherLoading : studentLoading);

  if (isLoading) return <LoadingPage />;
  if (!user) return null;

  return (
    <section className="flex flex-col gap-6 w-full min-h-0 p-4">
      {/* ── Greeting ──────────────────────────────────────────── */}
      <FadeInView>
      <div>
        <h1
          className="no-margin font-heading text-text"
          style={{ fontSize: 'clamp(1.5rem, 1.2rem + 1vw, 1.875rem)' }}
        >
          {greeting()}, {user.name.split(' ')[0]}
        </h1>
        <p className="no-margin text-text-muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
          {isTeacher
            ? 'Your teaching dashboard — manage courses, students, and communities.'
            : 'Your learning hub — track progress, schedule sessions, and continue studying.'}
        </p>
      </div>
      </FadeInView>

      {/* ── Stats ─────────────────────────────────────────────── */}
      {!isTeacher && studentData && <StudentStats data={studentData} />}
      {isTeacher && teacherData && <TeacherStats data={teacherData} />}

      {/* ── Courses ───────────────────────────────────────────── */}
      {!isTeacher && studentData && <StudentCourses data={studentData} />}
      {isTeacher && teacherData && <TeacherCourses data={teacherData} />}

      {/* ── Quick Links ───────────────────────────────────────── */}
      <FadeInView delay={0.2}>
      <QuickLinks isTeacher={isTeacher} />
      </FadeInView>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   STUDENT
   ═══════════════════════════════════════════════════════════════ */

const StudentStats = ({ data }: { data: any }) => {
  const { stats, streak, weeklyActivity } = data;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatsCard
          icon={<BookOpenIcon size={20} weight="fill" />}
          label="Enrolled"
          value={stats.totalEnrolled}
        />
        <StatsCard
          icon={<TrophyIcon size={20} weight="fill" />}
          label="Chapters Done"
          value={stats.totalChaptersCompleted}
        />
        <StatsCard
          icon={<FireIcon size={20} weight="fill" />}
          label="Streak"
          value={`${streak} days`}
          highlight={streak > 0}
        />
        <StatsCard
          icon={<ChartLineIcon size={20} weight="fill" />}
          label="Overall"
          value={`${stats.overallProgress}%`}
        />
      </div>

      {/* Weekly Activity */}
      <div className="p-4 rounded-sm border-2 border-border bg-surface flex flex-col gap-3">
        <h3
          className="no-margin font-heading font-bold text-text uppercase tracking-wider"
          style={{ fontSize: '0.875rem' }}
        >
          This Week
        </h3>
        <ProgressChart data={weeklyActivity} />
      </div>
    </>
  );
};

const StudentCourses = ({ data }: { data: any }) => {
  const navigate = useNavigate();
  const { courseProgress } = data;

  if (courseProgress.length === 0) {
    return (
      <div className="p-4 rounded-sm border-2 border-border bg-surface flex flex-col items-center gap-3">
        <BookOpenIcon size={32} weight="fill" className="text-accent" />
        <p className="no-margin text-text-muted text-center" style={{ fontSize: '0.75rem' }}>
          No courses enrolled yet. Browse courses to get started!
        </p>
        <button
          type="button"
          onClick={() => navigate('/dashboard/courses')}
          className="btnSecondary px-4! py-2! text-xs!"
        >
          Browse Courses
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3
          className="no-margin font-heading font-bold text-text uppercase tracking-wider"
          style={{ fontSize: '0.875rem' }}
        >
          Your Courses
        </h3>
        <button
          type="button"
          onClick={() => navigate('/dashboard/my-courses')}
          className="no-margin font-heading text-accent hover:underline cursor-pointer bg-transparent border-none"
          style={{ fontSize: '0.75rem' }}
        >
          View All →
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {courseProgress.slice(0, 4).map((cp: any) => (
          <div
            key={cp.courseId}
            className="flex items-center gap-3 p-3 rounded-sm border-2 border-border bg-surface cursor-pointer hover:brightness-105 transition-all"
            onClick={() => navigate(`/dashboard/${cp.slug}`)}
          >
            {cp.thumbnail?.url ? (
              <img
                src={cp.thumbnail.url}
                alt={cp.title}
                className="w-12 h-12 rounded-sm object-cover border-2 border-border shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-sm bg-accent/20 flex items-center justify-center border-2 border-border shrink-0">
                <BookOpenIcon size={20} weight="fill" className="text-accent" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4
                className="no-margin font-heading font-bold text-text truncate"
                style={{ fontSize: '0.75rem' }}
              >
                {cp.title}
              </h4>
              <span
                className="no-margin text-text-muted font-heading"
                style={{ fontSize: '0.625rem' }}
              >
                {cp.completedChapters}/{cp.totalChapters} chapters
              </span>
              <div
                className="relative w-full shrink-0 overflow-hidden border-2 border-border bg-background mt-1.5"
                style={{ height: 20 }}
              >
                <Fence fill size={16} spacing={0} tileHeight={20} />
                <div
                  className="absolute inset-0 overflow-hidden transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, cp.progress))}%` }}
                >
                  <Fence fill size={16} spacing={0} tileHeight={20} color="var(--color-success)" />
                </div>
              </div>
            </div>
            <span
              className="no-margin font-heading font-bold text-text shrink-0"
              style={{ fontSize: '0.75rem' }}
            >
              {cp.progress}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   TEACHER
   ═══════════════════════════════════════════════════════════════ */

const TeacherStats = ({ data }: { data: any }) => {
  const { stats } = data;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatsCard
        icon={<BooksIcon size={20} weight="fill" />}
        label="Courses"
        value={stats.totalCourses}
      />
      <StatsCard
        icon={<BookOpenIcon size={20} weight="fill" />}
        label="Published"
        value={stats.publishedCourses}
      />
      <StatsCard
        icon={<UsersThreeIcon size={20} weight="fill" />}
        label="Students"
        value={stats.totalStudents}
      />
      <StatsCard
        icon={<StarIcon size={20} weight="fill" />}
        label="Avg Rating"
        value={stats.avgRating}
      />
    </div>
  );
};

const TeacherCourses = ({ data }: { data: any }) => {
  const { courseStats } = data;

  if (courseStats.length === 0) {
    return (
      <div className="p-4 rounded-sm border-2 border-border bg-surface flex flex-col items-center gap-3">
        <BooksIcon size={32} weight="fill" className="text-accent" />
        <p className="no-margin text-text-muted text-center" style={{ fontSize: '0.75rem' }}>
          No courses created yet. Start building your curriculum!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h3
        className="no-margin font-heading font-bold text-text uppercase tracking-wider"
        style={{ fontSize: '0.875rem' }}
      >
        Your Courses
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {courseStats.slice(0, 4).map((cs: any) => (
          <div
            key={cs.courseId}
            className="flex items-center gap-3 p-3 rounded-sm border-2 border-border bg-surface"
          >
            {cs.thumbnail?.url ? (
              <img
                src={cs.thumbnail.url}
                alt={cs.title}
                className="w-12 h-12 rounded-sm object-cover border-2 border-border shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-sm bg-accent/20 flex items-center justify-center border-2 border-border shrink-0">
                <BookOpenIcon size={20} weight="fill" className="text-accent" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4
                className="no-margin font-heading font-bold text-text truncate"
                style={{ fontSize: '0.75rem' }}
              >
                {cs.title}
              </h4>
              <div className="flex items-center gap-3 mt-1">
                <span
                  className="no-margin text-text-muted font-heading"
                  style={{ fontSize: '0.625rem' }}
                >
                  {cs.studentCount} student{cs.studentCount !== 1 ? 's' : ''}
                </span>
                <span
                  className="no-margin text-text-muted font-heading flex items-center gap-0.5"
                  style={{ fontSize: '0.625rem' }}
                >
                  <StarIcon size={10} weight="fill" className="text-accent" />
                  {cs.averageRating} ({cs.ratingCount})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   QUICK LINKS
   ═══════════════════════════════════════════════════════════════ */

const QuickLinks = ({ isTeacher }: { isTeacher: boolean }) => {
  const navigate = useNavigate();

  const links = [
    { icon: <BooksIcon size={24} weight="fill" />, label: 'Browse Courses', to: '/dashboard/courses' },
    { icon: <BookBookmarkIcon size={24} weight="fill" />, label: 'My Courses', to: '/dashboard/my-courses' },
    { icon: <UsersThreeIcon size={24} weight="fill" />, label: 'Communities', to: '/dashboard/communities' },
    { icon: <ChartLineIcon size={24} weight="fill" />, label: 'Analysis', to: '/dashboard/analysis' },
    ...(!isTeacher
      ? [{ icon: <CalendarDotsIcon size={24} weight="fill" />, label: 'Schedule', to: '/dashboard/schedule' }]
      : []),
  ];

  return (
    <div className="flex flex-col gap-3">
      <h3
        className="no-margin font-heading font-bold text-text uppercase tracking-wider"
        style={{ fontSize: '0.875rem' }}
      >
        Quick Links
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {links.map((link) => (
          <button
            key={link.to}
            type="button"
            onClick={() => navigate(link.to)}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-sm border-2 border-border bg-surface hover:bg-bg hover:brightness-105 transition-all cursor-pointer"
          >
            <span className="text-accent">{link.icon}</span>
            <span
              className="no-margin font-heading uppercase tracking-wider text-text"
              style={{ fontSize: '0.625rem' }}
            >
              {link.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
