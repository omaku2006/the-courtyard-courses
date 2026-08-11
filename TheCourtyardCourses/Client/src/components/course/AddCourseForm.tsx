import { useFieldArray, useForm } from 'react-hook-form';
import HrWrapper from '../ui/HrWrapper';
import { ArrowLineUpIcon, PlusIcon } from '@phosphor-icons/react';
import { useEffect, useMemo, useState } from 'react';
import ChapterForm from '../ui/ChapterForm';
import { createCourse } from '../../features/course/useCourse';

export interface ChapterFormData {
  title: string;
  description?: string;
  duration?: string;
  typeOfChapter: 'video' | 'resource';
  videoSource: 'url' | 'file';
  videoUrl?: string;
  video?: FileList | string;
  resources?: FileList;
  demo: boolean;
}

interface CourseFormData {
  title: string;
  description: string;
  thumbnail: FileList;
  coverImage: FileList;
  category: string;
  tags: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  priceType: 'free' | 'paid';
  price: number;
  badges: string;
  chapters: ChapterFormData[];
}

const AddCourseForm = () => {
  const { register, watch, setValue, handleSubmit, formState, control } = useForm<CourseFormData>({
    defaultValues: { priceType: 'free', price: 0, chapters: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'chapters' });

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggleChapter = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const handleRemoveChapter = (index: number) => {
    remove(index);
    setExpandedIndex((prev) => {
      if (prev === null) return prev;
      if (prev === index) return null;
      return prev > index ? prev - 1 : prev;
    });
  };

  const handleAddChapter = () => {
    append({ title: '', typeOfChapter: 'video', videoSource: 'url', demo: false });
    setExpandedIndex(fields.length);
  };

  const thumbnail = watch('thumbnail');
  const coverImage = watch('coverImage');
  const title = watch('title');
  const priceType = watch('priceType');

  const { mutate, isPending } = createCourse();

  useEffect(() => {
    if (priceType === 'free') {
      setValue('price', 0);
    }
  }, [priceType, setValue]);

  const onSubmit = (data: CourseFormData) => {
    const fd = new FormData();

    if (data.thumbnail?.[0]) fd.append('thumbnail', data.thumbnail[0]);
    if (data.coverImage?.[0]) fd.append('coverImage', data.coverImage[0]);

    fd.append('title', data.title);
    fd.append('description', data.description);
    fd.append('category', data.category);
    fd.append('tags', data.tags);
    fd.append('level', data.level);
    fd.append('language', data.language);
    fd.append('price', String(data.price));
    fd.append('badges', data.badges);

    data.chapters.forEach((chapter, index) => {
      fd.append(`chapters[${index}][title]`, chapter.title);
      if (chapter.description) fd.append(`chapters[${index}][description]`, chapter.description);
      if (chapter.duration) fd.append(`chapters[${index}][duration]`, chapter.duration);
      fd.append(`chapters[${index}][typeOfChapter]`, chapter.typeOfChapter);
      fd.append(`chapters[${index}][demo]`, String(chapter.demo));
      fd.append(`chapters[${index}][order]`, String(index));

      if (chapter.videoSource === 'url') {
        if (chapter.videoUrl) fd.append(`chapters[${index}][videoUrl]`, chapter.videoUrl);
      } else if (chapter.video?.[0]) {
        fd.append(`chapters[${index}][video]`, chapter.video[0]);
      }

      Array.from(chapter.resources ?? []).forEach((file) => {
        fd.append(`chapters[${index}][resources]`, file);
      });
    });

    mutate(fd);
  };

  const thumbnailPreview = useMemo(
    () => (thumbnail?.[0] ? URL.createObjectURL(thumbnail[0]) : null),
    [thumbnail]
  );
  const coverImagePreview = useMemo(
    () => (coverImage?.[0] ? URL.createObjectURL(coverImage[0]) : null),
    [coverImage]
  );
  useEffect(() => {
    return () => {
      [thumbnailPreview, coverImagePreview].forEach((preview) => {
        if (preview) URL.revokeObjectURL(preview);
      });
    };
  }, [thumbnailPreview, coverImagePreview]);

  return (
    <div className="formWrapper flex flex-col p-4 w-full max-w-7xl mx-auto">
      <div className="heading flex flex-wrap gap-x-5 gap-y-1 mt-1.5 items-center">
        <h3>Add New Course -</h3>
        <h3 className={`italic truncate min-w-0 flex-1 mr-9 ${!title && 'opacity-50'}`}>
          {title ? title : 'Title'}
        </h3>
      </div>
      <HrWrapper name="⚜" />

      <form
        className="grid grid-cols-1 min-[600px]:grid-cols-2 gap-5 py-2 relative items-start"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* LEFT PART: Course Details */}
        <div className="leftPart pr-2 pb-4 lg:pb-0">
          <h4>Course Details</h4>
          <hr className="mb-2 border-accent" />

          <div className="inputContainer flex flex-col mb-2">
            <label htmlFor="courseTitle">Title</label>
            <input
              id="courseTitle"
              type="text"
              className="inputField"
              placeholder="Enter your Title!"
              {...register('title', { required: 'Please! Enter title!' })}
            />
          </div>

          <div className="inputContainer flex flex-col mb-2">
            <label htmlFor="courseDescription">Description</label>
            <textarea
              id="courseDescription"
              className="inputField h-32 resize-none" /* h-30 -> h-32 */
              placeholder="Enter your Description!"
              {...register('description', { required: 'Please! Enter Description!' })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="inputContainer flex flex-col mb-2">
              <label htmlFor="courseThumbnail">Thumbnail</label>
              <label
                htmlFor="courseThumbnail"
                className="border-2 border-accent h-32 mt-2 flex flex-col items-center justify-center overflow-hidden cursor-pointer"
              >
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    className="h-full w-full object-cover"
                    alt="Thumbnail"
                  />
                ) : (
                  <div className="flex flex-col items-center text-center p-2">
                    <ArrowLineUpIcon />
                    <span className="text-xs mt-1">Upload Thumbnail</span>
                  </div>
                )}
              </label>
              <input
                id="courseThumbnail"
                hidden
                type="file"
                className="inputField"
                {...register('thumbnail')}
              />
            </div>

            <div className="inputContainer flex flex-col mb-2">
              <label htmlFor="courseCoverImage">Cover Image</label>
              <label
                htmlFor="courseCoverImage"
                className="border-2 border-accent h-32 mt-2 flex flex-col items-center justify-center overflow-hidden cursor-pointer"
              >
                {coverImagePreview ? (
                  <img
                    src={coverImagePreview}
                    className="h-full w-full object-cover"
                    alt="Cover Image"
                  />
                ) : (
                  <div className="flex flex-col items-center text-center p-2">
                    <ArrowLineUpIcon />
                    <span className="text-xs mt-1">Upload Cover Image</span>
                  </div>
                )}
              </label>
              <input
                id="courseCoverImage"
                hidden
                type="file"
                className="inputField"
                {...register('coverImage')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="inputContainer flex flex-col mb-2">
              <label htmlFor="courseCategory">Category</label>
              <input
                id="courseCategory"
                type="text"
                className="inputField"
                placeholder="History..."
                {...register('category', { required: 'Please! Enter Category!' })}
              />
            </div>
            <div className="inputContainer flex flex-col mb-2">
              <label htmlFor="courseLanguage">Language</label>
              <input
                id="courseLanguage"
                type="text"
                className="inputField"
                placeholder="e.g. English"
                {...register('language', { required: 'Please! Enter Language!' })}
              />
            </div>
          </div>

          <div className="inputContainer flex flex-col mb-2">
            <label htmlFor="courseTags">Tags</label>
            <input
              id="courseTags"
              type="text"
              className="inputField"
              placeholder="History, India Colonise, 1755"
              {...register('tags', { required: 'Please! Enter Tags!' })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="inputContainer flex flex-col mb-2">
              <label htmlFor="courseLevel">Level</label>
              <select
                id="courseLevel"
                className="h-12 border-2 border-accent px-4 mt-2 bg-transparent" /* h-15 -> h-12 */
                {...register('level')}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="inputContainer flex flex-col mb-2">
              <label htmlFor="coursePrice">Price</label>
              <div className="flex gap-3 items-start mt-2">
                <select
                  id="coursePriceType"
                  className="h-12 border-2 border-accent px-2 bg-transparent" /* h-15 -> h-12 */
                  {...register('priceType')}
                >
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
                <input
                  id="coursePrice"
                  type="number"
                  min={0}
                  disabled={priceType === 'free'}
                  className="inputField no-margin w-full h-12 disabled:opacity-50"
                  placeholder="e.g. 999"
                  {...register('price', {
                    valueAsNumber: true,
                    validate: (value) => (priceType === 'paid' ? value > 0 : true),
                  })}
                />
              </div>
            </div>
          </div>

          <div className="inputContainer flex flex-col mb-2">
            <label htmlFor="courseBadges">Badges for Scholar</label>
            <input
              id="courseBadges"
              type="text"
              className="inputField"
              placeholder="🏰History Master, 📖 Knowledge Gainer"
              {...register('badges')}
            />
          </div>
        </div>

        {/* RIGHT PART: Chapter Details */}
        <div className="rightPart pr-2 pb-4 lg:pb-0">
          <h4>Chapter Details</h4>
          <hr className="mb-2 border-accent" />
          {fields.map((field, index) => (
            <ChapterForm
              key={field.id}
              control={control}
              register={register}
              setValue={setValue}
              errors={formState.errors}
              index={index}
              isExpanded={expandedIndex === index}
              onToggle={() => handleToggleChapter(index)}
              onRemove={() => handleRemoveChapter(index)}
            />
          ))}
          <button
            type="button"
            onClick={handleAddChapter}
            className="btnSecondary flex items-center gap-3 w-full justify-center mt-4"
          >
            <PlusIcon weight="fill" className="text-2xl" /> Add Chapter
          </button>
        </div>

        {/* SUBMIT BUTTON: Mobile col-span-1, Desktop col-span-2 */}
        <button
          type="submit"
          disabled={isPending}
          className="btnPrimary col-span-1 min-[600px]:col-span-2 mt-3 w-full justify-center disabled:opacity-60"
        >
          {isPending ? 'Publishing...' : 'Submit Course'}
        </button>
      </form>
    </div>
  );
};

export default AddCourseForm;
