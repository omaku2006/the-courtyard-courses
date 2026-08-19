import { FileTextIcon, FileIcon } from '@phosphor-icons/react';
import type { ImageRef, PostFile } from '../../types/FetchDataTypes';

interface MessageAttachmentsProps {
  images?: ImageRef[];
  files?: PostFile[];
  isMine?: boolean;
}

const MessageAttachments = ({ images = [], files = [], isMine = false }: MessageAttachmentsProps) => {
  const safeImages = Array.isArray(images) ? images : [];
  const safeFiles = Array.isArray(files) ? files : [];

  if (safeImages.length === 0 && safeFiles.length === 0) return null;

  return (
    <div
      className={`flex gap-2 w-full overflow-x-auto pb-1 scrollbar-thin ${
        isMine ? 'justify-end' : 'justify-start'
      }`}
    >
      {safeImages.map((img, i) =>
        img?.url ? (
          <a
            key={i}
            href={img.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-[var(--radius-min)] border-2 border-border overflow-hidden block shadow-[2px_2px_0_var(--color-border)] hover:border-accent-hover hover:shadow-[3px_3px_0_var(--color-border)] hover:-translate-y-0.5 transition-all group"
            title="Open image"
          >
            <img
              src={img.url}
              alt={`Attachment ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </a>
        ) : null
      )}

      {safeFiles.map((file, i) => (
        <a
          key={i}
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-2 w-40 sm:w-44 h-20 sm:h-24 rounded-[var(--radius-min)] border-2 border-border bg-bg p-2 shadow-[2px_2px_0_var(--color-border)] hover:border-accent-hover hover:shadow-[3px_3px_0_var(--color-border)] hover:-translate-y-0.5 transition-all no-underline group"
          title={file.name || 'Open file'}
        >
          <div className="w-10 h-10 rounded-sm bg-accent/20 flex items-center justify-center shrink-0 border border-border group-hover:bg-accent/30 transition-colors">
            {file.type === 'image' ? (
              <FileIcon size={20} weight="fill" className="text-accent" />
            ) : (
              <FileTextIcon size={20} weight="fill" className="text-accent" />
            )}
          </div>
          <span className="text-[11px] text-text font-heading truncate leading-tight group-hover:text-accent-hover transition-colors">
            {file.name || 'File'}
          </span>
        </a>
      ))}
    </div>
  );
};

export default MessageAttachments;
