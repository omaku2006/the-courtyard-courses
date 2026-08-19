import { BookOpenIcon, LockSimpleIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

const CommunityLocked = ({ message }: { message?: string }) => {
  return (
    <section className="flex w-full flex-1 flex-col items-center justify-center gap-5 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-[2px] border-2 border-accent bg-accent/10">
        <LockSimpleIcon size={30} weight="fill" className="text-accent" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="m-0 font-heading text-xl text-text">The Gates Remain Sealed</h2>
        <p className="m-0 max-w-md font-body text-sm italic leading-relaxed text-text-muted">
          {message ||
            'This gathering is reserved for enrolled scholars of its attached curriculum.'}
        </p>
      </div>
      <Link to="/courses" className="btnPrimary inline-flex items-center gap-2 py-2! w-fit! text-xs">
        <BookOpenIcon size={16} weight="fill" />
        Browse Courses
      </Link>
    </section>
  );
};

export default CommunityLocked;