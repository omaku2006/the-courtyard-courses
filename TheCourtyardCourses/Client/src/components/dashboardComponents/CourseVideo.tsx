import type { Course } from '../../types/FetchDataTypes';

const toEmbedUrl = (url?: string): string => {
  if (!url) return '';
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

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
        <p className="p-4">No video available for this chapter.</p>
      )}
    </div>
  );
};

export default CourseVideo;
