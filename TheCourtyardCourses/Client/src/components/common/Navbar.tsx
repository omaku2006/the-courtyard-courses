import { ListIcon, XIcon, SunIcon, MoonIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toggleTheme } from '../../features/themes/themeSlice';
import { Link, NavLink } from 'react-router-dom';
import { useFetchMyProfile } from '../../features/auth/useAuth';
import LoadingPage from '../../pages/system/LoadingPage';
import ServerErrorPage from '../../pages/system/ServerErrorPage';

// ✅ Fix & Polish: Reusable Navlink component for cleaner code
// ✅ Polished NavTab with Stronger Hover & Active States
const NavTab = ({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) => (
  <li className="w-full md:w-auto text-center">
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `relative block px-4 py-2 font-heading text-sm uppercase tracking-widest transition-all duration-300 group rounded-sm ${
          isActive
            ? 'bg-surface text-primary border-b-2 border-accent' // ✅ Active: Gold text, light bg, gold bottom border
            : 'text-text hover:text-primary hover:bg-surface/50 border-b-2 border-transparent' // ✅ Hover: Gold text, subtle bg
        }`
      }
    >
      {({ isActive }) => (
        <>
          {label}
          {/* Animated Underline (Runs on Hover) */}
          <span
            className={`absolute bottom-0 left-1/2 h-[2px] bg-primary -translate-x-1/2 transition-all duration-300 ease-in-out ${
              isActive
                ? 'w-full opacity-100'
                : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
            }`}
          />
        </>
      )}
    </NavLink>
  </li>
);

const Navbar = () => {
  const { data, isError, isLoading } = useFetchMyProfile();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const theme = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();

  if (isLoading) return <LoadingPage />;
  if (isError) return <ServerErrorPage />;

  // ✅ Fix: Initials array comma bug fixed
  const getInitials = (name: string) => {
    return (
      name
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2) || '?'
    );
  };

  return (
    <nav className="sticky bg-bg top-0 z-50 w-full bg-background border-b-2 border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center h-20">
        {/* Left Side: Hamburger (Mobile) + Logo */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 text-text hover:text-primary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <XIcon size={24} weight="bold" /> : <ListIcon size={24} weight="bold" />}
          </button>

          <Link to="/">
            <img
              src={
                theme === 'dark'
                  ? '/TheCourtyardCourses(Dark).Plain.Stroke.svg'
                  : '/TheCourtyardCourses(Light).Stroke.Plain.svg'
              }
              alt="The Courtyard Courses"
              className="h-12 md:h-16 object-contain"
            />
          </Link>
        </div>

        {/* Center: Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-2">
            <NavTab to="/" label="Home" />
            <NavTab to="/courses" label="Courses" />
            {data?.user && <NavTab to="/dashboard" label="Dashboard" />}
            <NavTab to="/communities" label="Communities" />
            <NavTab to="/about" label="About Us" />
          </ul>
        </div>

        {/* Right Side: Theme Toggle + Auth */}
        <div className="flex items-center gap-3">
          <button
            className="p-2 text-text hover:text-primary transition-colors"
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <MoonIcon size={24} weight="fill" />
            ) : (
              <SunIcon size={24} weight="fill" />
            )}
          </button>

          {data?.user ? (
            <Link
              to="/dashboard/me"
              className="h-10 w-10 flex items-center justify-center border-2 border-primary text-primary font-heading text-sm hover:bg-primary hover:text-background transition-colors rounded-sm"
              title={data.user.name}
            >
              {getInitials(data.user.name)}
            </Link>
          ) : (
            <Link to="/login" className="btnPrimary hidden sm:block">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer (Slides down) */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full h-[calc(100vh-5rem)] bg-surface border-t-2 border-border flex flex-col items-center justify-center gap-6 animate-slide-down">
          <ul className="flex flex-col items-center gap-4 w-full px-4">
            <NavTab to="/" label="Home" onClick={() => setIsOpen(false)} />
            <NavTab to="/courses" label="Courses" onClick={() => setIsOpen(false)} />
            {data?.user && (
              <NavTab to="/dashboard" label="Dashboard" onClick={() => setIsOpen(false)} />
            )}
            <NavTab to="/communities" label="Communities" onClick={() => setIsOpen(false)} />
            <NavTab to="/about" label="About Us" onClick={() => setIsOpen(false)} />
          </ul>

          {!data?.user && (
            <Link
              to="/login"
              className="btnPrimary w-3/4 text-center"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
