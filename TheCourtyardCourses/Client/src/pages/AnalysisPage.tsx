import {
  ChartLineIcon,
  FireIcon,
  TrophyIcon,
  BookOpenIcon,
  StarIcon,
  UsersThreeIcon,
  CurrencyCircleDollarIcon,
} from '@phosphor-icons/react';
import { useFetchMyProfile } from '../features/auth/useAuth';
import {
  useFetchStudentAnalytics,
  useFetchTeacherAnalytics,
} from '../features/analysis/useAnalysis';
import LoadingPage from './system/LoadingPage';
import NotFoundPage from './system/NotFoundPage';
import ProgressChart from '../components/analysis/ProgressChart';
import StatsCard from '../components/analysis/StatsCard';

const AnalysisPage = () => {
  const { data: profileData } = useFetchMyProfile();
  const user = profileData?.user;
  const isTeacher = user?.role === 'teacher';

  const { data: studentData, isLoading: studentLoading } = useFetchStudentAnalytics();
  const { data: teacherData, isLoading: teacherLoading } = useFetchTeacherAnalytics();

  const isLoading = isTeacher ? teacherLoading : studentLoading;

  if (isLoading) return <LoadingPage />;
  if (!studentData && !teacherData) return <NotFoundPage />;

  return (
    <section className="flex flex-col gap-6 w-full min-h-0 p-4">
      {/* Header */}
      <div>
        <h1
          className="no-margin font-heading text-text"
          style={{ fontSize: 'clamp(1.5rem, 1.2rem + 1vw, 1.875rem)' }}
        >
          Analysis
        </h1>
        <p className="no-margin text-text-muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
          {isTeacher
            ? 'Track your courses, students, and revenue.'
            : 'Track your learning progress and achievements.'}
        </p>
      </div>

      {/* Student Analytics */}
      {!isTeacher && studentData && <StudentView data={studentData} />}

      {/* Teacher Analytics */}
      {isTeacher && teacherData && <TeacherView data={teacherData} />}
    </section>
  );
};

