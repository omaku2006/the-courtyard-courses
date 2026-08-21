import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

const FacultyCard = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      className="flex flex-col items-center bg-surface px-8 pb-8 border-2 border-border rounded-[4px]"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

FacultyCard.Avatar = ({ name, imageUrl }: { name: string; imageUrl?: string | null }) => {
  return (
    <motion.div
      className="w-40 h-44 rounded-b-full overflow-hidden bg-accent border-2 border-border border-t-0 mx-auto -mt-px"
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span
          className="no-margin flex items-end justify-center w-full h-full font-heading font-bold text-light pb-5"
          style={{ fontSize: '3rem' }}
        >
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </motion.div>
  );
};

FacultyCard.Name = ({ name }: { name: string }) => {
  return (
    <h3
      className="no-margin text-center font-heading font-bold uppercase tracking-wider mt-5"
      style={{ fontSize: '1.125rem' }}
    >
      {name}
    </h3>
  );
};

FacultyCard.Designation = ({ designation }: { designation: string }) => {
  return (
    <h6
      className="no-margin text-center font-heading font-semibold uppercase tracking-widest mt-2"
      style={{ fontSize: '0.6875rem' }}
    >
      {designation}
    </h6>
  );
};

FacultyCard.Bio = ({ children }: { children: ReactNode }) => {
  return (
    <p
      className="no-margin font-body italic text-justify max-h-36 overflow-y-auto hide-scrollbar leading-relaxed mt-5"
      style={{ fontSize: '0.75rem' }}
    >
      {children}
    </p>
  );
};

FacultyCard.Button = ({ username }: { username?: string }) => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => username && navigate(`/user/${username}`)}
      className="btnPrimary w-full mt-6 px-4! py-2.5! text-xs!"
    >
      View Profile
    </button>
  );
};

export default FacultyCard;
