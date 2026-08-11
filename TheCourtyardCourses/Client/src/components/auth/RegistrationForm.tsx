import { ArrowLeftIcon, ArrowLineUpIcon } from '@phosphor-icons/react';
import { useEffect, useMemo, type RefObject } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useRegister } from '../../features/auth/useAuth';

interface RegisterFormData {
  name: string;
  email: string;
  username: string;
  description?: string;
  avatarImage?: FileList;
  headerImage?: FileList;
  password: string;
  checkPassword: string;
  role: 'student' | 'teacher';
  occupation?: string;
  experience?: string;
  subject?: string;
}

const RegistrationForm = ({
  setLogin,
  formContainer,
}: {
  setLogin: (value: boolean) => void;
  formContainer: RefObject<HTMLDivElement | null>;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      role: 'student',
    },
  });
  // Image files ne watch kariye
  const avatarFile = watch('avatarImage');
  const headerFile = watch('headerImage');

  // Preview URLs (only created when the file changes, revoked on cleanup)
  const avatarPreview = useMemo(
    () => (avatarFile?.[0] ? URL.createObjectURL(avatarFile[0]) : null),
    [avatarFile]
  );
  const headerPreview = useMemo(
    () => (headerFile?.[0] ? URL.createObjectURL(headerFile[0]) : null),
    [headerFile]
  );

  useEffect(() => {
    return () => {
      [avatarPreview, headerPreview].forEach((p) => p && URL.revokeObjectURL(p));
    };
  }, [avatarPreview, headerPreview]);

  // Submit Funtions
  const { mutate: registerMutate, isPending } = useRegister();
  const onSubmit: SubmitHandler<RegisterFormData> = (data) => {
    const fd = new FormData();
    fd.append('name', data.name);
    fd.append('email', data.email);
    fd.append('username', data.username);
    fd.append('password', data.password);
    fd.append('role', data.role);
    if (data.occupation) fd.append('occupation', data.occupation);
    if (data.experience) fd.append('experience', data.experience);
    if (data.description) fd.append('description', data.description);
    (data.subject ?? '')
      .split(',')
      .map((sub) => sub.trim())
      .filter(Boolean)
      .forEach((sub) => fd.append('subjects', sub));

    if (data.avatarImage?.[0]) fd.append('avatarImage', data.avatarImage[0]);
    if (data.headerImage?.[0]) fd.append('headerImage', data.headerImage[0]);

    registerMutate(fd);
  };

  const selectedRole = watch('role');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      {/* Name */}
      <div className="inputContainer">
        <label htmlFor="name">Given Name</label>
        <input
          className="inputField w-full"
          type="text"
          id="name"
          placeholder="Enter your full name"
          {...register('name', { required: 'Pray, tell us your name.' })}
        />
        {errors.name && <span className="fieldError">{errors.name?.message}</span>}
      </div>

      {/* Username */}
      <div className="inputContainer">
        <label htmlFor="username">Unique Moniker</label>
        <input
          className="inputField w-full"
          type="text"
          id="username"
          placeholder="Choose a scholar ID"
          {...register('username', {
            required: 'A moniker is required for entry.',
            pattern: {
              value: /^[a-z0-9_]+$/,
              message: 'Lowercase letters, numbers, and underscores only.',
            },
          })}
        />
        {errors.username && (
          <span className="fieldError">{errors.username?.message}</span>
        )}
      </div>

      {/* Email */}
      <div className="inputContainer">
        <label htmlFor="email">Electronic Correspondence</label>
        <input
          className="inputField w-full"
          type="email"
          id="email"
          placeholder="e.g., scholar@courtyard.uk"
          {...register('email', {
            required: 'We require your email.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'That is not a valid electronic correspondence.',
            },
          })}
        />
        {errors.email && <span className="fieldError">{errors.email?.message}</span>}
      </div>

      {/* Password */}
      <div className="inputContainer">
        <label htmlFor="password">Secret Phrase</label>
        <input
          className="inputField w-full"
          type="password"
          id="password"
          placeholder="Guard it with your life"
          {...register('password', {
            required: 'A secret phrase is necessary.',
            minLength: {
              value: 8,
              message: 'Secret Phrase should have length of minimum 8 characters!',
            },
          })} // ❌ Pehla 'email' hatu, ✅ 'password' karyu
        />
        {errors.password && (
          <span className="fieldError">{errors.password?.message}</span>
        )}
      </div>

      <div className="inputContainer">
        <label htmlFor="checkPassword">Secret Phrase Once More</label>
        <input
          className="inputField w-full"
          type="password"
          id="checkPassword"
          placeholder="Repeat it faithfully"
          {...register('checkPassword', {
            required: 'A secret phrase is necessary.',
            minLength: {
              value: 8,
              message: 'Secret Phrase should have length of minimum 8 characters!',
            },
            validate: (value) =>
              value === getValues('password') || 'The secret phrases do not match.',
          })}
        />
        {errors.checkPassword && (
          <span className="fieldError">{errors.checkPassword?.message}</span>
        )}
      </div>

      <div className="inputContainer">
        <label htmlFor="description">Description</label>
        <textarea
          className="inputField w-full h-20 resize-none"
          id="description"
          placeholder="e.g., I'm an ...."
          {...register('description')}
        />
        {errors.description && (
          <span className="fieldError">{errors.description.message}</span>
        )}
      </div>
      {/* Role */}
      <div className="inputContainer">
        <label htmlFor="role">Your Station</label>
        <select
          id="role"
          className="inputField w-full"
          {...register('role')}
        >
          <option value="student">Student</option>
          <option value="teacher">Master (Teacher)</option>
        </select>
      </div>

      {/* Conditional Teacher Fields */}
      {selectedRole === 'teacher' && (
        <>
          <div className="inputContainer">
            <label htmlFor="occupation">Profession (Optional)</label>
            <input
              className="inputField w-full"
              type="text"
              id="occupation"
              placeholder="Enter your vocation"
              {...register('occupation')}
            />
          </div>
          <div className="inputContainer">
            <label htmlFor="experience">Years of Practice (Optional)</label>
            <input
              className="inputField w-full"
              type="text"
              id="experience"
              placeholder="Enter your tenure"
              {...register('experience')}
            />
          </div>
        </>
      )}

      {/* Subject */}
      <div className="inputContainer">
        <label htmlFor="subject">
          {selectedRole === 'teacher'
            ? 'Area of Mastery (Optional)'
            : 'Field of Interest (Optional)'}
        </label>
        <input
          className="inputField w-full"
          type="text"
          id="subject"
          placeholder="Enter your discipline"
          {...register('subject')}
        />
      </div>

      {/* File Uploads */}
      {/* --- IMAGE UPLOADS WITH PREVIEW --- */}
      <div className="flex gap-4 mb-4">
        {/* 1. AVATAR (Square) */}
        <div className="flex flex-col items-center">
          <label htmlFor="avatar" className="cursor-pointer">
            <div className="w-24 h-24 border-2 border-border bg-card flex items-center justify-center overflow-hidden relative group hover:border-primary transition-colors">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Visage Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-text opacity-60 group-hover:opacity-100 p-2 text-center">
                  <ArrowLineUpIcon size={20} weight="bold" />
                  <span className="text-[10px] mt-1 font-heading">Visage</span>
                </div>
              )}
            </div>
          </label>
          {/* Hidden Input */}
          <input
            type="file"
            id="avatar"
            accept="image/png, image/jpeg"
            className="hidden"
            {...register('avatarImage')}
          />
        </div>

        {/* 2. HEADER (Wide/Remaining space) */}
        <div className="flex-1 flex flex-col items-center">
          <label htmlFor="header" className="cursor-pointer w-full">
            <div className="w-full h-24 border-2 border-border bg-card flex items-center justify-center overflow-hidden relative group hover:border-primary transition-colors">
              {headerPreview ? (
                <img
                  src={headerPreview}
                  alt="Crest Banner Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-text opacity-60 group-hover:opacity-100 p-2 text-center">
                  <ArrowLineUpIcon size={20} weight="bold" />
                  <span className="text-[10px] mt-1 font-heading">Crest Banner</span>
                </div>
              )}
            </div>
          </label>
          {/* Hidden Input */}
          <input
            type="file"
            id="header"
            accept="image/png, image/jpeg"
            className="hidden"
            {...register('headerImage')}
          />
        </div>
      </div>

      <button type="submit" className="btnThird w-full mt-4">
        {isPending ? 'Securing Your Place...' : 'Join the Courtyard'}
      </button>

      <div className="switcherContainer my-3 flex flex-col items-center justify-center gap-1">
        <span className="italic text-text-secondary">Returning to the Courtyard?</span>
        <span
          className="relative inline-flex items-center gap-2 italic group cursor-pointer"
          onClick={() => {
            formContainer.current?.scrollTo({ top: 0, behavior: 'instant' });
            setLogin(true);
          }}
        >
          <ArrowLeftIcon
            className="group-hover:-translate-x-1.5 duration-300"
            weight="bold"
            size={16}
          />
          Enter the Courtyard
          <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-text-primary transition-all duration-300 group-hover:w-full"></span>
        </span>
      </div>
    </form>
  );
};

export default RegistrationForm;