const StudentView = ({ data }: { data: any }) => {
  const { stats, courseProgress, weeklyActivity, streak, badges, certificates } = data;

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatsCard
          icon={<BookOpenIcon size={20} weight="fill" />}
          label="Enrolled"
          value={stats.totalEnrolled}
        />
        <StatsCard
          icon={<ChartLineIcon size={20} weight="fill" />}
          label="Completed"
          value={stats.completed}
        />
        <StatsCard
          icon={<ChartLineIcon size={20} weight="fill" />}
          label="In Progress"
          value={stats.inProgress}
        />
        <StatsCard
          icon={<ChartLineIcon size={20} weight="fill" />}
          label="Overall"
          value={`${stats.overallProgress}%`}
        />
        <StatsCard
          icon={<FireIcon size={20} weight="fill" />}
          label="Streak"
          value={`${streak} days`}
          highlight={streak > 0}
        />
        <StatsCard
          icon={<TrophyIcon size={20} weight="fill" />}
          label="Chapters"
          value={stats.totalChaptersCompleted}
        />
      </div>

      {/* Weekly Activity Chart */}
      <div className="p-4 rounded-sm border-2 border-border bg-surface flex flex-col gap-3">
        <h3 className="no-margin font-heading font-bold text-text uppercase tracking-wider" style={{ fontSize: '0.875rem' }}>
          This Week
        </h3>
        <ProgressChart data={weeklyActivity} />
      </div>

      {/* Course Progress */}
      <div className="flex flex-col gap-3">
        <h3 className="no-margin font-heading font-bold text-text uppercase tracking-wider" style={{ fontSize: '0.875rem' }}>
          Course Progress
        </h3>
        {courseProgress.length === 0 ? (
          <p className="no-margin text-text-muted py-8 text-center" style={{ fontSize: '0.75rem' }}>
            No courses enrolled yet. Start learning!
          </p>
        ) : (
          courseProgress.map((cp: any) => (
            <div
              key={cp.courseId}
              className="flex items-center gap-3 p-3 rounded-sm border-2 border-border bg-surface"
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
                <h4 className="no-margin font-heading font-bold text-text truncate" style={{ fontSize: '0.75rem' }}>{cp.title}</h4>
                <span className="no-margin text-text-muted font-heading" style={{ fontSize: '0.625rem' }}>
                  {cp.completedChapters}/{cp.totalChapters} chapters
                </span>
                <div className="w-full h-1.5 rounded-full bg-border mt-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${cp.progress}%` }}
                  />
                </div>
              </div>
              <span className="no-margin font-heading font-bold text-text shrink-0" style={{ fontSize: '0.75rem' }}>
                {cp.progress}%
              </span>
            </div>
          ))
        )}
      </div>

      {/* Badges & Certificates */}
      {(badges.length > 0 || certificates.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {badges.length > 0 && (
            <div className="p-4 rounded-sm border-2 border-border bg-surface flex flex-col gap-3">
              <h3 className="no-margin font-heading font-bold text-text uppercase tracking-wider" style={{ fontSize: '0.875rem' }}>
                Badges
              </h3>
              <div className="flex flex-wrap gap-2">
                {badges.map((b: string, i: number) => (
                  <span
                    key={i}
                    className="no-margin inline-flex items-center gap-1 font-heading uppercase tracking-wider px-2 py-1 rounded-sm border border-border bg-bg text-text-muted"
                    style={{ fontSize: '0.625rem' }}
                  >
                    <TrophyIcon size={10} weight="fill" className="text-accent" />
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}
          {certificates.length > 0 && (
            <div className="p-4 rounded-sm border-2 border-border bg-surface flex flex-col gap-3">
              <h3 className="no-margin font-heading font-bold text-text uppercase tracking-wider" style={{ fontSize: '0.875rem' }}>
                Certificates
              </h3>
              <div className="flex flex-col gap-2">
                {certificates.map((c: any, i: number) => (
                  <a
                    key={i}
                    href={c.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-heading text-accent hover:underline"
                    style={{ fontSize: '0.75rem' }}
                  >
                    Certificate #{i + 1} — {new Date(c.issuedAt).toLocaleDateString()}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

const TeacherView = ({ data }: { data: any }) => {
  const { stats, courseStats } = data;

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatsCard
          icon={<BookOpenIcon size={20} weight="fill" />}
          label="Courses"
          value={stats.totalCourses}
        />
        <StatsCard
          icon={<ChartLineIcon size={20} weight="fill" />}
          label="Published"
          value={stats.publishedCourses}
        />
        <StatsCard
          icon={<ChartLineIcon size={20} weight="fill" />}
          label="Scheduled"
          value={stats.scheduledCourses}
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
        <StatsCard
          icon={<CurrencyCircleDollarIcon size={20} weight="fill" />}
          label="Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
        />
      </div>

      {/* Course Stats */}
      <div className="flex flex-col gap-3">
        <h3 className="no-margin font-heading font-bold text-text uppercase tracking-wider" style={{ fontSize: '0.875rem' }}>
          Your Courses
        </h3>
        {courseStats.length === 0 ? (
          <p className="no-margin text-text-muted py-8 text-center" style={{ fontSize: '0.75rem' }}>
            No courses created yet. Start teaching!
          </p>
        ) : (
          courseStats.map((cs: any) => (
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
                <h4 className="no-margin font-heading font-bold text-text truncate" style={{ fontSize: '0.75rem' }}>{cs.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="no-margin text-text-muted font-heading" style={{ fontSize: '0.625rem' }}>
                    {cs.studentCount} student{cs.studentCount !== 1 ? 's' : ''}
                  </span>
                  <span className="no-margin text-text-muted font-heading flex items-center gap-0.5" style={{ fontSize: '0.625rem' }}>
                    <StarIcon size={10} weight="fill" className="text-accent" />
                    {cs.averageRating} ({cs.ratingCount})
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default AnalysisPage;
