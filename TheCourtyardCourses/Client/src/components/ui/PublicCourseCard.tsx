import type { ReactNode } from 'react';
import HrWrapper from './HrWrapper';
import { FleurDeLis } from './FleurDeLis';
import { imageUrl } from '../../utils/imageUrl';
import { motion } from 'framer-motion'; // framer-motion import karyu

// ✅ Fix: Removed AnimatePresence from inside the card. Parent page has it.
const PublicCourseCard = ({ children }: { children: ReactNode }) => {
  return (
    <motion.article
      layout // ✅ Magic: layout prop helps grid items adjust smoothly
      className="h-full flex flex-col gap-3 rounded-sm border-2 border-border bg-surface p-5 shadow-[4px_4px_0_var(--color-border)] transition-all duration-300 hover:shadow-[6px_6px_0_var(--color-border)] hover:-translate-y-1 hover:border-accent"
    >
      {children}
    </motion.article>
  );
};

PublicCourseCard.CoverImage = ({ url, name }: { url: string; name: string }) => {
  if (!url) return null;
  return (
    <div className="overflow-hidden rounded-sm border border-border">
      {/* ✅ Polish: Subtle zoom on hover */}
      <img
        src={url}
        alt={name}
        className="h-48 w-full object-cover transition-transform duration-500 hover:scale-105"
      />
    </div>
  );
};

PublicCourseCard.Title = ({ title }: { title: string }) => {
  // ✅ Fix: theme ma text-text nathi, text-text-primary che
  return <h4 className="font-heading text-lg text-text-primary leading-tight mt-2 m-0">{title}</h4>;
};

PublicCourseCard.Hr = ({ name }: { name: string }) => {
  return <HrWrapper name={name} />;
};

PublicCourseCard.Description = ({
  description,
  duration,
  level,
  language,
}: {
  description: string;
  duration?: string;
  level: string;
  language: string;
}) => {
  return (
    <div className="flex flex-col gap-1 text-sm mt-1">
      {duration && (
        <span className="font-heading text-[10px] uppercase tracking-widest text-text-secondary">
          Duration: {duration}
        </span>
      )}
      <span className="font-heading text-[10px] uppercase tracking-widest text-text-secondary">
        Level: {level} · {language}
      </span>
      {/* ✅ Fix: Replaced max-h-50 with line-clamp-3 for perfect ellipsis (...) truncation */}
      <p className="m-0 text-text-muted italic font-body leading-relaxed pt-2 line-clamp-3 text-justify">
        {description}
      </p>
    </div>
  );
};

PublicCourseCard.Creator = ({
  avatarImage,
  name,
  username,
}: {
  avatarImage?: { url?: string | null; publicId?: string | null } | null;
  name: string;
  username: string;
}) => {
  const avatar = imageUrl(avatarImage);
  // ✅ Polish: Safer initials function (crash prevention)
  const initials = name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-3 mt-2 pt-3 border-t border-border">
      {/* ✅ Fix: bg-background/border-primary theme ma nathi -> bg-bg/border-accent */}
      <div className="h-9 w-9 shrink-0 rounded-sm overflow-hidden border border-accent flex items-center justify-center bg-bg">
        {avatar ? (
          <img src={avatar} alt={username} className="h-full w-full object-cover" />
        ) : (
          <span className="font-heading text-sm text-accent">{initials || '?'}</span>
        )}
      </div>
      <div className="flex flex-col leading-tight overflow-hidden">
        <h5 className="m-0 text-sm font-heading text-text truncate">{name}</h5>
        <h6 className="m-0 text-xs text-text-muted italic truncate">@{username}</h6>
      </div>
    </div>
  );
};

PublicCourseCard.Rating = ({ ratings }: { ratings: number }) => {
  const filled = Math.round(ratings);
  const FILLED = { color: '#D4AF37', shadeColor: '#AA8C2C', strokeColor: '#3A2B1E' };
  const EMPTY = { color: '#8C7B63', shadeColor: '#6B5A45', strokeColor: '#8C7B63' };

  return (
    <div className="flex items-center gap-1 mt-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <FleurDeLis key={i} size={16} {...(i < filled ? FILLED : EMPTY)} />
      ))}
      {/* ✅ Fix: text-text theme ma nathi -> text-text-primary */}
      <span className="ml-1 text-xs font-heading text-text-primary">
        {ratings ? ratings.toFixed(1) : '—'}
      </span>
    </div>
  );
};

PublicCourseCard.PublishAt = ({ publishAt }: { publishAt?: string | null }) => {
  if (!publishAt) return null;
  return (
    <p className="m-0 mt-auto pt-3 text-[10px] uppercase tracking-widest text-text-muted font-heading">
      Est. {new Date(publishAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
    </p>
  );
};

export default PublicCourseCard;
