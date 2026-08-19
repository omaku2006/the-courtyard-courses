import {
  PlusIcon,
  UsersThreeIcon,
  XIcon,
  SpinnerGapIcon,
} from '@phosphor-icons/react';
import { useFetchMyProfile } from '../../features/auth/useAuth';
import { useFetchMyCommunities } from '../../features/community/useCommunity';
import type { User } from '../../features/auth/authSlice';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import CommunityForm from './CommunityForm';
import CommunityCard from './CommunityCard';
import HrWrapper from '../ui/HrWrapper';

const MyCommunities = () => {
  const { data } = useFetchMyProfile();
  const user = data?.user;
  const { data: communitiesData, isLoading } = useFetchMyCommunities();
  const [formOpen, setFormOpen] = useState(false);

  const closeForm = () => setFormOpen(false);
  const communities = communitiesData?.communities || [];

  return (
    <section className="w-full">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h3 className="flex gap-4 items-center font-heading text-2xl text-text m-0">
          <UsersThreeIcon size={32} weight="fill" className="text-accent-hover" />
          My Communities
        </h3>
        {user?.role === 'teacher' && (
          <button
            className="btnSecondary inline-flex items-center gap-2 hover:-translate-y-0.5 transition-transform"
            onClick={() => setFormOpen(true)}
          >
            <PlusIcon weight="fill" size={20} />
            Add Community
          </button>
        )}
      </div>
      <HrWrapper name="Gatherings" className="my-4" />

      {isLoading ? (
        <div className="flex items-center justify-center gap-3 py-16 text-text-muted italic font-heading">
          <SpinnerGapIcon size={22} weight="bold" className="text-accent animate-spin" />
          Loading your communities...
        </div>
      ) : communities.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-text-muted">
          <UsersThreeIcon size={48} weight="thin" className="text-accent/40" />
          <p className="font-heading text-lg m-0">No communities yet.</p>
          <p className="text-sm italic m-0">Establish your first community to begin.</p>
          {user?.role === 'teacher' && (
            <button
              className="btnSecondary inline-flex items-center gap-2 mt-2"
              onClick={() => setFormOpen(true)}
            >
              <PlusIcon weight="fill" size={18} />
              Establish One
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {communities.map((community: any) => (
            <CommunityCard key={community._id} community={community} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {formOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeForm}
          >
            <motion.div
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-sm border-2 border-border bg-surface p-6 shadow-[6px_6px_0_var(--color-border)]"
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                <div>
                  <h4 className="m-0 font-heading text-lg text-text">
                    Establish a Community
                  </h4>
                  <p className="m-0 text-[10px] text-text-muted italic mt-0.5 font-heading">
                    Gather your scholars under one banner.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeForm}
                  className="p-2 rounded-sm border-2 border-border text-text-muted hover:bg-bg hover:text-text transition-colors"
                >
                  <XIcon size={20} weight="bold" />
                </button>
              </div>
              <CommunityForm onCreated={closeForm} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MyCommunities;
