import { GraduationCapIcon, BookOpenIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../features/auth/authSlice';
import { imageUrl } from '../../utils/imageUrl';

interface TeacherCardProps {
  teacher: User;
  to?: string;
}

const TeacherCard = ({
  teacher,
  to = `/dashboard/users/${teacher.username}`,
}: TeacherCardProps) => {
  const navigate = useNavigate();

  const headerUrl = imageUrl(teacher.headerImage);
  const avatarUrl = imageUrl(teacher.avatarImage);

  return (
    <article
      onClick={() => navigate(to)}
      className="group relative flex flex-col h-full rounded-sm border-2 border-border bg-surface overflow-hidden shadow-[4px_4px_0_var(--color-border)] transition-all duration-300 hover:shadow-[6px_6px_0_var(--color-border)] hover:border-accent-hover hover:-translate-y-1 cursor-pointer"
    >
      {/* Header banner */}
      <div className="relative w-full h-28 md:h-32 overflow-hidden border-b border-border shrink-0">
        {headerUrl ? (
          <img
            src={headerUrl}
            alt={`${teacher.name}'s banner`}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-accent/15 flex items-center justify-center">
            <BookOpenIcon size={36} weight="thin" className="text-accent/50" />
          </div>
        )}
      </div>

      {/* Overlapping avatar */}
      <div className="px-4 -mt-11 flex justify-start shrink-0">
        <div className="w-20 h-20 rounded-sm overflow-hidden border-4 border-surface bg-background shadow-md group-hover:border-accent-hover transition-colors z-20">
          {avatarUrl ? (
            <img src={avatarUrl} alt={teacher.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-accent/20 flex items-center justify-center">
              <GraduationCapIcon size={32} weight="bold" className="text-accent" />
            </div>
          )}
        </div>
      </div>

      {/* Name + username */}
      <div className="px-4 mt-3">
        <h3 className="font-heading text-lg text-text m-0 leading-tight truncate group-hover:text-accent-hover transition-colors">
          {teacher.name}
        </h3>
        <h5 className="font-body text-sm text-text-muted italic m-0 mt-0.5">@{teacher.username}</h5>
      </div>

      {/* Description */}
      {teacher.description && (
        <p className="font-body text-sm text-text-secondary italic m-0 px-4 pt-2 line-clamp-3 text-justify leading-relaxed min-h-[3.75rem]">
          {teacher.description}
        </p>
      )}

      {/* Spacer to push footer down */}
      <div className="flex-1" />

      {/* Occupation badge */}
      {teacher.occupation && (
        <div className="px-4 mt-2 pb-4">
          <span className="inline-block font-heading text-[10px] uppercase tracking-widest bg-background border border-primary text-primary px-3 py-1 rounded-sm">
            {teacher.occupation}
          </span>
        </div>
      )}
    </article>
  );
};

export default TeacherCard;
