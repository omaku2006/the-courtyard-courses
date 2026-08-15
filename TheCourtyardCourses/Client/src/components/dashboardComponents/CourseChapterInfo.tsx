import { useState } from 'react';
import { type Chapter, type Course } from '../../types/FetchDataTypes.ts';
import { ArrowSquareOutIcon } from '@phosphor-icons/react';
import { useFetchMyProfile } from '../../features/auth/useAuth';

const CourseChapterInfo = ({
  course,
  selectChapter,
  setSelectChapter,
}: {
  course: Course;
  selectChapter: number | null;
  setSelectChapter: (index: number) => void;
}) => {
  const [indexOpen, setIndexOpen] = useState<number | null>(null);
  const { data } = useFetchMyProfile();
  const isEnrolled = course.students?.includes(data?.user?._id);

  return (
    <div id="chapterInfo" className="chapterInfo bg-surface p-4 flex flex-col gap-2 max-h-full">
      {/* ✅ Polish: Classic Index Heading */}
      <h4 className="font-heading text-sm uppercase tracking-widest text-text-secondary border-b border-border pb-2 mb-2">
        Table of Chapters
      </h4>

      {course.chapters.map((chapter: Chapter, index: number) => (
        // ✅ Fix: key={index} add karyu
        <div
          key={index}
          className="chapter border border-transparent transition-colors hover:border-border"
        >
          <div
            className={`bg-background border flex items-center justify-between overflow-hidden relative pr-12 cursor-pointer transition-colors ${
              selectChapter === index
                ? 'border-primary'
                : indexOpen === index
                  ? 'border-accent'
                  : 'border-border'
            }`}
            onClick={() => setIndexOpen(indexOpen === index ? null : index)}
          >
            <div className="flex items-center min-w-0 flex-1 p-3 gap-3">
              {/* ✅ Polish: Chapter number in Gold */}
              <span className="font-heading text-primary font-bold text-sm">{index + 1}.</span>
              <p className="truncate text-sm text-text no-margin">{chapter.title}</p>
            </div>

            {chapter.duration && (
              <span className="shrink-0 pr-2 text-xs text-text-muted whitespace-nowrap font-heading tracking-wider">
                {chapter.duration}
              </span>
            )}

            {/* ✅ Fix: e.stopPropagation() to prevent accordion toggle. Wrapped in button for accessibility */}
            {!isEnrolled ? (
              chapter.demo && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-sm transition-colors text-text-muted hover:text-primary hover:bg-accent/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectChapter(index);
                  }}
                  aria-label="View Chapter Details"
                >
                  <ArrowSquareOutIcon weight="bold" size={20} />
                </button>
              )
            ) : (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-sm transition-colors text-text-muted hover:text-primary hover:bg-accent/10"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectChapter(index);
                }}
                aria-label="View Chapter Details"
              >
                <ArrowSquareOutIcon weight="bold" size={20} />
              </button>
            )}
          </div>

          {/* Accordion Content */}
          <div
            className={`grid transition-[grid-template-rows] ease-in-out duration-300 ${
              indexOpen === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="p-4 pt-3 border-t border-border bg-surface">
                {chapter.duration && (
                  <p className="text-xs text-text-muted mb-2 font-heading uppercase tracking-wider m-0">
                    Duration: {chapter.duration}
                  </p>
                )}
                <p className="text-sm text-text-secondary italic leading-relaxed m-0">
                  {chapter.description || 'No manuscript description provided for this chapter.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseChapterInfo;
