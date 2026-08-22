import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function SharedTripScreen() {
  const { cloneTrip, activeTripId, navigateTo } = useContext(AppContext);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // If we have an activeTripId, fetch the public trip details
    if (activeTripId) {
      setLoading(true);
      fetch(`http://127.0.0.1:8000/api/trips/shared/${activeTripId}`)
        .then(res => {
          if (!res.ok) throw new Error("Shared trip not found");
          return res.json();
        })
        .then(data => {
          setTrip(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [activeTripId]);

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/?shared=${activeTripId}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      });
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-20">
        <span className="material-symbols-outlined animate-spin text-[48px] text-primary">progress_activity</span>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-20 text-center space-y-4">
        <span className="material-symbols-outlined text-[64px] text-outline">error</span>
        <h2 className="text-headline-lg font-bold text-on-surface">Shared Trip Not Found</h2>
        <p className="text-body-md text-on-surface-variant max-w-sm">This link might have expired or the trip was set back to private by the creator.</p>
        <button 
          onClick={() => navigateTo('discover')}
          className="px-6 py-2.5 bg-primary text-on-primary hover:bg-primary-container rounded-lg text-label-md font-semibold border-none cursor-pointer"
        >
          Explore Destinations
        </button>
      </div>
    );
  }

  return (
    <div className="flex-grow max-w-container-max-width w-full mx-auto px-margin-mobile md:px-margin-desktop py-12">
      
      {/* Header Banner */}
      <div className="bg-surface border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm mb-8 flex flex-col md:flex-row">
        <div className="h-64 md:h-auto md:w-1/3 relative overflow-hidden bg-surface-container-high shrink-0">
          <img 
            src={trip.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500"} 
            alt={trip.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
        </div>
        
        <div className="p-6 md:p-8 flex-grow flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-label-sm font-semibold rounded-full">
              Public Shareable Trip
            </span>
            <h1 className="text-display-md font-bold text-on-surface">{trip.title}</h1>
            <p className="text-body-md text-primary font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
              {trip.destination}
            </p>
            <p className="text-label-sm text-on-surface-variant">
              Dates: {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()} | Travelers: {trip.travelers} | Category: {trip.category}
            </p>
            {trip.description && (
              <p className="text-body-md text-on-surface-variant italic leading-relaxed pt-2">
                "{trip.description}"
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-outline-variant/30">
            <button
              onClick={() => cloneTrip(trip.share_token)}
              className="px-6 py-3 bg-primary text-on-primary hover:bg-primary-container rounded-lg text-label-md font-semibold transition-colors border-none cursor-pointer shadow-md flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">content_copy</span>
              Copy Trip to My Account
            </button>
            
            <button
              onClick={handleCopyLink}
              className="px-4 py-3 border border-outline text-on-surface hover:bg-surface-container rounded-lg text-label-md font-semibold transition-colors border-none cursor-pointer bg-transparent flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">{copiedLink ? 'check' : 'share'}</span>
              {copiedLink ? 'Copied Link!' : 'Copy Share URL'}
            </button>
            
            <button
              onClick={() => navigateTo('discover')}
              className="px-4 py-3 bg-transparent text-on-surface-variant hover:bg-surface-container rounded-lg text-label-md font-semibold transition-colors border-none cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Itinerary Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Itinerary Timeline (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-headline-lg font-bold text-on-surface">Trip Timeline Stop Details</h2>
          
          <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant/40">
            {trip.itinerary && trip.itinerary.map(dayObj => (
              <div key={dayObj.day} className="relative pl-10 space-y-3">
                
                {/* Timeline Dot */}
                <div className="absolute left-[9px] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-background z-10" />
                
                {/* Day Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-headline-md font-bold text-on-surface">Day {dayObj.day}: <span className="text-primary">{dayObj.city_header || trip.destination}</span></h3>
                  <span className="text-label-sm font-semibold text-on-surface-variant bg-surface-container px-2.5 py-1 rounded">
                    {new Date(dayObj.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                </div>

                {/* Activities List */}
                <div className="space-y-3">
                  {dayObj.activities && dayObj.activities.length > 0 ? (
                    dayObj.activities.map(act => (
                      <div 
                        key={act.id} 
                        className="flex gap-4 bg-surface-container-low border border-outline-variant/20 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="p-3 bg-primary-container/30 text-primary rounded-lg flex items-center justify-center h-12 w-12 shrink-0">
                          <span className="material-symbols-outlined">
                            {act.title.toLowerCase().includes('hotel') || act.title.toLowerCase().includes('check-in') ? 'hotel' :
                             act.title.toLowerCase().includes('flight') || act.title.toLowerCase().includes('airport') ? 'flight' :
                             act.title.toLowerCase().includes('cruise') || act.title.toLowerCase().includes('boat') ? 'sailing' :
                             act.title.toLowerCase().includes('dinner') || act.title.toLowerCase().includes('food') || act.title.toLowerCase().includes('lunch') ? 'restaurant' :
                             act.title.toLowerCase().includes('walk') || act.title.toLowerCase().includes('museum') ? 'museum' : 'explore'}
                          </span>
                        </div>
                        
                        <div className="flex-grow space-y-1">
                          <div className="flex justify-between items-start">
                            <h4 className="text-label-md font-bold text-on-surface">{act.title}</h4>
                            {act.cost > 0 && (
                              <span className="text-label-sm font-bold text-primary bg-primary-container px-2 py-0.5 rounded">
                                ₹{act.cost.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                          <p className="text-body-md text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">schedule</span>
                            {act.time}
                            {act.location && (
                              <>
                                <span className="text-outline-variant">•</span>
                                <span className="material-symbols-outlined text-[16px]">location_on</span>
                                {act.location}
                              </>
                            )}
                          </p>
                          {act.note && (
                            <p className="text-body-sm text-on-surface-variant leading-relaxed italic bg-surface-container-lowest p-2 rounded border border-outline-variant/10">
                              "{act.note}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-label-md text-on-surface-variant italic py-2 pl-4">No activities scheduled for this day stop.</div>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
        
        {/* Right Budget Summary (1/3 width) */}
        <div className="space-y-6">
          <div className="bg-surface border border-outline-variant/30 rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-headline-md font-bold text-on-surface">Budget Summary</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-body-md text-on-surface-variant">
                <span>Overall Budget Limit</span>
                <span className="font-bold text-on-surface">₹{trip.budget.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex justify-between text-body-md text-on-surface-variant">
                <span>Planned Expenses</span>
                <span className="font-bold text-primary">
                  ₹{((trip.expenses ? trip.expenses.reduce((sum, e) => sum + (e.amount || 0), 0) : 0) +
                    (trip.itinerary || []).reduce((s, d) => s + (d.activities || []).reduce((as, a) => as + (a.cost || 0), 0), 0)
                  ).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Expenses List */}
            {trip.expenses && trip.expenses.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-outline-variant/30">
                <h4 className="text-label-md font-bold text-on-surface">Itemized Expenses</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {trip.expenses.map(exp => (
                    <div key={exp.id} className="flex justify-between items-center bg-surface-container-low px-3 py-2 rounded-lg text-body-md">
                      <div>
                        <p className="font-semibold text-on-surface leading-tight">{exp.title}</p>
                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">{exp.category}</span>
                      </div>
                      <span className="font-bold text-on-surface">₹{exp.amount.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
