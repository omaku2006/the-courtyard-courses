import { useLayoutEffect, useRef, useState } from 'react';

const CourseHeadline = ({ title }: { title: string }) => {
  const [overflows, setOverflows] = useState(false);
  const copyRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const el = copyRef.current;
    const parent = el?.parentElement;
    if (el && parent) setOverflows(el.scrollWidth > parent.clientWidth);
  }, [title]);

  return (
    <div id="courseHeadline" className="group bg-surface p-4 overflow-hidden">
      {overflows ? (
        <>
          {/* ✅ Marquee: full title scroll thay on hover */}
          <div className="flex w-max marquee-on-hover">
            <h2 className="m-0 whitespace-nowrap pr-10">{title}</h2>
            <h2 className="m-0 whitespace-nowrap pr-10" aria-hidden="true">
              {title}
            </h2>
          </div>
        </>
      ) : (
        <h2 ref={copyRef} className="m-0 truncate">
          {title}
        </h2>
      )}
    </div>
  );
};

export default CourseHeadline;