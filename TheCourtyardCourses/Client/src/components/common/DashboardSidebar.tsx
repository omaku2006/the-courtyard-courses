import { useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import HrWrapper from '../ui/HrWrapper';
import {
  BookBookmarkIcon,
  BooksIcon,
  CalendarDotsIcon,
  ChartLineIcon,
  DotsNineIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react';
import { Link, NavLink } from 'react-router-dom';
import LoadingPage from '../../pages/system/LoadingPage';
import ServerErrorPage from '../../pages/system/ServerErrorPage';
import { useFetchMyProfile } from '../../features/auth/useAuth';
import { imageUrl } from '../../utils/imageUrl';

const DashboardSidebar = () => {
  const theme = useAppSelector((state) => state.theme.mode);
  const { data, isError, isLoading } = useFetchMyProfile();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ServerErrorPage />;
  }

  return (
    <nav
      className="w-32 h-screen sticky top-0 bg-surface z-5 "
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div
        className={`relative p-4 bg-surface h-screen overflow-hidden flex flex-col border-r-3 border-r-accent-hover transition-all duration-500 ${isCollapsed ? 'w-32' : 'w-91'}`}
      >
        <div className="topPart flex items-center gap-5">
          <div className="logo shrink-0">
            {theme === 'dark' ? (
              <img
                src="/TheCourtyardCourses(Dark).Plain.Stroke.svg"
                alt="TheCourtyardCourses"
                className="w-24"
              />
            ) : (
              <img
                src="/TheCourtyardCourses(Light).Stroke.Plain.svg"
                alt="TheCourtyardCourses"
                className="w-24"
              />
            )}
          </div>
          <div className="brandName">
            <h3>The Courtyard Courses</h3>
          </div>
        </div>
        <HrWrapper name="⚜" />
        <div className="middlePart overflow-y-scroll relative flex flex-col items-stretch w-full hide-scrollbar h-130">
          <NavLink
            to={'/dashboard'}
            end
            className={({ isActive }) =>
              `h-21 ${isActive ? 'bg-bg' : ''} grid items-center grid-cols-[auto_1fr] overflow-hidden rounded-[2px] min-h-21`
            }
          >
            <DotsNineIcon size={48} weight="fill" className="mx-6 my-4" />
            <h5 className="italic text-nowrap">Dashboard</h5>
          </NavLink>
          <NavLink
            to={'/dashboard/my-courses'}
            className={({ isActive }) =>
              `h-21 ${isActive ? 'bg-bg' : ''} grid items-center grid-cols-[auto_1fr] overflow-hidden rounded-[2px] min-h-21`
            }
          >
            <BookBookmarkIcon size={48} weight="fill" className="mx-6 my-4" />
            <h5 className="italic text-nowrap">My Courses</h5>
          </NavLink>
          <NavLink
            to={'/dashboard/courses'}
            className={({ isActive }) =>
              `h-21 ${isActive ? 'bg-bg' : ''} grid items-center grid-cols-[auto_1fr] overflow-hidden rounded-[2px] min-h-21`
            }
          >
            <BooksIcon size={48} weight="fill" className="mx-6 my-4" />
            <h5 className="italic text-nowrap">Courses</h5>
          </NavLink>
          <NavLink
            to={'/dashboard/communities'}
            className={({ isActive }) =>
              `h-21 ${isActive ? 'bg-bg' : ''} grid items-center grid-cols-[auto_1fr] overflow-hidden rounded-[2px] min-h-21`
            }
          >
            <UsersThreeIcon size={48} weight="fill" className="mx-6 my-4" />
            <h5 className="italic text-nowrap">Communities</h5>
          </NavLink>
          {data.user.role === 'student' && (
            <NavLink
              to={'/dashboard/schedule'}
              className={({ isActive }) =>
                `h-21 ${isActive ? 'bg-bg' : ''} grid items-center grid-cols-[auto_1fr] overflow-hidden rounded-[2px] min-h-21`
              }
            >
              <CalendarDotsIcon size={48} weight="fill" className="mx-6 my-4" />
              <h5 className="italic text-nowrap">Schedule</h5>
            </NavLink>
          )}
          <NavLink
            to={'/dashboard/analysis'}
            className={({ isActive }) =>
              `h-21 ${isActive ? 'bg-bg' : ''} grid items-center grid-cols-[auto_1fr] overflow-hidden rounded-[2px] min-h-21`
            }
          >
            <ChartLineIcon size={48} weight="fill" className="mx-6 my-4" />
            <h5 className="italic text-nowrap">Analysis</h5>
          </NavLink>
        </div>
        <div className="bottomPartContainer mt-auto">
          <HrWrapper name="Profile" />
          <div className="bottomPart  flex gap-6">
            <div className="avatar bg-accent min-h-21 max-h-21 min-w-21 ml-1 rounded-[4px] overflow-hidden flex items-center justify-center">
              {imageUrl(data.user.avatarImage) ? (
                <img
                  src={imageUrl(data.user.avatarImage)}
                  alt={data.user.name.charAt(0)}
                  className="block w-full h-full object-cover object-center"
                />
              ) : (
                <h3>
                  {data.user.name.split(' ')[0].charAt(0).toUpperCase()}
                  {data.user.name.split(' ')[1].charAt(0).toUpperCase()}
                </h3>
              )}
            </div>
            <Link to={'/dashboard/me'}>
              <div className="profile w-full p-2 bg-surface hover:brightness-110 cursor-pointer transition-all duration-300">
                <h5 className="text-nowrap">{data.user.name}</h5>
                <h6 className="text-nowrap italic">{data.user.username}</h6>
                <h6 className="text-nowrap bg-bg inline px-3 py-1 rounded-[2px]">
                  {data.user.role === 'student' ? 'Scholar' : 'Tutor'}
                </h6>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardSidebar;
