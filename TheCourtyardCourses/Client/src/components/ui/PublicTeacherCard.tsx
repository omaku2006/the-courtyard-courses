import { BookOpenIcon } from '@phosphor-icons/react';
import type React from 'react';

const PublicTeacherCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <article className="relative flex flex-col gap-4 rounded-sm border-2 border-border bg-surface overflow-hidden shadow-[4px_4px_0_var(--color-border)] transition-all duration-300 hover:shadow-[6px_6px_0_var(--color-border)] hover:-translate-y-1 h-full">
      {children}
    </article>
  );
};

PublicTeacherCard.HeaderImage = ({ url, alt }: { url: string; alt: string }) => {
  return (
    <div className="w-full h-32 overflow-hidden border-b border-border">
      <img src={url} alt={alt} className="w-full h-full object-cover object-center" />
    </div>
  );
};

PublicTeacherCard.AvatarImage = ({ url, alt }: { url: string; alt: string }) => {
  return (
    // ✅ Polish: Negative margin (-mt-12) to overlap avatar on the header image
    <div className="px-4 -mt-12 flex justify-start">
      <div className="w-20 h-20 rounded-sm overflow-hidden border-4 border-surface bg-background shadow-md">
        <img src={url} alt={alt} className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

PublicTeacherCard.Title = ({ name }: { name: string }) => {
  return <h3 className="font-heading text-lg text-text m-0 px-4 leading-tight truncate">{name}</h3>;
};

PublicTeacherCard.Username = ({ username }: { username: string }) => {
  return <h5 className="font-body text-sm text-text-muted italic m-0 px-4 -mt-2">@{username}</h5>;
};

PublicTeacherCard.Description = ({ description }: { description: string }) => {
  return (
    <p className="font-body text-sm text-text-secondary italic m-0 px-4 pt-2 line-clamp-3 text-justify leading-relaxed">
      {description}
    </p>
  );
};

PublicTeacherCard.Occupation = ({ occupation }: { occupation: string }) => {
  return (
    <div className="px-4 mt-2">
      {/* ✅ Polish: Made it look like an engraved royal badge */}
      <span className="inline-block font-heading text-[10px] uppercase tracking-widest bg-background border border-primary text-primary px-3 py-1 rounded-sm">
        {occupation}
      </span>
    </div>
  );
};

PublicTeacherCard.Experience = ({ experience }: { experience: string }) => {
  return (
    <div className="flex items-center gap-2 px-4 pt-2 text-text-muted border-t border-border mt-2">
      <BookOpenIcon size={16} weight="fill" className="text-primary" />
      <span className="text-xs font-body italic">{experience} of Practice</span>
    </div>
  );
};

PublicTeacherCard.Subjects = ({ subjects }: { subjects: string[] }) => {
  return (
    <div className="flex items-center gap-2 px-4 pb-4 text-text-muted">
      <span className="text-xs font-body italic">{subjects.length} Areas of Mastery</span>
    </div>
  );
};

export default PublicTeacherCard;
