import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

const FacultyCard = ({ children }: { children: ReactNode }) => {
  return (
    <div className="teacherCard flex flex-col items-center justify-center bg-surface px-8 pb-8">
      {children}
    </div>
  );
};

FacultyCard.Avatar = ({ name }: { name: string }) => {
  return (
    <div className="rounded-b-full p-12 bg-accent">
      <h2>{name.charAt(0).toUpperCase()}</h2>
    </div>
  );
};

FacultyCard.Name = ({ name }: { name: string }) => {
  return <h3 className="text-center">{name}</h3>;
};

FacultyCard.Designation = ({ designation }: { designation: string }) => {
  return <h6>{designation}</h6>;
};

FacultyCard.Bio = ({ children }: { children: ReactNode }) => {
  return <p className="text-justify">{children}</p>;
};

FacultyCard.Button = ({ username }: { username?: string }) => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => username && navigate(`/u/${username}`)}
      className="rounded-[2px] btnPrimary w-full"
    >
      View Profile
    </button>
  );
};

export default FacultyCard;
