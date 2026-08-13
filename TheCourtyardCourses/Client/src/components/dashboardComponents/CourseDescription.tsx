import { FeatherIcon, FilesIcon, ArrowSquareOutIcon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import type { Course } from '../../types/FetchDataTypes';

const isImage = (url: string) => /\.(png|jpe?g|gif|webp|svg|avif|bmp)(\?|$)/i.test(url);

const InlineResource = ({ fileUrl }: { fileUrl: string }) => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    let createdUrl: string | null = null;

    const sniffBlob = async (blob: Blob): Promise<Blob> => {
      const ext = fileUrl.match(/\.([a-z0-9]+)(?:\?|$)/i)?.[1]?.toLowerCase();
      if (ext === 'pdf') return new Blob([blob], { type: 'application/pdf' });
      if (ext === 'txt') return new Blob([blob], { type: 'text/plain' });
      if (blob.type && blob.type !== 'application/octet-stream') return blob;
      const head = new Uint8Array(await blob.slice(0, 4).arrayBuffer());
      const isPdf = head[0] === 0x25 && head[1] === 0x50 && head[2] === 0x44 && head[3] === 0x46;
      return isPdf ? new Blob([blob], { type: 'application/pdf' }) : blob;
    };

    fetch(fileUrl)
      .then((res) => (res.ok ? res.blob() : Promise.reject(new Error('fetch failed'))))
      .then(sniffBlob)
      .then((blob) => {
        if (!active) return;
        createdUrl = URL.createObjectURL(blob);
        setObjectUrl(createdUrl);
      })
      .catch(() => {
        if (active) setFailed(true);
      });

    return () => {
      active = false;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [fileUrl]);

  // ✅ Polish: Fallback link made to look like a Victorian Button
  if (failed) {
    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noreferrer"
        className="btnSecondary w-full flex items-center justify-center gap-2 mt-2 text-sm"
      >
        <ArrowSquareOutIcon size={16} weight="bold" />
        Open Manuscript in New Tab
      </a>
    );
  }

  // ✅ Polish: Themed loading text
  if (!objectUrl)
    return (
      <p className="text-xs italic text-text-muted animate-pulse py-4 text-center">
        Summoning resource...
      </p>
    );

  return (
    <iframe
      src={objectUrl}
      title="Resource preview"
      // ✅ Polish: Added bg-white so PDFs always look right in dark mode too
      className="w-full h-72 rounded-[2px] border border-border bg-white"
    />
  );
};

const CourseDescription = ({
  course,
  selectedChapter,
}: {
  course: Course;
  selectedChapter: number;
}) => {
  const chapter = course?.chapters?.[selectedChapter];
  const resources = (chapter?.resources ?? []).filter(
    (r): r is { url: string; publicId?: string | null } => !!r?.url
  );

  return (
    // ✅ Polish: overflow-scroll kadhi ne overflow-y-auto mukyu (smooth scroll)
    <div
      id="courseDescription"
      className="bg-surface p-5 overflow-y-auto hide-scrollbar flex flex-col gap-4"
    >
      {/* Course Overview */}
      <div>
        <h4 className="font-heading text-sm uppercase tracking-widest text-primary flex items-center gap-2 mb-2">
          <FeatherIcon weight="fill" size={20} />
          Course Overview
        </h4>
        <hr className="border-border mb-3" />
        <p className="text-sm text-text-secondary leading-relaxed font-body">
          {course?.description || 'No overview provided for this curriculum.'}
        </p>
      </div>

      {/* Chapter Details */}
      <div>
        <h4 className="font-heading text-sm uppercase tracking-widest text-primary flex items-center gap-2 mb-2">
          <FeatherIcon weight="fill" size={20} />
          Chapter Details
        </h4>
        <hr className="border-border mb-3" />
        <p className="text-sm text-text-secondary leading-relaxed font-body">
          {chapter?.description || 'No manuscript details provided for this chapter.'}
        </p>
      </div>

      {/* Attached Resources */}
      <div>
        <h4 className="font-heading text-sm uppercase tracking-widest text-primary flex items-center gap-2 mb-2">
          <FilesIcon weight="fill" size={20} />
          Attached Resources
        </h4>
        <hr className="border-border mb-3" />

        {resources.length > 0 ? (
          <div className="flex flex-col gap-4">
            {resources.map((file, i) =>
              isImage(file.url) ? (
                <div key={i} className="overflow-hidden rounded-[2px] border border-border">
                  <img
                    src={file.url}
                    alt={`Resource ${i + 1}`}
                    className="w-full max-h-80 object-cover"
                  />
                </div>
              ) : (
                <InlineResource key={i} fileUrl={file.url} />
              )
            )}
          </div>
        ) : (
          // ✅ Polish: Better empty state
          <p className="text-xs italic text-text-muted py-4 text-center border border-dashed border-border rounded-[2px]">
            No supplementary resources attached to this chapter.
          </p>
        )}
      </div>
    </div>
  );
};

export default CourseDescription;
