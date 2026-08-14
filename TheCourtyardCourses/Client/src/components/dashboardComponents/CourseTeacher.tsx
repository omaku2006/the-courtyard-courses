import { useNavigate } from 'react-router-dom';
import type { Course, Creator } from '../../types/FetchDataTypes';
import { imageUrl } from '../../utils/imageUrl';
import HrWrapper from '../ui/HrWrapper';

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
};

const CourseTeacher = ({ course }: { course: Course }) => {
  const creator = course.creator as Creator | string;
  const navigate = useNavigate();
  // ✅ Fix: Agar creator object nathi to null return karo
  if (typeof creator !== 'object' || creator === null) return null;

  const avatar = imageUrl(creator.avatarImage);

  return (
    <div id="courseTeacher" className="bg-surface p-5 flex flex-col gap-4">
      {/* ✅ Polish: Responsive layout for top part */}
      <div
        className="topPart flex flex-col sm:flex-row items-center sm:items-start gap-4 cursor-pointer"
        onClick={() => {
          navigate(`/dashboard/users/${creator.username}`);
        }}
      >
        {/* Avatar with Victorian Gold Frame */}
        <div className="avatar shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={creator.name}
              className="block w-24 h-24 object-cover object-center border-2 border-primary rounded-sm shadow-sm"
            />
          ) : (
            // ✅ Polish: Fallback initials in a Gold framed box
            <div className="w-24 h-24 flex items-center justify-center border-2 border-primary rounded-sm bg-background font-heading text-3xl text-primary">
              {getInitials(creator.name)}
            </div>
          )}
        </div>

        {/* Info Block */}
        <div className="info flex flex-col justify-center text-center sm:text-left flex-1 min-w-0 gap-1">
          <h5 className="font-heading text-lg text-text truncate m-0">{creator.name}</h5>
          <h6 className="font-body italic text-sm text-text-secondary truncate m-0">
            @{creator.username}
          </h6>

          {/* ✅ Polish: Uncommented & styled Occupation as an engraved badge */}
          {creator.occupation && (
            <div className="occupation mt-2 self-center sm:self-start bg-background border border-border px-3 py-1 max-w-full overflow-hidden">
              <h6 className="font-heading text-[10px] uppercase tracking-widest text-primary truncate m-0">
                {creator.occupation}
              </h6>
            </div>
          )}
        </div>
      </div>

      <HrWrapper name="⚜" />

      {/* ✅ Polish: overflow-scroll -> overflow-y-auto, added fallback text */}
      <div className="description overflow-y-auto hide-scrollbar max-h-40 pr-2">
        <p className="text-justify text-sm text-text-secondary leading-relaxed font-body italic">
          {creator.description ||
            'The master has chosen to remain enigmatic regarding their history and scholarly pursuits.'}
        </p>
      </div>
    </div>
  );
};

export default CourseTeacher;
