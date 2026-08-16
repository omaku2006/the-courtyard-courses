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
    { name: 'My Courses', icon: BookBookmarkIcon, to: '/dashboard/my-courses' }, // Added /dashboard prefix
    { name: 'Communities', icon: UsersThreeIcon, to: '/dashboard/communities' },
    { name: 'Courses', icon: BooksIcon, to: '/dashboard/courses' },
    { name: 'Schedule', icon: CalendarDotsIcon, to: '/dashboard/schedule' },
    { name: 'Analysis', icon: ChartLineIcon, to: '/dashboard/analysis' },
  ];

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // Calculate how many tabs fit (leaving space for "Other" button)
      setTabRender(Math.max(2, Math.floor(width / 110)));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    // ✅ Fix: z-5 -> z-50, w-screen -> w-full, added top border
    <nav
      className={`bg-surface w-full h-20 fixed bottom-0 left-0 right-0 z-50 flex justify-evenly items-center border-t-2 border-border shadow-[0_-4px_0_var(--color-border)] ${className}`}
    >
      {/* Main Tabs */}
      {menuTabs.slice(0, tabRender).map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            to={item.to}
            key={item.name}
            className={({ isActive }) =>
              // ✅ Polish: Active state Gold text & top border
              `flex flex-col items-center justify-center gap-1 px-2 py-1 transition-colors rounded-sm w-16 ${
                isActive ? 'text-primary border-t-2 border-primary' : 'text-text hover:text-primary'
              }`
            }
          >
            <Icon size={24} weight="fill" />
            <span
              className="font-heading uppercase tracking-wider text-nowrap"
              style={{ fontSize: '10px' }}
            >
              {item.name}
            </span>
          </NavLink>
        );
      })}

      {/* Other Tabs Button */}
      <div
        className="relative flex flex-col items-center justify-center gap-1 px-2 py-1 cursor-pointer text-text hover:text-primary transition-colors w-16"
        onClick={() => setOtherTabsOpen(!otherTabsOpen)}
      >
        <ListIcon size={24} weight="fill" />
        <span className="font-heading uppercase tracking-wider" style={{ fontSize: '10px' }}>
          More
        </span>

        {/* Popover Menu */}
        <AnimatePresence>
          {otherTabsOpen && (
            <motion.div
              // ✅ Fix: bottom-21 -> bottom-full (Nav na upar pop thai), added theme & shadow
              className="absolute bottom-full right-0 mb-2 bg-surface p-2 border-2 border-border shadow-[4px_4px_0_var(--color-border)] rounded-sm flex flex-col gap-1 w-36"
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {menuTabs.slice(tabRender).map((item, index) => {
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
                      onClick={() => setOtherTabsOpen(false)} // ✅ Fix: Click thay etle menu close thay
                      className={({ isActive }) =>
                        `flex items-center justify-start gap-2 px-3 py-2 rounded-sm transition-colors ${
                          isActive ? 'bg-background text-primary' : 'text-text hover:bg-background'
                        }`
                      }
                    >
                      <Icon size={20} weight="fill" />
                      <span
                        className="text-[10px] font-heading uppercase tracking-wider"
                        style={{ fontSize: '10px' }}
                      >
                        {item.name}
                      </span>
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
