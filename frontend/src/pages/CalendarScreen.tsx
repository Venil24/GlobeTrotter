import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Trip } from '../types';

export default function CalendarScreen() {
  const { trips, navigateTo } = useContext(AppContext);
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Calendar math
  const daysCount = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  
  // Previous month padding days
  const prevMonthDaysCount = new Date(year, month, 0).getDate();
  const paddingDays = [];
  for (let i = startDay - 1; i >= 0; i--) {
    paddingDays.push({
      day: prevMonthDaysCount - i,
      isCurrentMonth: false,
      dateStr: null
    });
  }

  // Current month days
  const currentDays = [];
  for (let d = 1; d <= daysCount; d++) {
    const padMonth = String(month + 1).padStart(2, '0');
    const padDay = String(d).padStart(2, '0');
    const dateStr = `${year}-${padMonth}-${padDay}`;
    currentDays.push({
      day: d,
      isCurrentMonth: true,
      dateStr
    });
  }

  const allCells = [...paddingDays, ...currentDays];
  
  // Add trailing padding days to fill 6-week grid (42 cells)
  const remaining = 42 - allCells.length;
  for (let i = 1; i <= remaining; i++) {
    allCells.push({
      day: i,
      isCurrentMonth: false,
      dateStr: null
    });
  }

  // Group cells into weeks (7 days each)
  const weeks = [];
  for (let i = 0; i < allCells.length; i += 7) {
    weeks.push(allCells.slice(i, i + 7));
  }

  // Get matching trips for a date
  const getTripsForDate = (dateStr: string | null): Trip[] => {
    if (!dateStr) return [];
    return trips.filter((t: Trip) => dateStr >= t.startDate && dateStr <= t.endDate);
  };

  const getTripColorClass = (category?: string, status?: string) => {
    if (category === 'Business') return 'bg-tertiary-container text-on-tertiary-container hover:bg-tertiary-container/80';
    if (status === 'Completed') return 'bg-surface-variant text-on-surface-variant hover:bg-surface-variant/80';
    return 'bg-primary-container text-on-primary-container hover:bg-primary-container/80';
  };

  const isToday = (dateStr: string | null) => {
    if (!dateStr) return false;
    const todayStr = new Date().toISOString().split('T')[0];
    return dateStr === todayStr;
  };

  return (
    <div className="flex-grow max-w-container-max-width w-full mx-auto px-margin-mobile md:px-margin-desktop py-12">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-display-lg font-display-lg text-on-surface mb-2">Trip Calendar</h1>
          <p className="text-body-md font-body-md text-on-surface-variant">Track your scheduled travel itineraries on a unified calendar view.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-label-md font-semibold hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            Today
          </button>
        </div>
      </header>

      {/* Calendar Component */}
      <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Calendar Header */}
        <div className="flex justify-between items-center p-6 border-b border-outline-variant/30 bg-surface-container-lowest">
          <button 
            onClick={handlePrevMonth}
            className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant bg-transparent border-none cursor-pointer flex items-center justify-center"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <h2 className="text-headline-md font-bold text-on-surface select-none">
            {monthNames[month]} {year}
          </h2>
          <button 
            onClick={handleNextMonth}
            className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant bg-transparent border-none cursor-pointer flex items-center justify-center"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="flex-grow flex flex-col">
          {/* Days of Week */}
          <div className="grid grid-cols-7 border-b border-outline-variant/30 bg-surface-container-low/50 select-none">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="py-3 text-center text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-7 flex-grow auto-rows-[minmax(120px,1fr)] bg-surface divide-y divide-x divide-outline-variant/20">
            {allCells.map((cell, idx) => {
              const dateTrips = getTripsForDate(cell.dateStr);
              const today = isToday(cell.dateStr);
              return (
                <div 
                  key={idx} 
                  className={`p-2 flex flex-col justify-between hover:bg-surface-container-low/30 transition-all ${
                    cell.isCurrentMonth ? 'text-on-surface' : 'text-on-surface-variant/40 bg-surface-container-low/10'
                  } ${today ? 'bg-primary/5 border-t-2 border-t-primary' : ''}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-body-md font-bold text-sm px-2 py-0.5 rounded-full ${
                      today ? 'bg-primary text-on-primary font-bold' : ''
                    }`}>
                      {cell.day}
                    </span>
                    {today && <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Today</span>}
                  </div>
                  
                  {/* Event list */}
                  <div className="flex-grow flex flex-col justify-end space-y-1 mt-1">
                    {dateTrips.map((trip: Trip) => (
                      <button
                        key={trip.id}
                        onClick={() => navigateTo('view-itinerary', trip.id)}
                        className={`w-full text-left text-xs font-semibold px-2 py-1 rounded transition-colors truncate border-none cursor-pointer shadow-sm ${getTripColorClass(trip.category, trip.status)}`}
                        title={`${trip.title} (${trip.destination})`}
                      >
                        {trip.title}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
