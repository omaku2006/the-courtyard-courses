import { CaretRightIcon, TrashIcon } from '@phosphor-icons/react';
import type { ChangeEvent } from 'react';
import {
  Controller,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from 'react-hook-form';
import ToggleButton from './ToggleButton';
import type { CourseFormData } from '../course/AddCourseForm';

interface ChapterFormProps {
  control: Control<CourseFormData>;
  register: UseFormRegister<CourseFormData>;
  setValue: UseFormSetValue<CourseFormData>;
  errors: FieldErrors<CourseFormData>;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  hasExistingResources?: boolean;
  existingResources?: { url?: string | null; publicId?: string | null }[];
  removedResourceKeys?: string[];
  onToggleResource?: (key: string) => void;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

const ChapterForm = ({
  control,
  register,
  setValue,
  errors,
  index,
  isExpanded,
  onToggle,
  onRemove,
  hasExistingResources = false,
  existingResources = [],
  removedResourceKeys = [],
  onToggleResource,
}: ChapterFormProps) => {
  const videoSource = useWatch({ control, name: `chapters.${index}.videoSource` });
  const title = useWatch({ control, name: `chapters.${index}.title` });
  const typeOfChapter = useWatch({ control, name: `chapters.${index}.typeOfChapter` });

  const titleError = errors?.chapters?.[index]?.title;
  const videoUrlError = errors?.chapters?.[index]?.videoUrl;
  const videoError = errors?.chapters?.[index]?.video;
  const resourcesError = errors?.chapters?.[index]?.resources;

  const videoFileRegister = register(`chapters.${index}.video`, {
    validate: (value) =>
      typeOfChapter === 'video' && videoSource === 'file'
        ? value && value.length
          ? true
          : 'Please! Select video file!'
        : true,
  });

  const handleVideoFile = (event: ChangeEvent<HTMLInputElement>) => {
    videoFileRegister.onChange(event);
    const file = event.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      if (Number.isFinite(video.duration)) {
        setValue(`chapters.${index}.duration`, formatDuration(video.duration));
      }
      URL.revokeObjectURL(objectUrl);
    };
    video.onerror = () => URL.revokeObjectURL(objectUrl);
    video.src = objectUrl;
  };

  return (
    <div
      className={`chapterForm relative border-2 border-accent p-3 mb-3 ${
        isExpanded ? 'expanded' : ''
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 pr-10 text-left "
      >
        <CaretRightIcon
          size={18}
          weight="bold"
          className={`text-accent transition-transform duration-300 ${
            isExpanded ? 'rotate-90' : ''
          }`}
        />
        <h6 className="font-heading min-w-0 flex-1 truncate">
          Chapter {index + 1} - {title ? title : 'Title'}
        </h6>
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove chapter"
        className="absolute right-2 top-2 p-2 text-error transition-colors hover:bg-error hover:text-light"
      >
        <TrashIcon size={18} weight="bold" />
      </button>

      <div className="chapterContent">
        <div>
          <hr className="chapterHr border-accent" />
          <div className="inputContainer flex flex-col mb-2">
            <label htmlFor={`chapter-${index}-title`}>Title</label>
            <input
              id={`chapter-${index}-title`}
              type="text"
              className="inputField w-full"
              placeholder="Enter chapter title!"
              {...register(`chapters.${index}.title`, { required: 'Please! Enter chapter title!' })}
            />
            {titleError && <span className="fieldError">{titleError.message}</span>}
          </div>

          <div className="inputContainer flex flex-col mb-2">
            <label htmlFor={`chapter-${index}-description`}>Description</label>
            <textarea
              id={`chapter-${index}-description`}
              className="inputField h-24 w-full resize-none"
              placeholder="Enter chapter description!"
              {...register(`chapters.${index}.description`)}
            />
          </div>

          <div className="inputContainer flex flex-col mb-2">
            <label htmlFor={`chapter-${index}-type`}>Type</label>
            <select
              id={`chapter-${index}-type`}
              className="inputField w-full"
              {...register(`chapters.${index}.typeOfChapter`)}
            >
              <option value="video">Video</option>
              <option value="resource">Resource</option>
            </select>
          </div>

          <div className="inputContainer flex flex-col mb-2">
            <label htmlFor={`chapter-${index}-videoSource`}>Video</label>
            <select
              id={`chapter-${index}-videoSource`}
              className="inputField w-full"
              {...register(`chapters.${index}.videoSource`)}
            >
              <option value="url">URL Link</option>
              <option value="file">File Upload</option>
            </select>
          </div>

          {videoSource === 'url' ? (
            <div className="inputContainer flex flex-col mb-2">
              <label htmlFor={`chapter-${index}-videoUrl`}>Video URL</label>
              <input
                id={`chapter-${index}-videoUrl`}
                type="url"
                className="inputField w-full"
                placeholder="Paste YouTube / Google Drive link!"
                {...register(`chapters.${index}.videoUrl`, {
                  validate: (value) =>
                    typeOfChapter === 'video' && videoSource === 'url' && !value
                      ? 'Please! Enter video URL!'
                      : true,
                })}
              />
              {videoUrlError && <span className="fieldError">{videoUrlError.message}</span>}
            </div>
          ) : (
            <div className="inputContainer flex flex-col mb-2">
              <label htmlFor={`chapter-${index}-video`}>Video File</label>
              <input
                id={`chapter-${index}-video`}
                type="file"
                accept="video/*"
                className="inputField w-full"
                {...videoFileRegister}
                onChange={handleVideoFile}
              />
              {videoError && <span className="fieldError">{videoError.message}</span>}
            </div>
          )}

          <div className="inputContainer flex flex-col mb-2">
            <label htmlFor={`chapter-${index}-resources`}>Resources</label>
            <input
              id={`chapter-${index}-resources`}
              type="file"
              multiple
              className="inputField w-full"
              {...register(`chapters.${index}.resources`, {
                validate: (value) =>
                  typeOfChapter === 'resource' &&
                  !hasExistingResources &&
                  !(value && value.length)
                    ? 'Please! Add at least one resource file!'
                    : true,
              })}
            />
            {resourcesError && (
              <span className="fieldError">{resourcesError.message}</span>
            )}
          </div>

          {existingResources.length > 0 && (
            <div className="flex flex-col gap-1 mb-2">
              <span className="text-xs text-text-muted">Uploaded resources:</span>
              {existingResources.map((r) => {
                const key = r.publicId ?? r.url ?? '';
                const removed = removedResourceKeys.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onToggleResource?.(key)}
                    className={`flex items-center justify-between gap-2 rounded-[2px] border px-2 py-1 text-left text-xs ${
                      removed
                        ? 'border-error/50 bg-error/10 text-error line-through'
                        : 'border-border hover:border-error'
                    }`}
                  >
                    <span className="truncate">{key.split('/').pop()}</span>
                    <span className="shrink-0">
                      {removed ? 'Undo' : 'Remove'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name={`chapters.${index}.demo`}
              render={({ field }) => (
                <ToggleButton
                  id={`chapter-${index}-demo`}
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <label htmlFor={`chapter-${index}-demo`}>Demo</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterForm;
