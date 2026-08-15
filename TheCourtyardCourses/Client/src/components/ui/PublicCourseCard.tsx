import type { ReactNode } from 'react';
import HrWrapper from './HrWrapper';
import { FleurDeLis } from './FleurDeLis';
import { imageUrl } from '../../utils/imageUrl';
import { motion } from 'framer-motion';

const PublicCourseCard = ({ children }: { children: ReactNode }) => {
  return (
    <motion.article
      layout
      className="h-full flex flex-col gap-3 rounded-sm border-2 border-border bg-surface p-5 shadow-[4px_4px_0_var(--color-border)] transition-all duration-300 hover:shadow-[6px_6px_0_var(--color-border)] hover:-translate-y-1 hover:border-primary"
    >
      {children}
    </motion.article>
  );
};

PublicCourseCard.CoverImage = ({ url, name }: { url: string; name: string }) => {
  if (!url) return null;
  return (
    <div className="overflow-hidden rounded-sm border border-border">
      <img
        src={url}
        alt={name}
        className="h-48 w-full object-cover transition-transform duration-500 hover:scale-105"
      />
    </div>
  );
};

// ✅ NEW: Enrolled badge — already-inscribed courses par overlay
PublicCourseCard.EnrolledBadge = () => {
  return (
    <div className="absolute top-3 right-3 z-10 rounded-sm border border-accent bg-accent/90 px-2 py-1 font-heading text-[10px] uppercase tracking-widest text-light shadow-[2px_2px_0_var(--color-border)]">
      Inscribed
    </div>
  );
};

PublicCourseCard.Title = ({ title }: { title: string }) => {
  return <h4 className="font-heading text-lg text-text leading-tight mt-2 m-0">{title}</h4>;
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
      <p className="m-0 text-text-muted italic font-body leading-relaxed pt-2 line-clamp-3 text-justify">
        {description}
      </p>
    </div>
  );
};

// ✅ NEW: Price Tag Component
PublicCourseCard.Price = ({ priceType, price }: { priceType: 'free' | 'paid'; price: number }) => {
  return (
    <div className="flex items-center gap-2 mt-1">
      {priceType === 'paid' && price > 0 ? (
        <>
          <span className="font-heading text-[10px] uppercase tracking-widest text-text-muted">
            Tuition Fee:
          </span>
          <span className="font-heading text-sm text-text-primary">₹{price}</span>
        </>
      ) : (
        <>
          <span className="font-heading text-[10px] uppercase tracking-widest text-text-muted">
            Access:
          </span>
          <span className="font-heading text-sm text-accent">Complimentary</span>
        </>
      )}
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
  const initials = name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-3 mt-2 pt-3 border-t border-border">
      <div className="h-9 w-9 shrink-0 rounded-sm overflow-hidden border border-primary flex items-center justify-center bg-background">
        {avatar ? (
          <img src={avatar} alt={username} className="h-full w-full object-cover" />
        ) : (
          <span className="font-heading text-sm text-primary">{initials || '?'}</span>
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
      <span className="ml-1 text-xs font-heading text-text">
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
