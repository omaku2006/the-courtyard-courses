import type { Course, Creator } from '../../types/FetchDataTypes';
import { imageUrl } from '../../utils/imageUrl';
import HrWrapper from '../ui/HrWrapper';

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
};

const CourseTeacher = ({ course }: { course: Course }) => {
  const creator = course.creator as Creator | string;
  if (typeof creator !== 'object' || creator === null) return null;

  const avatar = imageUrl(creator.avatarImage);

  return (
    <div id="courseTeacher" className="bg-surface p-4">
      <div className="topPart flex gap-5">
        <div className="avatar">
          {avatar ? (
            <img
              src={avatar}
              alt={creator.name}
              className="block w-20 h-20 object-cover object-center"
            />
          ) : (
            <p className="w-20 h-20 flex items-center justify-center">
              {getInitials(creator.name)}
            </p>
          )}
        </div>
        <div className="info flex flex-col justify-center relative overflow-x-hidden">
          <h5 className="min-w-0 truncate">{creator.name}</h5>
          <h6>{creator.username}</h6>
        </div>
        {/*creator.occupation && (
          <div className="occupation ml-auto self-center bg-bg px-4 py-2 max-w-45 overflow-x-hidden">
            <h6 className="min-w-0 truncate">{creator.occupation}</h6>
          </div>
        )*/}
      </div>
      <HrWrapper name="⚜" />
      <div className="description overflow-y-scroll scroll-smooth hide-scrollbar">
        <p className="text-justify">{creator.description}</p>
      </div>
    </div>
  );
};

export default CourseTeacher;
