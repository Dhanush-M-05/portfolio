import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CMSProvider } from './context/CMSContext';

// Public Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import BackgroundBlobs from './components/BackgroundBlobs/BackgroundBlobs';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

// Public Pages
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Resume from './pages/Resume';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Admin CMS Components & Pages
import ProtectedRoute from './components/Admin/ProtectedRoute';
import AdminLogin from './pages/Admin/AdminLogin';
import Dashboard from './pages/Admin/Dashboard';
import ManageProfile from './pages/Admin/ManageProfile';
import ManageAbout from './pages/Admin/ManageAbout';
import ManageProjects from './pages/Admin/ManageProjects';
import ManageSkills from './pages/Admin/ManageSkills';
import ManageServices from './pages/Admin/ManageServices';
import ManageExperience from './pages/Admin/ManageExperience';
import ManageEducation from './pages/Admin/ManageEducation';
import ManageCertifications from './pages/Admin/ManageCertifications';
import ManageAchievements from './pages/Admin/ManageAchievements';
import ManageSocialLinks from './pages/Admin/ManageSocialLinks';
import ManageResume from './pages/Admin/ManageResume';
import ManageMessages from './pages/Admin/ManageMessages';
import ManageSettings from './pages/Admin/ManageSettings';
import ManageHero from './pages/Admin/ManageHero';
import ManageNavigation from './pages/Admin/ManageNavigation';
import ManageFooter from './pages/Admin/ManageFooter';
import ManageSections from './pages/Admin/ManageSections';

// Global Styles
import './styles/global.css';
import './styles/admin.css';

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Discreet keyboard shortcut to open Admin Login: Ctrl + Shift + A or Alt + A
  useEffect(() => {
    const handleAdminShortcut = (e) => {
      if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
          (e.altKey && (e.key === 'a' || e.key === 'A'))) {
        e.preventDefault();
        navigate('/admin/login');
      }
    };
    window.addEventListener('keydown', handleAdminShortcut);
    return () => window.removeEventListener('keydown', handleAdminShortcut);
  }, [navigate]);

  return (
    <div className={`portfolio-app-root ${isAdminRoute ? 'is-admin-view' : ''}`}>
      <ScrollToTop />

      {/* Render Public Header and Ambient Blobs only on public routes */}
      {!isAdminRoute && (
        <>
          <BackgroundBlobs />
          <Navbar />
        </>
      )}

      <div className="portfolio-content-outlet">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetails />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Login (Unprotected) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Protected CMS Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute>
                <ManageProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/about"
            element={
              <ProtectedRoute>
                <ManageAbout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute>
                <ManageProjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/skills"
            element={
              <ProtectedRoute>
                <ManageSkills />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute>
                <ManageServices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/experience"
            element={
              <ProtectedRoute>
                <ManageExperience />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/education"
            element={
              <ProtectedRoute>
                <ManageEducation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/certifications"
            element={
              <ProtectedRoute>
                <ManageCertifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/achievements"
            element={
              <ProtectedRoute>
                <ManageAchievements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/social-links"
            element={
              <ProtectedRoute>
                <ManageSocialLinks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/resume"
            element={
              <ProtectedRoute>
                <ManageResume />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <ProtectedRoute>
                <ManageMessages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <ManageSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hero"
            element={
              <ProtectedRoute>
                <ManageHero />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/sections"
            element={
              <ProtectedRoute>
                <ManageSections />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/navigation"
            element={
              <ProtectedRoute>
                <ManageNavigation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/footer"
            element={
              <ProtectedRoute>
                <ManageFooter />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* Render Public Footer only on public routes */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <CMSProvider>
        <AppLayout />
      </CMSProvider>
    </AuthProvider>
  );
}

export default App;
