import type { Course } from '../../types/FetchDataTypes';

const toEmbedUrl = (url?: string): string => {
  if (!url) return '';
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

const CourseVideo = ({ course, selectedChapter }: { course?: Course; selectedChapter: number }) => {
  const videoUrl = toEmbedUrl(course?.chapters[selectedChapter]?.videoUrl);
  return (
    <div id="courseVideo" className="bg-surface">
      {videoUrl ? (
        <iframe
          src={videoUrl}
          title={course?.chapters[selectedChapter].title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <p className="p-4">No video available for this chapter.</p>
      )}
    </div>
  );
};

export default CourseVideo;
