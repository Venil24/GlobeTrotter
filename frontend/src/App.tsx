import React, { useContext, useEffect } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import TopNavBar from './components/TopNavBar';
import MobileBottomNavBar from './components/MobileBottomNavBar';
import FloatingActionButton from './components/FloatingActionButton';

// Page imports
import LoginScreen from './pages/LoginScreen';
import DashboardScreen from './pages/DashboardScreen';
import TripListingScreen from './pages/TripListingScreen';
import ActivitySearchScreen from './pages/ActivitySearchScreen';
import CreateTripScreen from './pages/CreateTripScreen';
import BuildItineraryScreen from './pages/BuildItineraryScreen';
import ItineraryDetailsScreen from './pages/ItineraryDetailsScreen';
import CommunityScreen from './pages/CommunityScreen';
import CalendarScreen from './pages/CalendarScreen';
import ProfileScreen from './pages/ProfileScreen';
import AdminDashboardScreen from './pages/AdminDashboardScreen';
import SharedTripScreen from './pages/SharedTripScreen';

function AppContent() {
  const { currentRoute, navigateTo } = useContext(AppContext);

  // Check for public share links in query parameters on startup
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedId = params.get('shared');
    if (sharedId) {
      navigateTo('public-view', sharedId);
      // Clean query parameter from URL bar
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Render correct page component
  const renderPage = () => {
    switch (currentRoute) {
      case 'login':
        return <LoginScreen />;
      case 'discover':
        return <DashboardScreen />;
      case 'my-trips':
        return <TripListingScreen />;
      case 'activity-search':
        return <ActivitySearchScreen />;
      case 'create-trip':
        return <CreateTripScreen />;
      case 'build-itinerary':
        return <BuildItineraryScreen />;
      case 'view-itinerary':
        return <ItineraryDetailsScreen />;
      case 'community':
        return <CommunityScreen />;
      case 'calendar':
        return <CalendarScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'admin':
        return <AdminDashboardScreen />;
      case 'public-view':
        return <SharedTripScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  // Login page should occupy full screen with no navbar/footer
  if (currentRoute === 'login') {
    return <LoginScreen />;
  }

  // Admin page has its own sidebar layout
  if (currentRoute === 'admin') {
    return <AdminDashboardScreen />;
  }

  // Public shared read-only trip page doesn't show FAB planning shortcuts
  const isPublicView = currentRoute === 'public-view';

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background antialiased">
      {/* Global Top Nav */}
      <TopNavBar />

      {/* Main Page Area */}
      <main className="flex-grow flex flex-col pt-0 pb-32">
        {renderPage()}
      </main>

      {/* Floating Plus Button for Planning Trips */}
      {!isPublicView && <FloatingActionButton />}

      {/* Mobile Sticky Tab Nav */}
      <MobileBottomNavBar />

      {/* Global Footer (Desktop only) */}
      <footer className="bg-surface-container-highest dark:bg-inverse-surface w-full py-12 px-margin-desktop border-t border-outline-variant shadow-none hidden md:block">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter max-w-container-max-width mx-auto">
          <div className="col-span-1">
            <div className="text-headline-md font-headline-md text-primary font-bold mb-4">GlobeTrotter</div>
            <p className="text-body-md font-body-md text-on-surface-variant">© 2026 GlobeTrotter Premium Travel. All rights reserved.</p>
          </div>
          <div className="col-span-1 md:col-start-3 flex flex-col gap-2">
            <a className="text-body-md font-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Terms &amp; Conditions</a>
            <a className="text-body-md font-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <a className="text-body-md font-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Careers</a>
            <a className="text-body-md font-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Press &amp; Media</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
