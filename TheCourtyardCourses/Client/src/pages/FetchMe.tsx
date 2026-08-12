import {
  AtIcon,
  BookOpenIcon,
  ChalkboardTeacherIcon,
  CheckIcon,
  EnvelopeIcon,
  FeatherIcon,
  GraduationCapIcon,
  ImageIcon,
  MedalIcon,
  PencilSimpleIcon,
  SignOutIcon,
  SparkleIcon,
  XIcon,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import HrWrapper from '../components/ui/HrWrapper';
import { useFetchMyProfile, useLogout, useUpdateProfile } from '../features/auth/useAuth';
import { imageUrl } from '../utils/imageUrl';
import LoadingPage from './system/LoadingPage';
import ServerErrorPage from './system/ServerErrorPage';

interface EditProfileForm {
  name: string;
  description: string;
  occupation: string;
  experience: string;
  subjects: string;
  avatarImage?: FileList;
  headerImage?: FileList;
}

const getInitials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('') || '?';

const FetchMe = () => {
  const { data, isError, isLoading } = useFetchMyProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewImage(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EditProfileForm>({
    defaultValues: {
      name: '',
      description: '',
      occupation: '',
      experience: '',
      subjects: '',
    },
  });

  if (isLoading) return <LoadingPage />;
  if (isError) return <ServerErrorPage />;

  const isTeacher = data.user.role === 'teacher';
  const roleLabel = isTeacher ? 'Tutor' : 'Scholar';
  const RoleIcon = isTeacher ? ChalkboardTeacherIcon : GraduationCapIcon;
  const subjects: string[] = Array.isArray(data.user.subjects)
    ? data.user.subjects
    : data.user.subjects.length > 0
      ? [data.user.subjects]
      : [];
  const badges: string[] = Array.isArray(data.user.badges) ? data.user.badges : [];
  const avatarSrc = imageUrl(data.user.avatarImage);
  const headerSrc = imageUrl(data.user.headerImage);

  const avatarFile = watch('avatarImage');
  const headerFile = watch('headerImage');
  const avatarPreview = avatarFile?.[0] ? URL.createObjectURL(avatarFile[0]) : null;
  const headerPreview = headerFile?.[0] ? URL.createObjectURL(headerFile[0]) : null;

  const userLogout = useLogout();

  const resetFromProfile = () => {
    reset({
      name: data.user.name ?? '',
      description: data.user.description ?? '',
      occupation: data.user.occupation ?? '',
      experience: data.user.experience != null ? String(data.user.experience) : '',
      subjects: subjects.join(', '),
    });
  };

  const startEditing = () => {
    resetFromProfile();
    setIsEditing(true);
  };

  const cancelEditing = () => {
    resetFromProfile();
    setIsEditing(false);
  };

  const onSubmit: SubmitHandler<EditProfileForm> = (formData) => {
    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('description', formData.description);
    if (isTeacher) {
      fd.append('occupation', formData.occupation);
      fd.append('experience', formData.experience);
    }
    formData.subjects
      .split(',')
      .map((sub) => sub.trim())
      .filter(Boolean)
      .forEach((sub) => fd.append('subjects', sub));

    if (formData.avatarImage?.[0]) fd.append('avatarImage', formData.avatarImage[0]);
    if (formData.headerImage?.[0]) fd.append('headerImage', formData.headerImage[0]);

    updateProfile(
      { username: data.user.username, formData: fd },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-full max-w-4xl flex-col gap-6"
    >
      <div className="overflow-hidden rounded-[4px] border-2 border-accent bg-surface shadow-[0_16px_40px_-16px_rgba(46,57,69,0.45)]">
        <div className="relative h-52 overflow-hidden bg-gradient-to-br from-highlight via-highlight to-accent-hover md:h-64">
          {headerPreview || headerSrc ? (
            <img
              src={headerPreview ?? headerSrc}
              alt={`${data.user.name} banner`}
              onClick={() =>
                !isEditing &&
                (headerPreview ?? headerSrc) &&
                setPreviewImage(headerPreview ?? headerSrc)
              }
              className={`h-full w-full object-cover ${isEditing ? '' : 'cursor-zoom-in'}`}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="italic text-light">{data.user.name}</h2>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface via-surface/15 to-transparent" />

          {isEditing && (
            <label
              htmlFor="headerImage"
              className="absolute right-4 top-4 z-10 inline-flex cursor-pointer items-center gap-2 rounded-[2px] border-2 border-light/40 bg-black/40 px-3 py-1.5 font-heading text-xs uppercase tracking-wider text-light backdrop-blur-sm transition-colors hover:bg-black/60"
            >
              <ImageIcon size={16} weight="bold" />
              Change Banner
            </label>
          )}
        </div>
        <input
          type="file"
          id="headerImage"
          accept="image/png, image/jpeg"
          className="hidden"
          {...register('headerImage')}
        />

        <div className="relative px-6 pb-8 pt-0 md:px-10">
          <div className="flex flex-col items-center gap-5 text-center md:flex-row md:items-end md:gap-6 md:-mt-16 md:text-left">
            <div className="avatarWrapper -mt-16 shrink-0 md:mt-0">
              <div className="relative">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[4px] border-4 border-surface bg-accent shadow-lg md:h-32 md:w-32">
                  {avatarPreview || avatarSrc ? (
                    <img
                      src={avatarPreview ?? avatarSrc}
                      alt={data.user.name}
                      onClick={() =>
                        !isEditing &&
                        (avatarPreview ?? avatarSrc) &&
                        setPreviewImage(avatarPreview ?? avatarSrc)
                      }
                      className={`h-full w-full object-cover ${isEditing ? '' : 'cursor-zoom-in'}`}
                    />
                  ) : (
                    <h3 className="text-light">{getInitials(data.user.name)}</h3>
                  )}
                </div>
                {isEditing && (
                  <label
                    htmlFor="avatarImage"
                    className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center rounded-[4px] bg-black/40 text-light opacity-0 transition-opacity hover:opacity-100"
                  >
                    <ImageIcon size={26} weight="bold" />
                  </label>
                )}
              </div>
            </div>
            <input
              type="file"
              id="avatarImage"
              accept="image/png, image/jpeg"
              className="hidden"
              {...register('avatarImage')}
            />

            <div className="details flex flex-1 flex-col items-center gap-1 md:items-start">
              {isEditing ? (
                <div className="w-full">
                  <input
                    type="text"
                    id="name"
                    className="inputField w-full text-center font-heading md:text-left"
                    {...register('name', { required: 'Pray, tell us your name.' })}
                  />
                  {errors.name && (
                    <span className="fieldError text-center md:text-left">
                      {errors.name.message}
                    </span>
                  )}
                </div>
              ) : (
                <h3 className="mb-1">{data.user.name}</h3>
              )}
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-text-muted italic md:justify-start">
                <span className="flex items-center gap-1.5">
                  <AtIcon size={16} weight="bold" />
                  {data.user.username}
                </span>
                <span className="flex items-center gap-1.5">
                  <EnvelopeIcon size={16} weight="bold" />
                  {data.user.email}
                </span>
              </div>
            </div>

            <div className="roleBadge shrink-0 md:ml-auto md:self-end">
              <span className="inline-flex items-center gap-2 rounded-[2px] border-2 border-accent bg-bg px-4 py-1.5">
                <RoleIcon size={18} weight="fill" className="text-accent-hover" />
                <span className="font-heading text-sm uppercase tracking-wider text-text-primary">
                  {roleLabel}
                </span>
              </span>
            </div>
          </div>

          {!isEditing && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 border-t border-accent/40 pt-5 md:justify-start">
              {isTeacher && (
                <span className="flex items-center gap-2.5 text-text-secondary">
                  <SparkleIcon size={20} weight="fill" className="text-accent-hover" />
                  <strong>{data.user.experience ?? 0}</strong> Years of Teaching
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
          )}
        </div>
      </div>

      <HrWrapper name="⚜" />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[4px] border-2 border-accent bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent-hover h-[60vh] overflow-y-scroll">
          <div className="mb-4 flex items-center gap-2">
            <FeatherIcon size={20} weight="fill" className="text-accent-hover" />
            <h4 className="m-0 underline underline-offset-4">Description</h4>
          </div>
          {isEditing ? (
            <textarea
              id="description"
              className="inputField h-full w-full resize-none"
              placeholder="Inscribe a few words about thyself..."
              {...register('description')}
            />
          ) : (
            <p className="other italic text-text-secondary">
              {data.user.description || 'No description inscribed yet.'}
            </p>
          )}
        </div>

        <div className="rounded-[4px] border-2 border-accent bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent-hover h-[60vh] overflow-y-scroll">
          <div className="mb-4 flex items-center gap-2">
            <RoleIcon size={20} weight="fill" className="text-accent-hover" />
            <h4 className="m-0 underline underline-offset-4">
              {isTeacher ? 'Occupation' : 'Favourite Subjects'}
            </h4>
          </div>
          {isEditing && isTeacher && (
            <>
              <label htmlFor="occupation" className="text-sm italic text-text-muted">
                Profession
              </label>
              <input
                type="text"
                id="occupation"
                className="inputField w-full"
                placeholder="Enter your vocation"
                {...register('occupation')}
              />
              <label htmlFor="experience" className="text-sm italic text-text-muted">
                Years of Practice
              </label>
              <input
                type="number"
                id="experience"
                className="inputField w-full"
                placeholder="Enter your tenure"
                {...register('experience')}
              />
            </>
          )}
          {isEditing ? (
            <>
              <input
                type="text"
                id="subjects"
                className="inputField w-full"
                placeholder="Physics, Mathematics, Literature"
                {...register('subjects')}
              />
              <p className="other mt-1 text-sm italic text-text-muted">
                Separate each discipline with a comma.
              </p>
            </>
          ) : isTeacher && data.user.occupation ? (
            <p className="other mb-4 text-text-secondary">{data.user.occupation}</p>
          ) : null}
          {!isEditing && subjects.length > 0 && (
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
          )}
          {!isEditing && subjects.length === 0 && (
            <p className="other italic text-text-muted">No subjects chosen yet.</p>
          )}
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-4 sm:flex-row">
        {isEditing ? (
          <>
            <button
              type="submit"
              disabled={isPending}
              className="btnPrimary inline-flex w-full items-center justify-center gap-2 disabled:pointer-events-none disabled:opacity-60"
            >
              <CheckIcon size={18} weight="bold" />
              {isPending ? 'Inscribing...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={cancelEditing}
              className="btnSecondary inline-flex w-full items-center justify-center gap-2"
            >
              <XIcon size={18} weight="bold" />
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={startEditing}
            className="btnPrimary inline-flex w-full items-center justify-center gap-2"
          >
            <PencilSimpleIcon size={18} weight="bold" />
            Update Profile
          </button>
        )}
        <button
          type="button"
          className="btnThird inline-flex w-full items-center justify-center gap-2"
          onClick={userLogout}
        >
          <SignOutIcon size={18} weight="bold" />
          Logout
        </button>
      </div>

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
    </motion.form>
  );
};

export default FetchMe;
