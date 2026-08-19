import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import { useAppSelector } from './app/hooks';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/auth/AuthPage';
import { Toaster } from 'sonner';
import { useAutoHideScrollbar } from './hooks/useScrollbar';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import NotFoundPage from './pages/system/NotFoundPage';
import FetchMe from './pages/FetchMe';
import RequireAuth from './pages/auth/RequireAuth';
import MyCourses from './pages/MyCourses';
import ViewCourse from './components/course/ViewCourse';
import CourtyardBackground from './components/ui/CourtyardBackground';
import PublicCoursePage from './pages/PublicCoursePage';
import PublicProfilePage from './pages/PublicProfilePage';
import CommunityPage from './pages/CommunityPage';
import CommunityDetails from './pages/CommunityDetails';
import CommunityChat from './components/community/CommunityChat';
import PublicCommunityPage from './pages/PublicCommunityPage';
import SchedulePage from './pages/SchedulePage';
import AnalysisPage from './pages/AnalysisPage';

const App = () => {
  useAutoHideScrollbar();
  const theme = useAppSelector((state) => state.theme.mode);
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.setAttribute('data-theme', '');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <main>
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<PublicCoursePage />} />
            <Route path="/communities" element={<PublicCommunityPage />} />
            <Route path="/user/:username" element={<PublicProfilePage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/background" element={<CourtyardBackground />} />
          </Route>

          {/* Dashboard */}
          <Route element={<RequireAuth />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<HomePage />} />
              <Route path="/dashboard/me" element={<FetchMe />} />
              <Route path="/dashboard/courses" element={<PublicCoursePage />} />
              <Route path="/dashboard/my-courses" element={<MyCourses />} />
              <Route path="/dashboard/:slug" element={<ViewCourse />} />
              <Route path="/dashboard/users/:username" element={<PublicProfilePage />} />
              <Route path="/dashboard/communities" element={<CommunityPage />} />
              <Route path="/dashboard/communities/:slug/details" element={<CommunityDetails />} />
              <Route path="/dashboard/communities/:slug" element={<CommunityChat />} />
              <Route path="/dashboard/schedule" element={<SchedulePage />} />
              <Route path="/dashboard/analysis" element={<AnalysisPage />} />
            </Route>
          </Route>
          {/*No Layout*/}
          <Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </main>
      <Toaster
        position="top-right"
        richColors={false}
        className="z-50"
        toastOptions={{
          classNames: {
            toast: 'victorian-toast',
            success: 'toast-success',
            error: 'toast-error',
            warning: 'toast-warning',
            info: 'toast-info',
          },
        }}
      />
    </BrowserRouter>
  );
};

export default App;
