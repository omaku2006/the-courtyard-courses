import { UsersThreeIcon, LockSimpleIcon } from '@phosphor-icons/react';
import type { Community, Creator } from '../../types/FetchDataTypes';
import { useNavigate } from 'react-router-dom';

interface CommunityCardProps {
  community: Community;
  onClick?: () => void;
}

const CommunityCard = ({ community, onClick }: CommunityCardProps) => {
  const thumbnailUrl = (community as any)?.thumbnail?.url;
  const courseCount = Array.isArray(community.courses) ? community.courses.length : 0;
  const memberCount = community.memberCount ?? 0;
  const creator = community.creator as Creator;
  const creatorName = creator?.name;
  const navigate = useNavigate();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        onClick?.();
        navigate(`/dashboard/communities/${community.slug}`);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
          navigate(`/dashboard/communities/${community.slug}`);
        }
      }}
      className="group relative flex flex-col h-full rounded-sm border-2 border-border bg-surface overflow-hidden shadow-[4px_4px_0_var(--color-border)] hover:shadow-[6px_6px_0_var(--color-border)] hover:-translate-y-0.5 hover:border-accent-hover transition-all cursor-pointer"
    >
      {/* Content */}
      <div className="flex flex-col gap-2.5 p-4 flex-1">
        {/* Avatar + Title */}
        <div className="flex items-center gap-3">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={community.name}
              className="w-12 h-12 rounded-sm object-cover border-2 border-border shadow-[2px_2px_0_var(--color-border)] shrink-0 group-hover:border-accent-hover transition-colors"
            />
          ) : (
            <div className="w-12 h-12 rounded-sm bg-accent/20 flex items-center justify-center border-2 border-border shadow-[2px_2px_0_var(--color-border)] shrink-0">
              <UsersThreeIcon size={24} weight="fill" className="text-accent" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-heading text-base text-text m-0 truncate group-hover:text-accent-hover transition-colors">
              {community.name}
            </h4>
            <span className="text-[10px] text-text-muted font-heading uppercase tracking-wider">
              {memberCount} member{memberCount !== 1 ? 's' : ''}
              {courseCount > 0 && ` · ${courseCount} course${courseCount > 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

        {/* Description */}
        {community.description && (
          <p className="text-xs text-text-muted italic line-clamp-2 m-0 leading-relaxed">
            {community.description}
          </p>
        )}

        {/* Footer row */}
        <div className="flex items-center gap-2 mt-auto pt-2 border-t border-border/40">
          {community.isPrivate && (
            <span className="inline-flex items-center gap-1 text-[9px] font-heading uppercase tracking-widest px-2 py-0.5 rounded-sm border border-border bg-bg text-text-muted">
              <LockSimpleIcon size={9} weight="fill" />
              Private
            </span>
          )}
          {creatorName && (
            <span className="ml-auto text-[10px] text-text-muted italic truncate font-heading">
              by {creatorName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
