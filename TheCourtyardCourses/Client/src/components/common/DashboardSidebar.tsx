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
import { NavLink } from 'react-router-dom';

const DashboardSidebar = () => {
  const theme = useAppSelector((state) => state.theme.mode);
  const user = localStorage.getItem('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  return (
    <nav
      className="w-32 h-screen sticky top-0 bg-surface z-5 "
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div
        className={`relative p-4 bg-surface h-screen overflow-hidden border-r-3 border-r-accent-hover transition-all duration-500 ${isCollapsed ? 'w-32' : 'w-91'}`}
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
        <div className="middlePart overflow-y-scroll relative contents">
          <NavLink
            to={'/dashboard'}
            className={({ isActive }) =>
              `h-21 ${isActive ? 'bg-bg' : ''} grid items-center grid-cols-[auto_1fr] overflow-hidden rounded-[2px]`
            }
          >
            <DotsNineIcon size={48} weight="fill" className="mx-6 my-4" />
            <h5 className="italic text-nowrap">Dashboard</h5>
          </NavLink>
          <NavLink
            to={'/dashboard/my-courses'}
            className={({ isActive }) =>
              `h-21 ${isActive ? 'bg-bg' : ''} grid items-center grid-cols-[auto_1fr] overflow-hidden rounded-[2px]`
            }
          >
            <BookBookmarkIcon size={48} weight="fill" className="mx-6 my-4" />
            <h5 className="italic text-nowrap">My Courses</h5>
          </NavLink>
          <NavLink
            to={'/dashboard/courses'}
            className={({ isActive }) =>
              `h-21 ${isActive ? 'bg-bg' : ''} grid items-center grid-cols-[auto_1fr] overflow-hidden rounded-[2px]`
            }
          >
            <BooksIcon size={48} weight="fill" className="mx-6 my-4" />
            <h5 className="italic text-nowrap">Courses</h5>
          </NavLink>
          <NavLink
            to={'/dashboard/communities'}
            className={({ isActive }) =>
              `h-21 ${isActive ? 'bg-bg' : ''} grid items-center grid-cols-[auto_1fr] overflow-hidden rounded-[2px]`
            }
          >
            <UsersThreeIcon size={48} weight="fill" className="mx-6 my-4" />
            <h5 className="italic text-nowrap">Communities</h5>
          </NavLink>
          <NavLink
            to={'/dashboard/schedule'}
            className={({ isActive }) =>
              `h-21 ${isActive ? 'bg-bg' : ''} grid items-center grid-cols-[auto_1fr] overflow-hidden rounded-[2px]`
            }
          >
            <CalendarDotsIcon size={48} weight="fill" className="mx-6 my-4" />
            <h5 className="italic text-nowrap">Schedule</h5>
          </NavLink>
          <NavLink
            to={'/dashboard/analysis'}
            className={({ isActive }) =>
              `h-21 ${isActive ? 'bg-bg' : ''} grid items-center grid-cols-[auto_1fr] overflow-hidden rounded-[2px]`
            }
          >
            <ChartLineIcon size={48} weight="fill" className="mx-6 my-4" />
            <h5 className="italic text-nowrap">Analysis</h5>
          </NavLink>
        </div>
        <div className="bottomPart"></div>
      </div>
    </nav>
  );
};

export default DashboardSidebar;
