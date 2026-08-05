import { ListIcon, XIcon, SunIcon, MoonIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toggleTheme } from '../../features/themes/themeSlice';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const theme = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();

  return (
    <>
      <nav className="relative h-28 border-2 border-accent flex justify-between md:justify-evenly items-center z-10">
        <div
          id="hamburger"
          className="menu md:hidden absolute top-1/2 -translate-y-1/2 p-2 sm:px-2 md:px-5"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ListIcon />
        </div>
        <div id="navLeft" className="md:m-0 md:mx-0 ml-10">
          {theme === 'dark' ? (
            <img
              src="../src/assets/TheCourtyardCourses(Dark).Plain.Stroke.svg"
              alt="The Courtyard Courses"
              className="h-24 m-2"
            />
          ) : (
            <img
              src="../src/assets/TheCourtyardCourses(Light).Stroke.Plain.svg"
              alt="The Courtyard Courses"
              className="h-24 m-2"
            />
          )}
        </div>
        <div
          id="navMiddle"
          className={`absolute top-0 ${isOpen ? 'right-0' : 'right-full'}  transition-all duration-500 flex justify-center items-center md:right-0 md:relative md:h-fit md:w-fit h-[100vh] w-full`}
        >
          <ul className="tabContainer flex flex-col items-center justify-center h-full w-full gap-3 md:gap-0 absolute left-0 top-0 bg-surface md:bg-transparent md:relative md:flex-row md:h-fit md:w-fit lg:gap-6 ">
            <li className="menu md:hidden absolute left-5 top-5" onClick={() => setIsOpen(!isOpen)}>
              <XIcon />
            </li>
            <li className="tabs relative group font-heading w-full md:w-32 text-center hover:bg-surface duration-300 transition-all">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block w-full h-full p-2 duration-300 transition-all ${isActive ? 'bg-surface' : ''}`
                }
              >
                Home
              </NavLink>
              <span
                className="absolute bottom-0 left-1/2 w-0 h-0.5
                   bg-accent -translate-x-1/2
                   group-hover:w-full
                   transition-all duration-500 ease-in-out"
              />
            </li>
            <li className="tabs relative group font-heading w-full md:w-32 text-center hover:bg-surface duration-300 transition-all">
              <NavLink
                to="/courses"
                className={({ isActive }) =>
                  `block w-full h-full p-2 duration-300 transition-all ${isActive ? 'bg-surface' : ''}`
                }
              >
                Courses
              </NavLink>
              <span
                className="absolute bottom-0 left-1/2 w-0 h-0.5
                   bg-accent -translate-x-1/2
                   group-hover:w-full
                   transition-all duration-500 ease-in-out"
              />
            </li>
            <li className="tabs relative group font-heading w-full md:w-32 text-center hover:bg-surface duration-300 transition-all max-[860px]:hidden">
              <NavLink
                to="/communities"
                className={({ isActive }) =>
                  `block w-full h-full p-2 duration-300 transition-all ${isActive ? 'bg-surface' : ''}`
                }
              >
                Communities
              </NavLink>
              <span
                className="absolute bottom-0 left-1/2 w-0 h-0.5
                   bg-accent -translate-x-1/2
                   group-hover:w-full
                   transition-all duration-500 ease-in-out"
              />
            </li>
            <li className="tabs relative group font-heading w-full md:w-32 text-center hover:bg-surface duration-300 transition-all">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `block w-full h-full p-2 duration-300 transition-all ${isActive ? 'bg-surface' : ''}`
                }
              >
                About Us
              </NavLink>
              <span
                className="absolute bottom-0 left-1/2 w-0 h-0.5
                   bg-accent -translate-x-1/2
                   group-hover:w-full
                   transition-all duration-500 ease-in-out"
              />
            </li>
          </ul>
        </div>
        <div id="navRight" className="md:m-0 lg:mx-10 md:mx-5 mx-3 flex items-center">
          <button
            className="btnSecondary m-3 lg:flex items-center lg:visible hidden"
            onClick={() => {
              dispatch(toggleTheme());
            }}
          >
            {theme === 'dark' ? <MoonIcon weight="fill" /> : <SunIcon weight="fill" />} &nbsp;
            &nbsp;
            {theme === 'dark' ? 'Dark' : 'Light'}
          </button>
          <button
            className="btnSecondary m-3 flex items-center justify-center visible lg:hidden"
            onClick={() => {
              dispatch(toggleTheme());
            }}
          >
            {theme === 'dark' ? <MoonIcon weight="fill" /> : <SunIcon weight="fill" />}
          </button>
          <Link to="/login" className="btnPrimary">
            Login
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
