import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import type { Course } from '../../types/FetchDataTypes';
import { useMyCourses } from '../../features/course/useCourse';
import { useCreateCommunity } from '../../features/community/useCommunity';
import { useRef, useState, useEffect, useCallback } from 'react';
import { CheckIcon, ImageIcon, SpinnerGapIcon, XIcon } from '@phosphor-icons/react';
import ToggleButton from '../ui/ToggleButton';

interface CommunityFormValues {
  name: string;
  description: string;
  isPrivate: boolean;
  canEveryOneMessage: boolean;
}

interface CommunityFormProps {
  onCreated?: () => void;
}

const CommunityForm = ({ onCreated }: CommunityFormProps) => {
  const { data } = useMyCourses();
  const createCommunity = useCreateCommunity();

  const courses: Course[] = data?.pages.flatMap((p) => p.courses) ?? [];

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<CommunityFormValues>({
    defaultValues: {
      name: '',
      description: '',
      isPrivate: false,
      canEveryOneMessage: false,
    },
  });

  const [search, setSearch] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [headerFile, setHeaderFile] = useState<File | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [headerPreview, setHeaderPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!thumbnailFile) { setThumbPreview(null); return; }
    const url = URL.createObjectURL(thumbnailFile);
    setThumbPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [thumbnailFile]);

  useEffect(() => {
    if (!headerFile) { setHeaderPreview(null); return; }
    const url = URL.createObjectURL(headerFile);
    setHeaderPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [headerFile]);

  const nameValue = watch('name');
  const descriptionValue = watch('description');

  const filtered = search.trim()
    ? courses.filter(
        (c) =>
          c.title.toLowerCase().includes(search.toLowerCase()) &&
          !selectedCourses.some((s) => s._id === c._id)
      )
    : [];

  const closeSuggestions = useCallback(() => setSuggestionsOpen(false), []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        closeSuggestions();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [closeSuggestions]);

  const selectCourse = (course: Course) => {
    setSelectedCourses((prev) => [...prev, course]);
    setSearch('');
    setSuggestionsOpen(false);
  };

  const removeCourse = (id: string) => {
    setSelectedCourses((prev) => prev.filter((c) => c._id !== id));
    inputRef.current?.focus();
  };

  const onSubmit: SubmitHandler<CommunityFormValues> = (formData) => {
    const fd = new FormData();
    fd.append('name', formData.name);
    if (formData.description) fd.append('description', formData.description);
    fd.append('isPrivate', String(formData.isPrivate));
    fd.append('canEveryOneMessage', String(formData.canEveryOneMessage));
    if (selectedCourses.length > 0) {
      selectedCourses.forEach((c) => fd.append('courses', c._id));
    }
    if (thumbnailFile) fd.append('thumbnail', thumbnailFile);
    if (headerFile) fd.append('headerImage', headerFile);

    createCommunity.mutate(fd, {
      onSuccess: () => {
        reset();
        setSelectedCourses([]);
        setSearch('');
        setThumbnailFile(null);
        setHeaderFile(null);
        onCreated?.();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Banner + Thumbnail row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Thumbnail — fixed square */}
        <div className="flex flex-col gap-1.5">
          <label className="font-heading text-sm text-text">Thumbnail</label>
          <label
            htmlFor="thumbnail"
            className="relative flex h-28 w-28 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-sm border-2 border-dashed border-border bg-bg transition-colors hover:border-accent"
          >
            {thumbnailFile ? (
              <>
                <img
                  src={thumbPreview ?? ''}
                  alt="Thumbnail preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setThumbnailFile(null);
                  }}
                  className="absolute right-1 top-1 z-10 p-1 rounded-sm bg-black/50 text-light hover:bg-black/70 transition-colors"
                >
                  <XIcon size={12} weight="bold" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1 text-text-muted">
                <ImageIcon size={20} weight="bold" />
                <span className="text-[8px] font-heading uppercase tracking-widest">
                  Thumbnail
                </span>
              </div>
            )}
          </label>
          <input
            type="file"
            id="thumbnail"
            accept="image/png, image/jpeg"
            className="hidden"
            onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {/* Banner — fills remaining width */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <label className="font-heading text-sm text-text">Banner Image</label>
          <label
            htmlFor="headerImage"
            className="relative flex h-28 cursor-pointer items-center justify-center overflow-hidden rounded-sm border-2 border-dashed border-border bg-bg transition-colors hover:border-accent"
          >
            {headerFile ? (
              <>
                <img
                  src={headerPreview ?? ''}
                  alt="Banner preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setHeaderFile(null);
                  }}
                  className="absolute right-2 top-2 z-10 p-1.5 rounded-sm bg-black/50 text-light hover:bg-black/70 transition-colors"
                >
                  <XIcon size={14} weight="bold" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1 text-text-muted">
                <ImageIcon size={24} weight="bold" />
                <span className="text-[10px] font-heading uppercase tracking-widest">
                  Choose Banner
                </span>
              </div>
            )}
          </label>
          <input
            type="file"
            id="headerImage"
            accept="image/png, image/jpeg"
            className="hidden"
            onChange={(e) => setHeaderFile(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="communityName" className="font-heading text-sm text-text">
          Community Name <span className="text-error">*</span>
        </label>
        <input
          id="communityName"
          type="text"
          className="inputField w-full"
          placeholder="e.g. The Society of Natural Philosophy"
          {...register('name', {
            required: 'Pray, name your community.',
            minLength: { value: 3, message: 'At least 3 characters required.' },
            maxLength: { value: 50, message: 'Cannot exceed 50 characters.' },
          })}
        />
        <div className="flex justify-between items-center">
          {errors.name && (
            <span className="text-xs text-error italic">{errors.name.message}</span>
          )}
          <span className="ml-auto text-[10px] text-text-muted font-heading">
            {nameValue.length}/50
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="communityDesc" className="font-heading text-sm text-text">
          Description
        </label>
        <textarea
          id="communityDesc"
          className="inputField w-full resize-none h-24"
          placeholder="Inscribe the purpose of this community..."
          {...register('description', {
            maxLength: { value: 500, message: 'Cannot exceed 500 characters.' },
          })}
        />
        <div className="flex justify-between items-center">
          {errors.description && (
            <span className="text-xs text-error italic">{errors.description.message}</span>
          )}
          <span className="ml-auto text-[10px] text-text-muted font-heading">
            {(descriptionValue ?? '').length}/500
          </span>
        </div>
      </div>

      {/* Course Search */}
      <div className="flex flex-col gap-1.5" ref={searchRef}>
        <label htmlFor="communityCourse" className="font-heading text-sm text-text">
          Attach Courses
        </label>

        {selectedCourses.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selectedCourses.map((c) => (
              <div
                key={c._id}
                className="flex items-center gap-1.5 rounded-sm border border-accent bg-bg px-2.5 py-1.5"
              >
                <span className="truncate text-sm text-text font-heading max-w-[180px]">
                  {c.title}
                </span>
                <button
                  type="button"
                  onClick={() => removeCourse(c._id)}
                  className="shrink-0 p-0.5 rounded-sm text-text-muted hover:text-error hover:bg-error/10 transition-colors"
                >
                  <XIcon size={14} weight="bold" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="relative">
          <input
            ref={inputRef}
            id="communityCourse"
            type="text"
            className="inputField w-full"
            placeholder="Search your courses..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSuggestionsOpen(true);
            }}
            onFocus={() => search.trim() && setSuggestionsOpen(true)}
          />
          {suggestionsOpen && search.trim() && (
            <div className="absolute z-30 mt-1 w-full max-h-48 overflow-y-auto rounded-sm border-2 border-border bg-surface shadow-[4px_4px_0_var(--color-border)]">
              {filtered.length === 0 ? (
                <p className="p-3 text-sm text-text-muted italic text-center">
                  No courses found.
                </p>
              ) : (
                filtered.slice(0, 8).map((course) => (
                  <button
                    key={course._id}
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm text-text hover:bg-accent/10 transition-colors flex items-center justify-between gap-2 border-b border-border/50 last:border-b-0"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectCourse(course)}
                  >
                    <span className="truncate">{course.title}</span>
                    <span className="shrink-0 text-[10px] font-heading text-text-muted uppercase">
                      {course.category}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        <p className="text-[10px] text-text-muted italic">
          Search and add multiple courses to this community.
        </p>
      </div>

      {/* Toggles */}
      <div className="flex flex-col gap-3">
        <Controller
          name="isPrivate"
          control={control}
          render={({ field }) => (
            <label className="flex items-center gap-3 cursor-pointer group">
              <ToggleButton
                checked={field.value}
                onChange={field.onChange}
                id="isPrivate"
              />
              <div className="flex flex-col">
                <span className="font-heading text-sm text-text group-hover:text-accent-hover transition-colors">
                  Private Community
                </span>
                <span className="text-[10px] text-text-muted italic">
                  Only invited members may join.
                </span>
              </div>
            </label>
          )}
        />

        <Controller
          name="canEveryOneMessage"
          control={control}
          render={({ field }) => (
            <label className="flex items-center gap-3 cursor-pointer group">
              <ToggleButton
                checked={field.value}
                onChange={field.onChange}
                id="canEveryOneMessage"
              />
              <div className="flex flex-col">
                <span className="font-heading text-sm text-text group-hover:text-accent-hover transition-colors">
                  Open Discussion
                </span>
                <span className="text-[10px] text-text-muted italic">
                  Allow all members to post messages freely.
                </span>
              </div>
            </label>
          )}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={createCommunity.isPending}
        className="btnPrimary inline-flex items-center justify-center gap-2 w-full disabled:pointer-events-none disabled:opacity-60 hover:-translate-y-0.5 transition-transform"
      >
        {createCommunity.isPending ? (
          <>
            <SpinnerGapIcon size={18} weight="bold" className="animate-spin" />
            Establishing...
          </>
        ) : (
          <>
            <CheckIcon size={18} weight="bold" />
            Establish Community
          </>
        )}
      </button>
    </form>
  );
};

export default CommunityForm;
