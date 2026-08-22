import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function TopNavBar() {
  const { user, currentRoute, navigateTo, logout } = useContext(AppContext);

  if (currentRoute === 'login') return null;

  const isDiscover = currentRoute === 'discover';
  const isExploreActivities = currentRoute === 'activity-search';
  const isMyTrips = currentRoute === 'my-trips' || currentRoute === 'create-trip' || currentRoute === 'build-itinerary' || currentRoute === 'view-itinerary';
  const isCommunity = currentRoute === 'community';
  const isCalendar = currentRoute === 'calendar';
  const isAdmin = currentRoute === 'admin';
  const isProfile = currentRoute === 'profile';

  return (
    <nav className="bg-surface/80 dark:bg-inverse-surface/80 backdrop-blur-md top-0 sticky z-50 border-b border-outline-variant/30 dark:border-outline/20 shadow-sm transition-all">
      <div className="flex justify-between items-center w-full px-margin-desktop max-w-container-max-width mx-auto h-16">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => navigateTo('discover')} 
            className="text-headline-md font-headline-md font-bold text-primary dark:text-inverse-primary tracking-tight bg-transparent border-none cursor-pointer"
          >
            GlobeTrotter
          </button>
          
          <div className="hidden md:flex gap-6 items-center">
            <button
              onClick={() => navigateTo('discover')}
              className={`pb-1 font-bold text-label-md font-label-md transition-colors duration-200 cursor-pointer bg-transparent border-none ${
                isDiscover 
                  ? 'text-primary dark:text-inverse-primary border-b-2 border-primary dark:border-inverse-primary' 
                  : 'text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary'
              }`}
            >
              Discover
            </button>
            <button
              onClick={() => navigateTo('activity-search')}
              className={`pb-1 font-bold text-label-md font-label-md transition-colors duration-200 cursor-pointer bg-transparent border-none ${
                isExploreActivities 
                  ? 'text-primary dark:text-inverse-primary border-b-2 border-primary dark:border-inverse-primary' 
                  : 'text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary'
              }`}
            >
              Explore Activities
            </button>
            <button
              onClick={() => navigateTo('my-trips')}
              className={`pb-1 font-bold text-label-md font-label-md transition-colors duration-200 cursor-pointer bg-transparent border-none ${
                isMyTrips 
                  ? 'text-primary dark:text-inverse-primary border-b-2 border-primary dark:border-inverse-primary' 
                  : 'text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary'
              }`}
            >
              My Trips
            </button>
            <button
              onClick={() => navigateTo('community')}
              className={`pb-1 font-bold text-label-md font-label-md transition-colors duration-200 cursor-pointer bg-transparent border-none ${
                isCommunity 
                  ? 'text-primary dark:text-inverse-primary border-b-2 border-primary dark:border-inverse-primary' 
                  : 'text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary'
              }`}
            >
              Community
            </button>
            <button
              onClick={() => navigateTo('calendar')}
              className={`pb-1 font-bold text-label-md font-label-md transition-colors duration-200 cursor-pointer bg-transparent border-none ${
                isCalendar 
                  ? 'text-primary dark:text-inverse-primary border-b-2 border-primary dark:border-inverse-primary' 
                  : 'text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary'
              }`}
            >
              Calendar
            </button>
            {user?.role === 'admin' && (
              <button
                onClick={() => navigateTo('admin')}
                className={`pb-1 font-bold text-label-md font-label-md transition-colors duration-200 cursor-pointer bg-transparent border-none ${
                  isAdmin 
                    ? 'text-primary dark:text-inverse-primary border-b-2 border-primary dark:border-inverse-primary' 
                    : 'text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary'
                }`}
              >
                Admin
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigateTo('profile')}
            className="p-2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center relative cursor-pointer bg-transparent border-none"
            title="Profile & Settings"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
          
          <button 
            onClick={() => navigateTo('profile')}
            className={`w-8 h-8 rounded-full overflow-hidden bg-surface-variant cursor-pointer border-2 transition-all ${
              isProfile ? 'border-primary' : 'border-transparent'
            }`}
          >
            <img 
              alt="User avatar" 
              className="w-full h-full object-cover" 
              src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"} 
            />
          </button>
          
          <button
            onClick={logout}
            className="hidden md:flex items-center gap-1 text-label-sm font-semibold text-outline hover:text-error transition-colors px-2 py-1 rounded hover:bg-error-container/20 cursor-pointer bg-transparent border-none"
            title="Log Out"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
