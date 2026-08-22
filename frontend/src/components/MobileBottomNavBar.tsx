import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function MobileBottomNavBar() {
  const { currentRoute, navigateTo } = useContext(AppContext);

  if (currentRoute === 'login') return null;

  const isDiscover = currentRoute === 'discover' || currentRoute === 'activity-search';
  const isMyTrips = currentRoute === 'my-trips' || currentRoute === 'create-trip' || currentRoute === 'build-itinerary' || currentRoute === 'view-itinerary';
  const isCommunity = currentRoute === 'community';
  const isCalendar = currentRoute === 'calendar';

  return (
    <nav className="bg-surface/90 dark:bg-inverse-surface/90 backdrop-blur-xl fixed bottom-0 w-full rounded-t-xl z-50 border-t border-outline-variant/20 shadow-lg flex justify-around items-center h-16 px-4 md:hidden">
      <button 
        onClick={() => navigateTo('discover')}
        className={`flex flex-col items-center justify-center bg-transparent border-none cursor-pointer active:scale-90 duration-75 ${
          isDiscover ? 'text-primary dark:text-inverse-primary font-bold' : 'text-on-secondary-fixed-variant'
        }`}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isDiscover ? "'FILL' 1" : undefined }}>home</span>
        <span className="text-[10px] font-label-sm mt-1">Discover</span>
      </button>

      <button 
        onClick={() => navigateTo('my-trips')}
        className={`flex flex-col items-center justify-center bg-transparent border-none cursor-pointer active:scale-90 duration-75 ${
          isMyTrips ? 'text-primary dark:text-inverse-primary font-bold' : 'text-on-secondary-fixed-variant'
        }`}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isMyTrips ? "'FILL' 1" : undefined }}>explore</span>
        <span className="text-[10px] font-label-sm mt-1">My Trips</span>
      </button>

      <button 
        onClick={() => navigateTo('community')}
        className={`flex flex-col items-center justify-center bg-transparent border-none cursor-pointer active:scale-90 duration-75 ${
          isCommunity ? 'text-primary dark:text-inverse-primary font-bold' : 'text-on-secondary-fixed-variant'
        }`}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isCommunity ? "'FILL' 1" : undefined }}>forum</span>
        <span className="text-[10px] font-label-sm mt-1">Community</span>
      </button>

      <button 
        onClick={() => navigateTo('calendar')}
        className={`flex flex-col items-center justify-center bg-transparent border-none cursor-pointer active:scale-90 duration-75 ${
          isCalendar ? 'text-primary dark:text-inverse-primary font-bold' : 'text-on-secondary-fixed-variant'
        }`}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isCalendar ? "'FILL' 1" : undefined }}>calendar_month</span>
        <span className="text-[10px] font-label-sm mt-1">Calendar</span>
      </button>
    </nav>
  );
}
