import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function DashboardScreen() {
  const { user, trips, navigateTo } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('activity-search', searchQuery.trim());
    } else {
      navigateTo('activity-search');
    }
  };

  const handleRegionClick = (regionName) => {
    navigateTo('activity-search', regionName);
  };

  // Calculate budget statistics across all trips
  const totalBudget = trips.reduce((sum, t) => sum + (t.budget || 0), 0);
  const totalSpent = trips.reduce((sum, t) => {
    const tripSpent = (t.expenses ? t.expenses.reduce((s, e) => s + (e.amount || 0), 0) : 0) +
      (t.itinerary || []).reduce((s, d) => s + (d.activities || []).reduce((as, a) => as + (a.cost || 0), 0), 0);
    return sum + tripSpent;
  }, 0);
  const spendPercent = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100) : 0;

  return (
    <div className="flex-grow pb-32 bg-background">
      
      {/* Hero Section */}
      <section className="relative w-full h-[550px] md:h-[650px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="bg-cover bg-center w-full h-full scale-105" 
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-container-max-width px-margin-mobile md:px-margin-desktop mx-auto text-center pt-16">
          <h1 className="text-display-lg font-bold text-white drop-shadow-lg mb-6">Discover Your Next Horizon</h1>
          <p className="text-body-lg text-white/90 drop-shadow-md mb-12 max-w-2xl mx-auto">Explore curated experiences, hidden gems, and iconic destinations for the modern traveler.</p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="bg-surface p-2 rounded-xl shadow-lg border border-outline-variant/50 max-w-4xl mx-auto flex flex-col md:flex-row gap-2 items-center">
            <div className="flex-grow flex items-center bg-surface-container-lowest rounded-lg px-4 py-3 w-full border border-outline-variant/30 focus-within:border-primary transition-colors">
              <span className="material-symbols-outlined text-outline mr-3">search</span>
              <input 
                className="w-full bg-transparent border-none focus:ring-0 text-body-md text-on-surface p-0 placeholder:text-outline/70 outline-none" 
                placeholder="Where do you want to go? (e.g. Tokyo, Paris...)" 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <button 
                type="button" 
                onClick={() => navigateTo('activity-search')} 
                className="flex-grow md:flex-none flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-label-md font-semibold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">sort</span>
                Sort
              </button>
              <button 
                type="button" 
                onClick={() => navigateTo('activity-search')} 
                className="flex-grow md:flex-none flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-label-md font-semibold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">filter_list</span>
                Filter
              </button>
              <button 
                type="submit" 
                className="flex-grow md:flex-none bg-primary text-on-primary rounded-lg px-6 py-3 text-label-md font-bold hover:shadow-md hover:bg-primary-container transition-all cursor-pointer border-none"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Greeting and Budget Highlights Panel */}
      <section className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-8 -mt-20 relative z-20">
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 md:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-display-md font-bold text-on-surface">Welcome back, {user?.name || "Explorer"}!</h2>
            <p className="text-body-md text-on-surface-variant">Ready to design your next travel stop? Here is a summary of your premium itineraries.</p>
            <div>
              <button
                onClick={() => navigateTo('create-trip')}
                className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold hover:bg-primary-container transition-all shadow-md cursor-pointer border-none inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                1-Click Auto-Plan Tour
              </button>
            </div>
          </div>
          
          {/* Budget Widget */}
          <div className="bg-surface-container border border-outline-variant/20 rounded-xl p-4 flex items-center gap-4 shrink-0 w-full md:w-auto min-w-[280px]">
            <div className="relative w-16 h-16 rounded-full flex items-center justify-center border-4 border-outline-variant" style={{ background: `conic-gradient(var(--color-primary, #0041c8) ${spendPercent}%, transparent 0)` }}>
              <div className="absolute w-12 h-12 bg-surface rounded-full flex items-center justify-center text-label-sm font-bold text-on-surface">
                {spendPercent}%
              </div>
            </div>
            <div className="flex-grow">
              <span className="text-label-sm text-on-surface-variant uppercase font-bold tracking-wider block mb-1">Budget Overview</span>
              <p className="text-body-md text-on-surface font-semibold">
                Spent: <span className="text-primary">₹{totalSpent.toLocaleString('en-IN')}</span>
              </p>
              <p className="text-label-sm text-on-surface-variant">
                Total Budget: ₹{totalBudget.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Regional Selections */}
      <section className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-headline-lg font-bold text-on-surface mb-2">Top Regional Selections</h2>
            <p className="text-body-md text-on-surface-variant font-medium">Curated destinations for discerning travelers.</p>
          </div>
          <button 
            onClick={() => navigateTo('activity-search')} 
            className="text-primary text-label-md font-semibold hover:underline flex items-center gap-1 bg-transparent border-none cursor-pointer"
          >
            View All <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-6 hide-scrollbar -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0">
          <div 
            onClick={() => handleRegionClick('Amalfi Coast')} 
            className="min-w-[280px] md:min-w-[320px] bg-surface rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
          >
            <div className="h-48 relative overflow-hidden">
              <img 
                alt="Amalfi Coast" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                src="https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop';
                }}
              />
              <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-amber-500 fill-1">star</span>
                <span className="text-label-sm font-semibold text-on-surface">4.9</span>
              </div>
            </div>
            <div className="p-6">
              <p className="text-label-sm font-bold text-primary mb-1 uppercase tracking-wider">Coastal Retreat</p>
              <h3 className="text-headline-md font-bold text-on-surface mb-2">Amalfi Coast, Italy</h3>
              <p className="text-body-md text-on-surface-variant line-clamp-2">Experience the dramatic cliffs and azure waters of the quintessential Italian summer.</p>
            </div>
          </div>

          <div 
            onClick={() => handleRegionClick('Kyoto')} 
            className="min-w-[280px] md:min-w-[320px] bg-surface rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
          >
            <div className="h-48 relative overflow-hidden">
              <img 
                alt="Kyoto" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop';
                }}
              />
              <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-amber-500 fill-1">star</span>
                <span className="text-label-sm font-semibold text-on-surface">4.8</span>
              </div>
            </div>
            <div className="p-6">
              <p className="text-label-sm font-bold text-primary mb-1 uppercase tracking-wider">Cultural Immersion</p>
              <h3 className="text-headline-md font-bold text-on-surface mb-2">Kyoto, Japan</h3>
              <p className="text-body-md text-on-surface-variant line-clamp-2">Wander through ancient temples and tranquil Zen gardens in Japan's cultural heart.</p>
            </div>
          </div>

          <div 
            onClick={() => handleRegionClick('Swiss Alps')} 
            className="min-w-[280px] md:min-w-[320px] bg-surface rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
          >
            <div className="h-48 relative overflow-hidden">
              <img 
                alt="Swiss Alps" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                src="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop';
                }}
              />
              <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-amber-500 fill-1">star</span>
                <span className="text-label-sm font-semibold text-on-surface">5.0</span>
              </div>
            </div>
            <div className="p-6">
              <p className="text-label-sm font-bold text-primary mb-1 uppercase tracking-wider">Alpine Adventure</p>
              <h3 className="text-headline-md font-bold text-on-surface mb-2">Swiss Alps, Switzerland</h3>
              <p className="text-body-md text-on-surface-variant line-clamp-2">World-class skiing and breathtaking vistas in the heart of Europe.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Past Journeys / Trips */}
      <section className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-12 bg-surface-container-lowest/50 rounded-2xl border border-outline-variant/20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-headline-lg font-bold text-on-surface">Your Active Journeys</h2>
          <button 
            onClick={() => navigateTo('my-trips')} 
            className="text-primary text-label-md font-semibold hover:underline bg-transparent border-none cursor-pointer"
          >
            All Trips
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {trips.slice(0, 3).map((trip) => {
            const tripSpent = (trip.expenses ? trip.expenses.reduce((s, e) => s + (e.amount || 0), 0) : 0) +
              (trip.itinerary || []).reduce((s, d) => s + (d.activities || []).reduce((as, a) => as + (a.cost || 0), 0), 0);
            
            const formatDateStr = (dateStr?: string) => {
              if (!dateStr) return '';
              const [y, m, d] = dateStr.split('-');
              if (!y || !m || !d) return dateStr;
              const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
              return dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
            };

            return (
              <div 
                key={trip.id}
                onClick={() => navigateTo('view-itinerary', trip.id)}
                className="flex items-start gap-4 p-4 rounded-xl border border-outline-variant/30 bg-surface hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-surface-container-high">
                  <img 
                    alt={trip.title} 
                    className="w-full h-full object-cover" 
                    src={trip.image}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop';
                    }}
                  />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <span className="text-label-sm text-outline mb-1 truncate">
                    {formatDateStr(trip.startDate)} - {formatDateStr(trip.endDate)}
                  </span>
                  <h4 className="text-body-lg font-bold text-on-surface truncate">{trip.title}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-secondary-container text-on-secondary-container">
                      {trip.category}
                    </span>
                    <span className="text-label-sm font-semibold text-on-surface-variant flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">group</span> {trip.travelers}
                    </span>
                    {tripSpent > 0 && (
                      <span className="text-label-sm font-semibold text-primary">
                        · ₹{tripSpent.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {trips.length === 0 && (
            <div className="col-span-full text-center py-8 text-on-surface-variant">
              No journeys planned yet. Click "+ Plan a Trip" to start!
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
