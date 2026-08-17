import type { ReactNode } from 'react';
import HrWrapper from './HrWrapper';
import { FleurDeLis } from './FleurDeLis';
import { imageUrl } from '../../utils/imageUrl';

const PublicCourseCard = ({ children }: { children: ReactNode }) => {
  return (
    <article className="h-full flex flex-col gap-3 rounded-sm border-2 border-border bg-surface p-5 shadow-[4px_4px_0_var(--color-border)] transition-all duration-300 hover:shadow-[6px_6px_0_var(--color-border)] hover:-translate-y-1 hover:border-accent-hover group">
      {children}
    </article>
  );
};

PublicCourseCard.CoverImage = ({ url, name }: { url: string; name: string }) => {
  if (!url) return null;
  return (
    <div className="relative overflow-hidden rounded-sm border border-border">
      <img
        src={url}
        alt={name}
        className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

PublicCourseCard.EnrolledBadge = () => {
  return (
    <div className="absolute top-3 right-3 z-10 rounded-sm border border-accent bg-accent/90 px-2 py-1 font-heading text-[10px] uppercase tracking-widest text-light shadow-[2px_2px_0_var(--color-border)]">
      Inscribed
    </div>
  );
};

PublicCourseCard.Title = ({ title }: { title: string }) => {
  return (
    <h4 className="font-heading text-lg text-text leading-tight mt-2 m-0 group-hover:text-accent-hover transition-colors duration-300">
      {title}
    </h4>
  );
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
    <div className="flex flex-col gap-1.5 text-sm mt-1">
      <div className="flex flex-wrap items-center gap-2">
        {duration && (
          <span className="font-heading text-[10px] uppercase tracking-widest text-text-secondary">
            Duration: {duration}
          </span>
        )}
        <span className="font-heading text-[10px] uppercase tracking-widest text-text-secondary">
          Level: {level} · {language}
        </span>
      </div>
      <p className="m-0 text-text-muted italic font-body leading-relaxed pt-1 line-clamp-3 text-justify">
        {description}
      </p>
    </div>
  );
};

PublicCourseCard.Price = ({ priceType, price }: { priceType: 'free' | 'paid'; price: number }) => {
  const isPaid = priceType === 'paid' && price > 0;
  return (
    <div className="flex items-center gap-2 mt-1">
      {isPaid ? (
        <>
          <span className="font-heading text-[10px] uppercase tracking-widest text-text-muted">
            Tuition Fee:
          </span>
          <span className="font-heading text-sm text-text-primary">₹{price}</span>
        </>
      ) : (
        <div className="flex items-center gap-1.5">
          <span className="font-heading text-[10px] uppercase tracking-widest text-text-muted">
            Access:
          </span>
          <span className="font-heading text-xs text-success px-1.5 py-0.5 bg-success/10 border border-success/20 rounded-sm">
            Complimentary
          </span>
        </div>
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
      <div className="h-9 w-9 shrink-0 rounded-sm overflow-hidden border border-border bg-bg flex items-center justify-center">
        {avatar ? (
          <img src={avatar} alt={username} className="h-full w-full object-cover" />
        ) : (
          <span className="font-heading text-sm text-text-secondary">{initials || '?'}</span>
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
    <p className="text-[10px] uppercase tracking-widest text-text-muted font-heading no-margin">
      Est. {new Date(publishAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
    </p>
  );
};

PublicCourseCard.StudentCount = ({ count }: { count?: number }) => {
  if (!count) return null;
  return (
    <span
      className="font-heading text-[10px] uppercase tracking-widest text-text-muted no-margin"
      style={{ fontSize: '10px' }}
    >
      · {count} {count === 1 ? 'Scholar' : 'Scholars'}
    </span>
  );
};

export default PublicCourseCard;
