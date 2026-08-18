import {
  ArrowRightIcon,
  ChatCircleDotsIcon,
  LockSimpleIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import type { Community, Course } from '../../types/FetchDataTypes';

const CourseCommunity = ({ course }: { course: Course }) => {
  const navigate = useNavigate();
  const community = course.community;

  if (!community || typeof community === 'string') {
    return (
      <div
        id="courseCommunity"
        className="flex h-full min-h-[160px] flex-col items-center justify-center gap-3 p-6 bg-surface"
      >
        <div className="flex flex-col items-center justify-center gap-3 rounded-[2px] border border-dashed border-border bg-surface/60 p-5 text-center">
          <ChatCircleDotsIcon size={28} weight="thin" className="text-accent/60" />
          <p className="m-0 text-sm italic text-text-muted">
            No community gathering is attached to this curriculum yet.
          </p>
        </div>
      </div>
    );
  }

  const communityData = community as Community;
  const thumbUrl = communityData.thumbnail?.url ?? null;
  const memberCount = communityData.memberCount ?? 0;

  return (
    <div
      id="courseCommunity"
      className="flex flex-col gap-3 rounded-sm border border-border! bg-surface p-5 "
    >
      {/* ✅ ChapterInfo-style heading: icon + uppercase title with bottom rule */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <ChatCircleDotsIcon size={16} weight="fill" className="text-accent-hover" />
        <h4 className="m-0 font-heading text-sm uppercase truncate tracking-widest text-text-secondary">
          Community Gathering
        </h4>
      </div>

      {/* Thumbnail + name + stats (always stacked — the grid cell is narrow) */}
      <div className="flex items-center gap-3">
        {thumbUrl ? (
          <img
            src={thumbUrl}
            alt={communityData.name}
            className="h-16 w-16 shrink-0 rounded-[2px] border-2 border-border object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[2px] border-2 border-border bg-accent/20">
            <UsersThreeIcon size={28} weight="fill" className="text-accent" />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h5 className="m-0 truncate font-heading text-base text-text">{communityData.name}</h5>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-heading uppercase tracking-widest text-text-muted">
            <span className="flex items-center gap-1 whitespace-nowrap">
              <UsersThreeIcon size={11} weight="fill" className="text-accent" />
              {memberCount} Scholar{memberCount !== 1 ? 's' : ''}
            </span>
            {communityData.isPrivate && (
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                <LockSimpleIcon size={11} weight="fill" className="text-accent" />
                Private
              </span>
            )}
            {communityData.canEveryOneMessage === false && (
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                <ChatCircleDotsIcon size={11} weight="fill" className="text-accent" />
                Restricted Chat
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="m-0 line-clamp-2 text-sm italic text-text-muted">
        {communityData.description ||
          'Join your fellow scholars for discussion beneath the courtyard arches.'}
      </p>

      <button
        type="button"
        onClick={() => navigate(`/dashboard/communities/${communityData.slug}`)}
        className="btnPrimary inline-flex w-full items-center justify-center gap-2"
      >
        Enter the Gathering
        <ArrowRightIcon size={18} weight="bold" />
      </button>
    </div>
  );
};

export default CourseCommunity;
