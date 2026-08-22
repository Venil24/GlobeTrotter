import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function FloatingActionButton() {
  const { currentRoute, navigateTo } = useContext(AppContext);

  // Hide button on login screen and create-trip screen
  if (currentRoute === 'login' || currentRoute === 'create-trip') return null;

  return (
    <button 
      onClick={() => navigateTo('create-trip')}
      className="fixed bottom-20 md:bottom-8 right-8 bg-primary hover:bg-primary-container text-on-primary rounded-full p-4 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 z-40 flex items-center gap-2 group border-none cursor-pointer"
    >
      <span className="material-symbols-outlined">add</span>
      <span className="text-label-md font-label-md font-semibold pr-2 md:inline-block hidden">Plan a Trip</span>
    </button>
  );
}
