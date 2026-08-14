import {
  BookBookmarkIcon,
  CalendarDotsIcon,
  ChartLineIcon,
  DotsNineIcon,
  UsersThreeIcon,
  BooksIcon,
  type Icon,
  ListIcon,
} from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';

type MenuTab = {
  name: string;
  icon: Icon;
  to: string;
}[];

const DashboardBottomNav = ({ className }: { className: string }) => {
  const [tabRender, setTabRender] = useState<number>(0);
  const [otherTabsOpen, setOtherTabsOpen] = useState<boolean>(false);

  const menuTabs: MenuTab = [
    { name: 'Dashboard', icon: DotsNineIcon, to: '/dashboard' },
    { name: 'My Courses', icon: BookBookmarkIcon, to: '/my-courses' },
    { name: 'Communities', icon: UsersThreeIcon, to: '/communities' },
    { name: 'Courses', icon: BooksIcon, to: '/courses' },
    { name: 'Schedule', icon: CalendarDotsIcon, to: '/schedule' },
    { name: 'Analysis', icon: ChartLineIcon, to: '/analysis' },
  ];

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setTabRender(Math.floor(width / 130));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <nav
      className={`bg-surface w-screen h-20 sticky bottom-0 z-5 flex justify-evenly ${className}`}
    >
      {menuTabs.slice(0, tabRender).map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            to={item.to}
            key={item.name}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center px-2  ${isActive && 'bg-bg border border-accent'}`
            }
          >
            <Icon className="w-10" weight="fill" />
            <h6>{item.name}</h6>
          </NavLink>
        );
      })}
      <div
        className="menu group relative flex flex-col items-center justify-center p-2"
        onClick={() => {
          setOtherTabsOpen(!otherTabsOpen);
        }}
      >
        <ListIcon className="w-10" weight="fill" />
        <h6>Other Tabs</h6>
        <AnimatePresence>
          {otherTabsOpen && (
            <motion.div
              className="otherTabs absolute bottom-21 right-1 bg-surface p-4 border-2 border-accent"
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {menuTabs.slice(tabRender, menuTabs.length + 1).map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.05 * index, ease: 'easeOut' }}
                  >
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `flex flex-col items-center justify-center px-2  ${isActive && 'bg-bg border border-accent'}`
                      }
                    >
                      <Icon className="w-10" weight="fill" />
                      <h6>{item.name}</h6>
                    </NavLink>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default DashboardBottomNav;
