import {
  PaperclipIcon,
  PaperPlaneRightIcon,
  XIcon,
  FileTextIcon,
} from '@phosphor-icons/react';
import { useRef, useState } from 'react';
import { useCreatePost } from '../../features/post/usePost';

interface ChatInputProps {
  communityId: string;
}

const ChatInput = ({ communityId }: ChatInputProps) => {
  const createPost = useCreatePost(communityId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setSelectedFiles((prev) => [...prev, ...files].slice(0, 15));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const trimmed = content.trim();
    if ((!trimmed && selectedFiles.length === 0) || createPost.isPending) return;

    const fd = new FormData();
    fd.append('content', trimmed || '');

    const imageFiles = selectedFiles.filter((f) => f.type.startsWith('image/'));
    const docFiles = selectedFiles.filter((f) => !f.type.startsWith('image/'));

    imageFiles.forEach((f) => fd.append('images', f));
    docFiles.forEach((f) => fd.append('files', f));

    createPost.mutate(fd, {
      onSuccess: () => {
        setContent('');
        setSelectedFiles([]);
      },
    });
  };

  const canSend = content.trim() || selectedFiles.length > 0;

  return (
    <div className="w-full border-t-2 border-border bg-surface shrink-0">
      {/* File preview strip */}
      {selectedFiles.length > 0 && (
        <div className="flex gap-2 w-full overflow-x-auto px-4 pt-3 pb-1 scrollbar-thin border-b border-border/30">
          {selectedFiles.map((file, i) => {
            const isImage = file.type.startsWith('image/');
            return (
              <div key={i} className="relative shrink-0 group">
                {isImage ? (
                  <div className="w-20 h-20 rounded-sm border-2 border-border overflow-hidden shadow-[2px_2px_0_var(--color-border)]">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 w-36 h-20 rounded-sm border-2 border-border bg-bg p-2 shadow-[2px_2px_0_var(--color-border)]">
                    <div className="w-8 h-8 rounded-sm bg-accent/20 flex items-center justify-center shrink-0 border border-border">
                      <FileTextIcon size={16} weight="fill" className="text-accent" />
                    </div>
                    <span className="text-[10px] text-text font-heading truncate">
                      {file.name}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => removeFile(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-[var(--radius-min)] bg-error text-light flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  title="Remove"
                >
                  <XIcon size={10} weight="bold" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-center gap-2 px-4 py-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.pptx"
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="h-10 w-10 flex items-center justify-center rounded-sm border-2 border-border text-text-muted hover:text-accent-hover hover:bg-bg hover:border-accent-hover transition-colors shrink-0 group"
          aria-label="Attach files"
          title="Attach images or files"
        >
          <PaperclipIcon size={20} weight="bold" className="group-hover:rotate-12 transition-transform" />
        </button>

        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Inscribe your message..."
          className="flex-1 h-10 text-sm font-body px-4 rounded-sm border-2 border-border bg-bg text-text placeholder:text-text-muted/60 focus:outline-none focus:border-accent-hover transition-colors"
        />

        <button
          onClick={handleSubmit}
          disabled={!canSend || createPost.isPending}
          className="h-10 w-10 flex items-center justify-center btnPrimary shrink-0 !p-0 disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Send message"
          title="Send"
        >
          {createPost.isPending ? (
            <span className="block w-5 h-5 border-2 border-light/40 border-t-light rounded-sm animate-spin" />
          ) : (
            <PaperPlaneRightIcon size={20} weight="fill" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;