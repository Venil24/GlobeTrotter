import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function TripListingScreen() {
  const { trips, navigateTo, deleteTrip } = useContext(AppContext);
  const [filter, setFilter] = useState('All'); // All, Leisure, Business

  // Safe date formatter for YYYY-MM-DD strings
  const formatDateStr = (dateStr?: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    if (!y || !m || !d) return dateStr;
    const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    return dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Classify trips based on dates
  const getTripStatus = (trip: any) => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (trip.endDate && trip.endDate < todayStr) return 'Completed';
    if (trip.startDate && trip.startDate > todayStr) return 'Upcoming';
    return 'Ongoing';
  };

  const filteredTrips = trips.filter(trip => {
    if (filter === 'All') return true;
    return trip.category === filter;
  });

  const ongoingTrips = filteredTrips.filter(t => getTripStatus(t) === 'Ongoing');
  const upcomingTrips = filteredTrips.filter(t => getTripStatus(t) === 'Upcoming');
  const completedTrips = filteredTrips.filter(t => getTripStatus(t) === 'Completed');

  const handleDeleteTrip = (tripId: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteTrip(tripId);
    }
  };

  const renderTripCard = (trip: any, status: string) => {
    const isCompleted = status === 'Completed';
    return (
      <article 
        key={trip.id}
        className={`glass-panel rounded-xl overflow-hidden flex flex-col md:flex-row hover:shadow-[0_12px_32px_rgba(15,23,42,0.12)] transition-all duration-300 bg-surface-container-lowest border border-outline-variant/30 ${
          isCompleted ? 'opacity-85' : ''
        }`}
      >
        <div className="w-full md:w-1/3 lg:w-1/4 h-48 md:h-auto relative shrink-0">
          <img 
            className="w-full h-full object-cover absolute inset-0" 
            alt={trip.title} 
            src={trip.image}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop';
            }}
          />
        </div>
        <div className="p-6 flex flex-col justify-between flex-grow">
          <div>
            <div className="flex justify-between items-start mb-2 gap-4">
              <h3 className="text-headline-md font-headline-md text-on-surface line-clamp-1">{trip.title}</h3>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-label-sm font-label-sm flex items-center gap-1 ${
                  status === 'Ongoing' 
                    ? 'bg-primary-container text-on-primary-container' 
                    : status === 'Upcoming' 
                      ? 'bg-secondary-container text-on-secondary-container' 
                      : 'bg-surface-container text-on-surface-variant'
                }`}>
                  <span className="material-symbols-outlined text-[14px]">
                    {status === 'Ongoing' ? 'flight_takeoff' : status === 'Upcoming' ? 'schedule' : 'check_circle'}
                  </span>
                  {status}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-tertiary-container text-on-tertiary-container">
                  {trip.category}
                </span>
              </div>
            </div>
            <p className="text-label-md font-label-md text-on-surface-variant mb-4 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span> 
              {formatDateStr(trip.startDate)} - {formatDateStr(trip.endDate)}
            </p>
            <p className="text-body-md font-body-md text-on-surface-variant line-clamp-2">
              {(() => {
                const loggedSpent = trip.expenses ? trip.expenses.reduce((sum: number, e: any) => sum + (e.amount || 0), 0) : 0;
                const actSpent = (trip.itinerary || []).reduce((s: number, d: any) => s + (d.activities || []).reduce((as: number, a: any) => as + (a.cost || 0), 0), 0);
                const totalTripSpent = loggedSpent + actSpent;
                const totalItemCount = (trip.expenses?.length || 0) + (trip.itinerary || []).reduce((s: number, d: any) => s + (d.activities?.length || 0), 0);
                return `Trip to ${trip.destination} with ${trip.travelers || 1} traveler${(trip.travelers || 1) > 1 ? 's' : ''}. Planned budget is ₹${(trip.budget || 0).toLocaleString('en-IN')}. ` +
                  (totalTripSpent > 0 ? `Spent ₹${totalTripSpent.toLocaleString('en-IN')} across ${totalItemCount} planned activities & expenses.` : ' No expenses logged yet.');
              })()}
            </p>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <button 
              onClick={() => handleDeleteTrip(trip.id, trip.title)}
              className="text-error text-label-md hover:underline flex items-center gap-1 bg-transparent border-none cursor-pointer"
              title="Delete Trip"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
              Delete
            </button>
            <div className="flex gap-2">
              <button 
                onClick={() => navigateTo('build-itinerary', trip.id)}
                className="px-4 py-2 bg-surface-container-lowest text-on-surface border border-outline-variant rounded-lg text-label-md font-label-md hover:bg-surface-variant/50 transition-colors cursor-pointer"
              >
                Itinerary Builder
              </button>
              <button 
                onClick={() => navigateTo('view-itinerary', trip.id)}
                className="px-6 py-2 bg-primary text-on-primary rounded-lg text-label-md font-label-md hover:bg-primary-container transition-colors shadow-sm cursor-pointer border-none"
              >
                View Dashboard
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="flex-grow max-w-container-max-width w-full mx-auto px-margin-mobile md:px-margin-desktop py-12">
      <header className="flex flex-col gap-6 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-display-lg font-display-lg text-on-surface mb-2">My Trips</h1>
            <p className="text-body-md font-body-md text-on-surface-variant">View, plan, and analyze your custom itineraries.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-label-md font-medium text-on-surface-variant">Filter Category:</span>
            <div className="flex rounded-lg border border-outline-variant bg-surface-container-lowest p-1">
              {['All', 'Leisure', 'Business'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-1.5 rounded-md text-label-md font-medium transition-all border-none cursor-pointer ${
                    filter === cat 
                      ? 'bg-primary text-on-primary shadow-sm' 
                      : 'text-on-surface-variant hover:text-on-surface bg-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-12">
        {/* Ongoing Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
            <h2 className="text-headline-md font-headline-md text-on-surface">Ongoing Trips</h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {ongoingTrips.map(t => renderTripCard(t, 'Ongoing'))}
            {ongoingTrips.length === 0 && (
              <div className="text-center py-8 border border-dashed border-outline-variant/50 rounded-xl text-on-surface-variant bg-surface-container-low/20">
                No active ongoing trips.
              </div>
            )}
          </div>
        </section>

        {/* Upcoming Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-outline"></div>
            <h2 className="text-headline-md font-headline-md text-on-surface">Upcoming Trips</h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {upcomingTrips.map(t => renderTripCard(t, 'Upcoming'))}
            {upcomingTrips.length === 0 && (
              <div className="text-center py-8 border border-dashed border-outline-variant/50 rounded-xl text-on-surface-variant bg-surface-container-low/20">
                No upcoming trips planned. Click the "+ Plan a Trip" button to create one.
              </div>
            )}
          </div>
        </section>

        {/* Completed Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-surface-variant"></div>
            <h2 className="text-headline-md font-headline-md text-on-surface">Completed Journeys</h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {completedTrips.map(t => renderTripCard(t, 'Completed'))}
            {completedTrips.length === 0 && (
              <div className="text-center py-8 border border-dashed border-outline-variant/50 rounded-xl text-on-surface-variant bg-surface-container-low/20">
                No completed journeys yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
