import type { Course } from '../../types/FetchDataTypes';
import { FilesIcon } from '@phosphor-icons/react';

const toEmbedUrl = (url?: string): string => {
  if (!url) return '';
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

// ✅ Polish: Manuscript/resource chapter mate themed placeholder
const ResourceChapterPlaceholder = ({ isResource }: { isResource: boolean }) => (
  <div className="h-full w-full flex-1 min-h-90 flex flex-col items-center justify-center gap-3 p-6 text-center bg-background">
    <div className="flex h-14 w-14 items-center justify-center rounded-[2px] border-2 border-primary bg-surface">
      <FilesIcon size={28} weight="fill" className="text-primary" />
    </div>
    <h4 className="font-heading text-lg text-text m-0">
      {isResource ? 'A Manuscript, Not a Moving Picture' : 'The Moving Picture Awaits'}
    </h4>
    <p className="m-0 max-w-md font-body text-sm text-text-secondary italic leading-relaxed">
      {isResource ? (
        <>
          This chapter is a written manuscript rather than a video. Pray, direct your gaze to the{' '}
          <span className="font-heading not-italic text-primary">Chapter Details</span> box below to
          peruse its attached resources.
        </>
      ) : (
        'No video has been attached to this chapter as of yet. Pray, check the Chapter Details below.'
      )}
    </p>
  </div>
);

const CourseVideo = ({ course, selectedChapter }: { course?: Course; selectedChapter: number }) => {
  const chapter = course?.chapters?.[selectedChapter];
  const videoUrl = chapter ? toEmbedUrl(chapter.videoUrl) : '';
  return (
    <div id="courseVideo" className="bg-surface flex flex-col overflow-hidden">
      {videoUrl ? (
        videoUrl.includes('cloudinary') ? (
          <video src={videoUrl} controls className="w-full h-full flex-1 min-h-90 object-cover" />
        ) : (
          <iframe
            src={videoUrl}
            title={chapter?.title ?? 'Course video'}
            className="w-full h-full flex-1 min-h-90"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )
      ) : (
        <ResourceChapterPlaceholder isResource={chapter?.typeOfChapter === 'resource'} />
      )}
    </div>
  );
};

export default CourseVideo;
