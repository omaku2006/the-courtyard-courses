import {
  ArrowLeftIcon,
  AtIcon,
  BookOpenIcon,
  ChalkboardTeacherIcon,
  ChatCircleDotsIcon,
  CheckIcon,
  FeatherIcon,
  ImageIcon,
  LockSimpleIcon,
  PencilSimpleIcon,
  TrashIcon,
  UsersThreeIcon,
  XIcon,
  SpinnerGapIcon,
} from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import HrWrapper from '../components/ui/HrWrapper';
import ConfirmModal from '../components/ui/ConfirmModal';
import ToggleButton from '../components/ui/ToggleButton';
import { useFetchMyProfile } from '../features/auth/useAuth';
import {
  useDeleteCommunity,
  useFetchCommunity,
  useJoinCommunity,
  useLeaveCommunity,
  useUpdateCommunity,
} from '../features/community/useCommunity';
import type { Community, Creator } from '../types/FetchDataTypes';
import CommunityLocked from '../components/community/CommunityLocked';
import LoadingPage from './system/LoadingPage';
import NotFoundPage from './system/NotFoundPage';
import ServerErrorPage from './system/ServerErrorPage';

const CommunityDetailsPage = () => {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useFetchCommunity(slug);
  const community = data?.community;

  const { data: myProfile } = useFetchMyProfile();
  const user = myProfile?.user;

  const joinCommunity = useJoinCommunity();
  const leaveCommunity = useLeaveCommunity();
  const updateCommunity = useUpdateCommunity();
  const deleteCommunity = useDeleteCommunity();

  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [headerFile, setHeaderFile] = useState<File | null>(null);

  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPrivate, setEditPrivate] = useState(false);
  const [editOpenChat, setEditOpenChat] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (community && editing) {
      setEditName(community.name);
      setEditDesc(community.description ?? '');
      setEditPrivate(!!community.isPrivate);
      setEditOpenChat(!!community.canEveryOneMessage);
    }
  }, [community, editing]);

  if (isLoading) return <LoadingPage />;
  if (isError) {
    const status = (error as any)?.response?.status;
    if (status === 403)
      return (
        <CommunityLocked message={(error as any)?.response?.data?.message} />
      );
    return <ServerErrorPage />;
  }
  if (!community) return <NotFoundPage />;

  const creator = community.creator as Creator;
  const creatorId = typeof community.creator === 'string' ? community.creator : creator?._id;
  const isCreator = creatorId === user?._id;

  const members = Array.isArray(community.members) ? (community.members as any[]) : [];
  const isMember = members.some((m) => (typeof m === 'string' ? m : m?._id) === user?._id);
  const canJoin = !isCreator && !isMember;
  const canLeave = !isCreator && isMember;

  const courses = Array.isArray(community.courses) ? (community.courses as any[]) : [];
  const memberCount = community.memberCount ?? members.length;
  const thumbSrc = community.thumbnail?.url ?? null;
  const headerSrc = community.headerImage?.url ?? null;
  const thumbPreview = thumbFile ? URL.createObjectURL(thumbFile) : null;
  const headerPreview = headerFile ? URL.createObjectURL(headerFile) : null;

  const formatDate = (ts?: string) => {
    if (!ts) return 'Unknown';
    return new Date(ts).toLocaleDateString([], {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('') || '?';

  const openMemberProfile = (username?: string) => {
    if (username) navigate(`/dashboard/users/${username}`);
  };

  const startEditing = () => {
    setEditName(community.name);
    setEditDesc(community.description ?? '');
    setEditPrivate(!!community.isPrivate);
    setEditOpenChat(!!community.canEveryOneMessage);
    setThumbFile(null);
    setHeaderFile(null);
    setEditing(true);
  };

  const cancelEditing = () => {
    setThumbFile(null);
    setHeaderFile(null);
    setEditing(false);
  };

  const handleSave = () => {
    if (!editName.trim() || updateCommunity.isPending) return;
    const fd = new FormData();
    fd.append('name', editName.trim());
    fd.append('description', editDesc.trim());
    fd.append('isPrivate', String(editPrivate));
    fd.append('canEveryOneMessage', String(editOpenChat));
    if (thumbFile) fd.append('thumbnail', thumbFile);
    if (headerFile) fd.append('headerImage', headerFile);
    updateCommunity.mutate(
      { slug, formData: fd },
      {
        onSuccess: () => {
          setThumbFile(null);
          setHeaderFile(null);
          setEditing(false);
        },
      }
    );
  };

  const handleDelete = () => {
    deleteCommunity.mutate(slug, {
      onSuccess: () => navigate('/dashboard/communities'),
    });
  };

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-12 md:px-8">
      <Link
        to={`/dashboard/communities/${community.slug}`}
        className="inline-flex w-fit items-center gap-2 text-sm italic text-text-muted transition-colors hover:text-text-primary"
      >
        <ArrowLeftIcon size={16} weight="bold" />
        Return to the Gathering
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="flex flex-col gap-6"
      >
        {/* Header Card */}
        <div className="overflow-hidden rounded-[4px] border-2 border-accent bg-surface shadow-[0_16px_40px_-16px_rgba(46,57,69,0.45)]">
          <div className="relative h-52 overflow-hidden bg-gradient-to-br from-highlight via-highlight to-accent-hover md:h-64">
            {headerPreview || headerSrc ? (
              <img
                src={headerPreview ?? headerSrc}
                alt={`${community.name} banner`}
                onClick={() =>
                  !editing &&
                  (headerPreview ?? headerSrc) &&
                  setLightbox(headerPreview ?? headerSrc)
                }
                className={`h-full w-full object-cover ${editing ? '' : 'cursor-zoom-in'}`}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="italic text-light">{community.name}</h2>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface via-surface/15 to-transparent" />

            {editing && (
              <label
                htmlFor="communityHeader"
                className="absolute right-4 top-4 z-10 inline-flex cursor-pointer items-center gap-2 rounded-[2px] border-2 border-light/40 bg-black/40 px-3 py-1.5 font-heading text-xs uppercase tracking-wider text-light backdrop-blur-sm transition-colors hover:bg-black/60"
              >
                <ImageIcon size={16} weight="bold" />
                Change Banner
              </label>
            )}
          </div>
          <input
            type="file"
            id="communityHeader"
            accept="image/png, image/jpeg"
            className="hidden"
            onChange={(e) => setHeaderFile(e.target.files?.[0] ?? null)}
          />

          <div className="relative px-6 pb-8 pt-0 md:px-10">
            <div className="flex flex-col items-center gap-5 text-center md:flex-row md:items-end md:gap-6 md:-mt-16 md:text-left">
              <div className="avatarWrapper -mt-16 shrink-0 md:mt-0">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[4px] border-4 border-surface bg-accent shadow-lg md:h-32 md:w-32">
                    {thumbPreview || thumbSrc ? (
                      <img
                        src={thumbPreview ?? thumbSrc}
                        alt={community.name}
                        onClick={() =>
                          !editing &&
                          (thumbPreview ?? thumbSrc) &&
                          setLightbox(thumbPreview ?? thumbSrc)
                        }
                        className={`h-full w-full object-cover ${editing ? '' : 'cursor-zoom-in'}`}
                      />
                    ) : (
                      <UsersThreeIcon size={40} weight="fill" className="text-light" />
                    )}
                  </div>
                  {editing && (
                    <label
                      htmlFor="communityThumb"
                      className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center rounded-[4px] bg-black/40 text-light opacity-0 transition-opacity hover:opacity-100"
                    >
                      <ImageIcon size={26} weight="bold" />
                    </label>
                  )}
                </div>
              </div>
              <input
                type="file"
                id="communityThumb"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={(e) => setThumbFile(e.target.files?.[0] ?? null)}
              />

              <div className="details flex flex-1 flex-col items-center gap-1 md:items-start">
                {editing ? (
                  <input
                    type="text"
                    id="name"
                    className="inputField w-full text-center font-heading md:text-left"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  <h3 className="mb-1">{community.name}</h3>
                )}
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-text-muted italic md:justify-start">
                  <span className="flex items-center gap-1.5">
                    <AtIcon size={16} weight="bold" />
                    /{community.slug}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <UsersThreeIcon size={16} weight="bold" />
                    {memberCount} scholar{memberCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="shrink-0 md:ml-auto md:self-end">
                <span className="inline-flex items-center gap-2 rounded-[2px] border-2 border-accent bg-bg px-4 py-1.5">
                  {community.isPrivate ? (
                    <LockSimpleIcon size={18} weight="fill" className="text-accent-hover" />
                  ) : (
                    <UsersThreeIcon size={18} weight="fill" className="text-accent-hover" />
                  )}
                  <span className="font-heading text-sm uppercase tracking-wider text-text-primary">
                    {community.isPrivate ? 'Private' : 'Public'}
                  </span>
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 border-t border-accent/40 pt-5 md:justify-start">
              <span className="flex items-center gap-2.5 text-text-secondary">
                <ChatCircleDotsIcon size={20} weight="fill" className="text-accent-hover" />
                {community.canEveryOneMessage ? 'Open Discussion' : 'Restricted Chat'}
              </span>
              <span className="flex items-center gap-2.5 text-text-secondary">
                <BookOpenIcon size={20} weight="fill" className="text-accent-hover" />
                {courses.length} {courses.length === 1 ? 'Course' : 'Courses'}
              </span>
              <span className="flex items-center gap-2.5 text-text-secondary">
                <ChalkboardTeacherIcon size={20} weight="fill" className="text-accent-hover" />
                Founded {formatDate(community.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <HrWrapper name="⚜" />

        {/* Founder */}
        <button
          onClick={() => openMemberProfile((creator as any)?.username)}
          disabled={!(creator as any)?.username}
          className={`flex items-center gap-3 rounded-[2px] border-2 border-border bg-surface p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-hover ${
            (creator as any)?.username ? 'cursor-pointer' : 'cursor-default'
          }`}
        >
          {(creator as any)?.avatarImage?.url ? (
            <img
              src={(creator as any).avatarImage.url}
              alt={creator?.name ?? 'Founder'}
              className="w-11 h-11 rounded-[var(--radius-min)] object-cover border-2 border-border shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-[var(--radius-min)] bg-accent/20 flex items-center justify-center border-2 border-border shrink-0">
              <ChalkboardTeacherIcon size={20} weight="fill" className="text-accent" />
            </div>
          )}
          <div className="min-w-0 flex-1 text-left">
            <span className="block text-[10px] font-heading uppercase tracking-widest text-text-muted">
              Founded by
            </span>
            <span className="block font-heading text-text truncate">
              {creator?.name ?? 'Unknown'}
            </span>
          </div>
          {(creator as any)?.username && (
            <span className="text-xs text-text-muted italic truncate">
              @{(creator as any).username}
            </span>
          )}
        </button>

        {/* About + Records */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex min-w-0 flex-col overflow-hidden rounded-[4px] border-2 border-accent bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent-hover">
            <div className="mb-4 flex items-center gap-2">
              <FeatherIcon size={20} weight="fill" className="text-accent-hover" />
              <h4 className="m-0 underline underline-offset-4">About</h4>
            </div>
            {editing ? (
              <textarea
                id="description"
                className="inputField h-full min-h-[120px] w-full resize-none m-0!"
                placeholder="Inscribe a few words about this gathering..."
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
              />
            ) : (
              <p className="other italic text-text-secondary">
                {community.description || 'No description inscribed yet.'}
              </p>
            )}
          </div>

          <div className="flex min-w-0 flex-col overflow-hidden rounded-[4px] border-2 border-accent bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent-hover">
            <div className="mb-4 flex items-center gap-2">
              <BookOpenIcon size={20} weight="fill" className="text-accent-hover" />
              <h4 className="m-0 underline underline-offset-4">Records</h4>
            </div>
            {editing ? (
              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <ToggleButton checked={editPrivate} onChange={setEditPrivate} id="editPrivate" />
                  <span className="font-heading text-xs text-text">Private Community</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <ToggleButton
                    checked={editOpenChat}
                    onChange={setEditOpenChat}
                    id="editOpenChat"
                  />
                  <span className="font-heading text-xs text-text">Open Discussion</span>
                </label>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-border/30">
                <div className="flex items-center justify-between gap-3 py-2">
                  <span className="text-[10px] font-heading uppercase tracking-widest text-text-muted">
                    Scholars
                  </span>
                  <span className="text-sm font-body text-text">{memberCount}</span>
                </div>
                <div className="flex items-center justify-between gap-3 py-2">
                  <span className="text-[10px] font-heading uppercase tracking-widest text-text-muted">
                    Courses
                  </span>
                  <span className="text-sm font-body text-text">{courses.length}</span>
                </div>
                <div className="flex items-center justify-between gap-3 py-2">
                  <span className="text-[10px] font-heading uppercase tracking-widest text-text-muted">
                    Established
                  </span>
                  <span className="text-sm font-body text-text">
                    {formatDate(community.createdAt)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Courses */}
        {courses.length > 0 && (
          <>
            <HrWrapper name="Courses" />
            <div className="grid gap-6 sm:grid-cols-2">
              {courses.map((course: any) => (
                <Link
                  key={course?._id}
                  to={`/dashboard/${course?.slug}`}
                  className="group rounded-[4px] border-2 border-border bg-surface p-5 shadow-[4px_4px_0_var(--color-border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-border)]"
                >
                  <div className="flex items-center gap-3">
                    {course?.thumbnail?.url ? (
                      <img
                        src={course.thumbnail.url}
                        alt={course?.title ?? 'Course'}
                        className="w-11 h-11 rounded-[var(--radius-min)] object-cover border-2 border-border shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-[var(--radius-min)] bg-accent/20 flex items-center justify-center border-2 border-border shrink-0">
                        <BookOpenIcon size={20} weight="fill" className="text-accent" />
                      </div>
                    )}
                    <h5 className="m-0 font-heading text-text-primary group-hover:underline truncate">
                      {course?.title ?? 'Course'}
                    </h5>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Members */}
        <>
          <HrWrapper name="Members" />
          {members.length === 0 ? (
            <p className="other italic text-text-muted">No members yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {members.slice(0, 24).map((m: any) => {
                const mId = typeof m === 'string' ? m : m?._id;
                const mName = typeof m === 'string' ? 'Member' : m?.name ?? 'Member';
                const mAvatar = typeof m === 'string' ? null : m?.avatarImage?.url;
                const mUsername = typeof m === 'string' ? null : m?.username;
                return (
                  <button
                    key={mId}
                    onClick={() => mUsername && openMemberProfile(mUsername)}
                    disabled={!mUsername}
                    title={mUsername ? `View ${mName}'s profile` : mName}
                    className={`flex items-center gap-1.5 rounded-sm border-2 border-border bg-surface px-2 py-1 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-hover hover:shadow-[2px_2px_0_var(--color-border)] ${
                      mUsername ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    {mAvatar ? (
                      <img
                        src={mAvatar}
                        alt={mName}
                        className="w-5 h-5 rounded-[var(--radius-min)] object-cover border border-border shrink-0"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-[var(--radius-min)] bg-accent/20 flex items-center justify-center border border-border shrink-0 text-[9px] font-heading text-accent font-bold">
                        {getInitials(mName)}
                      </div>
                    )}
                    <span className="text-[10px] font-heading text-text truncate max-w-[90px]">
                      {mName}
                    </span>
                  </button>
                );
              })}
              {members.length > 24 && (
                <span className="text-[10px] font-heading text-text-muted italic self-center">
                  +{members.length - 24} more
                </span>
              )}
            </div>
          )}
        </>

        {/* Actions */}
        <div className="mt-2 flex flex-col gap-4 sm:flex-row">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={!editName.trim() || updateCommunity.isPending}
                className="btnPrimary inline-flex w-full items-center justify-center gap-2 disabled:pointer-events-none disabled:opacity-60"
              >
                <CheckIcon size={18} weight="bold" />
                {updateCommunity.isPending ? 'Inscribing...' : 'Save Changes'}
              </button>
              <button
                onClick={cancelEditing}
                className="btnSecondary inline-flex w-full items-center justify-center gap-2"
              >
                <XIcon size={18} weight="bold" />
                Cancel
              </button>
            </>
          ) : (
            <>
              {isCreator && (
                <>
                  <button
                    onClick={startEditing}
                    className="btnSecondary inline-flex w-full items-center justify-center gap-2"
                  >
                    <PencilSimpleIcon size={18} weight="bold" />
                    Update Community
                  </button>
                  <button
                    onClick={() => setDeleteOpen(true)}
                    disabled={deleteCommunity.isPending}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-[2px] border-2 border-error/40 bg-error/10 px-4 py-2 font-heading text-sm text-error transition-colors hover:bg-error/20 disabled:pointer-events-none disabled:opacity-60"
                  >
                    <TrashIcon size={18} weight="bold" />
                    Delete Community
                  </button>
                </>
              )}
              {canJoin && (
                <button
                  onClick={() => joinCommunity.mutate(slug)}
                  disabled={joinCommunity.isPending}
                  className="btnPrimary inline-flex w-full items-center justify-center gap-2 disabled:pointer-events-none disabled:opacity-60"
                >
                  {joinCommunity.isPending ? (
                    <SpinnerGapIcon size={18} weight="bold" className="animate-spin" />
                  ) : (
                    <UsersThreeIcon size={18} weight="fill" />
                  )}
                  Join Community
                </button>
              )}
              {canLeave && (
                <button
                  onClick={() => leaveCommunity.mutate(slug)}
                  disabled={leaveCommunity.isPending}
                  className="btnSecondary inline-flex w-full items-center justify-center gap-2 disabled:pointer-events-none disabled:opacity-60"
                >
                  {leaveCommunity.isPending ? (
                    <SpinnerGapIcon size={18} weight="bold" className="animate-spin" />
                  ) : (
                    <UsersThreeIcon size={18} weight="fill" />
                  )}
                  Leave Community
                </button>
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* Full screen image preview */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Close preview"
              className="absolute right-5 top-5 z-10 rounded-[4px] border-2 border-light/40 p-2 text-light transition-colors hover:bg-black/40"
            >
              <XIcon size={28} weight="bold" />
            </button>
            <motion.img
              src={lightbox}
              alt="Full screen preview"
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full rounded-[4px] object-contain shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={deleteOpen}
        title="Disband This Community?"
        message="All posts and records of this gathering will be erased forever. This cannot be undone."
        confirmLabel="Disband"
        isPending={deleteCommunity.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </section>
  );
};

export default CommunityDetailsPage;