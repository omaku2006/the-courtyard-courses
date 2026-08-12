import { useState } from 'react';
import { type Chapter, type Course } from '../../types/FetchDataTypes.ts';
import { ArrowSquareOutIcon } from '@phosphor-icons/react';

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
  return (
    <div id="chapterInfo" className="chapterInfo bg-surface p-4 flex flex-col gap-1 max-h-max">
      {course.chapters.map((chapter: Chapter, index: number) => (
        <div className="chapter" onClick={() => setIndexOpen(index)}>
          <div
            className={`nameContainer bg-bg border flex items-center justify-between overflow-x-hidden relative pr-9 ${
              selectChapter === index
                ? 'border-accent-hover'
                : indexOpen === index
                  ? 'border-accent'
                  : 'border-transparent'
            }`}
          >
            <p className="no-margin p-2 truncate min-w-0 flex-1">
              Chapter {index + 1} :- {chapter.title}
            </p>
            {chapter.duration && (
              <span className="shrink-0 pr-2 text-xs text-text-muted whitespace-nowrap">
                {chapter.duration}
              </span>
            )}
            <ArrowSquareOutIcon
              weight="bold"
              size={25}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setSelectChapter(index)}
            />
          </div>
          <div
            className={`grid transition-[grid-template-rows] ease duration-300 ${
              indexOpen === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="min-h-0 max-h-40 overflow-y-scroll">
              {chapter.duration && (
                <p className="px-2 pt-2 text-xs text-text-muted no-margin">
                  Duration: {chapter.duration}
                </p>
              )}
              <p className="p-2 no-margin">{chapter.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseChapterInfo;
