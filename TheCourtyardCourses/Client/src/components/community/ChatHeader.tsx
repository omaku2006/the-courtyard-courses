import { ArrowLeftIcon, GearIcon, LockSimpleIcon, UsersThreeIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { useFetchMyProfile } from '../../features/auth/useAuth';
import type { Community } from '../../types/FetchDataTypes';

interface ChatHeaderProps {
  community: Community;
}

const ChatHeader = ({ community }: ChatHeaderProps) => {
  const navigate = useNavigate();
  const { data } = useFetchMyProfile();
  const user = data?.user;
  const isTeacher = user?.role === 'teacher';

  const creatorName = (community.creator as any)?.name;
  const thumbUrl = (community as any)?.thumbnail?.url;
  const memberCount = community.memberCount ?? 0;

  const openDetails = () => {
    navigate(`/dashboard/communities/${community.slug}/details`);
  };

  const infoButtonClasses =
    'flex items-center gap-3 min-w-0 flex-1 rounded-sm border-2 border-transparent p-1 -m-1 hover:border-border hover:bg-bg transition-colors cursor-pointer text-left';

  return (
    <header className="flex items-center gap-2 sm:gap-3 w-full border-b-2 border-border bg-surface px-3 py-2.5 sm:px-4 sm:py-3 shrink-0">
      <button
        onClick={() => navigate(-1)}
        className="p-1.5 sm:p-2 rounded-sm border-2 border-border text-text hover:bg-bg hover:border-accent-hover transition-colors shrink-0 group"
        aria-label="Go back"
        title="Go back"
      >
        <ArrowLeftIcon size={20} weight="bold" className="group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        onClick={openDetails}
        className={infoButtonClasses}
        aria-label="Community details"
        title="View community details"
      >
        {thumbUrl ? (
          <img
            src={thumbUrl}
            alt={community.name}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-sm object-cover border-2 border-border shadow-[2px_2px_0_var(--color-border)] shrink-0"
          />
        ) : (
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-sm bg-accent/20 flex items-center justify-center border-2 border-border shadow-[2px_2px_0_var(--color-border)] shrink-0">
            <UsersThreeIcon size={20} weight="fill" className="text-accent" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-sm sm:text-base text-text m-0 truncate leading-tight">
            {community.name}
          </h3>
          <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-heading uppercase tracking-wider overflow-hidden whitespace-nowrap">
            {community.isPrivate && (
              <span className="flex items-center gap-1 text-accent-hover shrink-0">
                <LockSimpleIcon size={11} weight="fill" />
                Private
              </span>
            )}
            <span className="flex items-center gap-1 shrink-0">
              <UsersThreeIcon size={11} weight="fill" className="text-accent" />
              {memberCount} scholar{memberCount !== 1 ? 's' : ''}
            </span>
            {creatorName && (
              <>
                <span className="opacity-50 shrink-0">·</span>
                <span className="truncate italic normal-case tracking-normal text-text-muted/80">
                  by {creatorName}
                </span>
              </>
            )}
          </div>
        </div>
      </button>

      {isTeacher && (
        <button
          onClick={openDetails}
          className="p-1.5 sm:p-2 rounded-sm border-2 border-border text-text hover:bg-bg hover:border-accent-hover hover:text-accent-hover transition-colors shrink-0"
          aria-label="Community settings"
          title="Community settings"
        >
          <GearIcon size={20} weight="fill" />
        </button>
      )}
    </header>
  );
};

export default ChatHeader;