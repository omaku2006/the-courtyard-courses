import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/common/DashboardSidebar';
import Footer from '../components/common/Footer';
import DashboardBottomNav from './DashboardBottomNav';

const DashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-[100dvh] pb-20 min-[512px]:pb-0">
      <div className="flex flex-1 max-[512px]:flex-col-reverse w-full min-w-0">
        <div className="sidebar max-[512px]:hidden">
          <DashboardSidebar />
        </div>
        <DashboardBottomNav className="min-[512px]:hidden" />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
