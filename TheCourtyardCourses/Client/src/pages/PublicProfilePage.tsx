import {
  ArrowLeftIcon,
  AtIcon,
  BookOpenIcon,
  ChalkboardTeacherIcon,
  FeatherIcon,
  GraduationCapIcon,
  MedalIcon,
  SparkleIcon,
  XIcon,
} from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import HrWrapper from '../components/ui/HrWrapper';
import { useFetchProfile } from '../features/auth/useAuth';
import type { User } from '../features/auth/authSlice';
import type { Course } from '../types/FetchDataTypes';
import { imageUrl } from '../utils/imageUrl';
import LoadingPage from './system/LoadingPage';
import NotFoundPage from './system/NotFoundPage';
import ServerErrorPage from './system/ServerErrorPage';

interface PublicUser extends User {
  courses?: Course[];
}

const getInitials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('') || '?';

const PublicProfilePage = () => {
  const { username = '' } = useParams();
  const { data, isError, isLoading } = useFetchProfile(username);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewImage(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (isLoading) return <LoadingPage />;
  if (isError) return <ServerErrorPage />;
  if (!username || !data?.user) return <NotFoundPage />;

  const user = data.user as PublicUser;
  const isTeacher = user.role === 'teacher';
  const roleLabel = isTeacher ? 'Tutor' : 'Scholar';
  const RoleIcon = isTeacher ? ChalkboardTeacherIcon : GraduationCapIcon;
  const subjects: string[] = Array.isArray(user.subjects) ? user.subjects : [];
  const badges: string[] = Array.isArray(user.badges) ? user.badges : [];
  const avatarSrc = imageUrl(user.avatarImage);
  const headerSrc = imageUrl(user.headerImage);
  const courses: Course[] = Array.isArray(user.courses) ? user.courses : [];

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-12 md:px-8">
      <Link
        to="/"
        className="inline-flex w-fit items-center gap-2 text-sm italic text-text-muted transition-colors hover:text-text-primary"
      >
        <ArrowLeftIcon size={16} weight="bold" />
        Return to the Courtyard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="flex flex-col gap-6"
      >
        <div className="overflow-hidden rounded-[4px] border-2 border-accent bg-surface shadow-[0_16px_40px_-16px_rgba(46,57,69,0.45)]">
          <div className="relative h-52 overflow-hidden bg-gradient-to-br from-highlight via-highlight to-accent-hover md:h-64">
            {headerSrc ? (
              <img
                src={headerSrc}
                alt={`${user.name} banner`}
                onClick={() => headerSrc && setPreviewImage(headerSrc)}
                className="h-full w-full cursor-zoom-in object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="italic text-light">{user.name}</h2>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface via-surface/15 to-transparent" />
          </div>

          <div className="relative px-6 pb-8 pt-0 md:px-10">
            <div className="flex flex-col items-center gap-5 text-center md:flex-row md:items-end md:gap-6 md:-mt-16 md:text-left">
              <div className="-mt-16 shrink-0 md:mt-0">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[4px] border-4 border-surface bg-accent shadow-lg md:h-32 md:w-32">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={user.name}
                      onClick={() => avatarSrc && setPreviewImage(avatarSrc)}
                      className="h-full w-full cursor-zoom-in object-cover"
                    />
                  ) : (
                    <h3 className="text-light">{getInitials(user.name)}</h3>
                  )}
                </div>
              </div>

              <div className="flex flex-1 flex-col items-center gap-1 md:items-start">
                <h3 className="mb-1">{user.name}</h3>
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-text-muted italic md:justify-start">
                  <span className="flex items-center gap-1.5">
                    <AtIcon size={16} weight="bold" />
                    {user.username}
                  </span>
                </div>
              </div>

              <div className="shrink-0 md:ml-auto md:self-end">
                <span className="inline-flex items-center gap-2 rounded-[2px] border-2 border-accent bg-bg px-4 py-1.5">
                  <RoleIcon size={18} weight="fill" className="text-accent-hover" />
                  <span className="font-heading text-sm uppercase tracking-wider text-text-primary">
                    {roleLabel}
                  </span>
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 border-t border-accent/40 pt-5 md:justify-start">
              {isTeacher && (
                <span className="flex items-center gap-2.5 text-text-secondary">
                  <SparkleIcon size={20} weight="fill" className="text-accent-hover" />
                  <strong>{user.experience ?? 0}</strong> Years of Teaching
                </span>
              )}
              {user.occupation && (
                <span className="flex items-center gap-2.5 text-text-secondary">
                  <FeatherIcon size={20} weight="fill" className="text-accent-hover" />
                  {user.occupation}
                </span>
              )}
              <span className="flex items-center gap-2.5 text-text-secondary">
                <BookOpenIcon size={20} weight="fill" className="text-accent-hover" />
                <strong>{subjects.length}</strong> {subjects.length === 1 ? 'Subject' : 'Subjects'}
              </span>
              {badges.length > 0 && (
                <span className="flex items-center gap-2.5 text-text-secondary">
                  <MedalIcon size={20} weight="fill" className="text-accent-hover" />
                  <strong>{badges.length}</strong> {badges.length === 1 ? 'Badge' : 'Badges'}
                </span>
              )}
            </div>
          </div>
        </div>

        <HrWrapper name="⚜" />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[4px] border-2 border-accent bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent-hover">
            <div className="mb-4 flex items-center gap-2">
              <FeatherIcon size={20} weight="fill" className="text-accent-hover" />
              <h4 className="m-0 underline underline-offset-4">Description</h4>
            </div>
            <p className="italic text-text-secondary">
              {user.description || 'No description inscribed yet.'}
            </p>
          </div>

          <div className="rounded-[4px] border-2 border-accent bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent-hover">
            <div className="mb-4 flex items-center gap-2">
              <RoleIcon size={20} weight="fill" className="text-accent-hover" />
              <h4 className="m-0 underline underline-offset-4">
                {isTeacher ? 'Disciplines' : 'Favourite Subjects'}
              </h4>
            </div>
            {subjects.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {subjects.map((sub: string) => (
                  <span
                    key={sub}
                    className="rounded-[2px] border border-accent bg-bg px-4 py-1.5 italic text-text-secondary transition-colors duration-300 hover:bg-accent hover:text-light"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            ) : (
              <p className="italic text-text-muted">No subjects chosen yet.</p>
            )}
          </div>
        </div>

        {courses.length > 0 && (
          <>
            <HrWrapper name="Courses" />
            <div className="grid gap-6 sm:grid-cols-2">
              {courses.map((course) => (
                <Link
                  key={course._id}
                  to={`/dashboard/${course.slug}`}
                  className="group rounded-[4px] border-2 border-border bg-surface p-5 shadow-[4px_4px_0_var(--color-border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-border)]"
                >
                  <h5 className="m-0 font-heading text-text-primary group-hover:underline">
                    {course.title}
                  </h5>
                  <div className="mt-2 flex flex-wrap items-center gap-2 font-heading text-[10px] uppercase tracking-widest text-text-secondary">
                    <span>{course.category}</span>
                    <span>·</span>
                    <span>{course.level}</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </motion.div>

      <AnimatePresence>
        {previewImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              aria-label="Close preview"
              className="absolute right-5 top-5 z-10 rounded-[4px] border-2 border-light/40 p-2 text-light transition-colors hover:bg-black/40"
            >
              <XIcon size={28} weight="bold" />
            </button>
            <motion.img
              src={previewImage}
              alt="Full screen preview"
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full rounded-[4px] object-contain shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PublicProfilePage;
