import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { DESTINATION_DATA, ALL_ACTIVITIES } from '../services/activityData';

// 10 Cities matching user image
const DESTINATION_CITIES = Object.values(DESTINATION_DATA).map(dest => ({
  id: dest.id,
  name: dest.name,
  country: dest.country,
  countryCode: dest.countryCode,
  image: dest.image,
}));

const initialActivities = ALL_ACTIVITIES;

export default function ActivitySearchScreen() {
  const { trips, addActivity, navigateTo, routeParam } = useContext(AppContext);
  const [query, setQuery] = useState('');
  
  // Parse destination filter safely
  const [destinationFilter, setDestinationFilter] = useState<string>(() => {
    let param = '';
    if (typeof routeParam === 'string' && routeParam) param = routeParam;
    else if (routeParam?.destination) param = routeParam.destination;

    if (param) {
      const match = DESTINATION_CITIES.find(c => 
        c.name.toLowerCase() === param.toLowerCase() || param.toLowerCase().includes(c.name.toLowerCase())
      );
      if (match) return match.name;
    }
    return 'All';
  });

  useEffect(() => {
    let param = '';
    if (typeof routeParam === 'string' && routeParam) param = routeParam;
    else if (routeParam?.destination) param = routeParam.destination;

    if (param) {
      const match = DESTINATION_CITIES.find(c => 
        c.name.toLowerCase() === param.toLowerCase() || param.toLowerCase().includes(c.name.toLowerCase())
      );
      if (match) {
        setDestinationFilter(match.name);
      }
    }
  }, [routeParam]);

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [costFilter, setCostFilter] = useState('All'); // All, Under5000, Over5000
  const [durationFilter, setDurationFilter] = useState('All'); // All, Hourly, Half-day, Full-day
  const [sortBy, setSortBy] = useState('rating');
  
  // State for Modals
  const [selectedActivity, setSelectedActivity] = useState<any>(null); // Modal to add
  const [detailActivity, setDetailActivity] = useState<any>(null); // Modal for Quick View
  
  const [targetTripId, setTargetTripId] = useState<any>('');
  const [targetDay, setTargetDay] = useState<any>(1);
  const [targetTime, setTargetTime] = useState('10:00 AM');
  const [successMsg, setSuccessMsg] = useState('');

  const selectedTrip = trips.find(t => t.id === targetTripId);

  const filteredActivities = initialActivities
    .filter(act => {
      const matchesQuery = act.title.toLowerCase().includes(query.toLowerCase()) || 
                           act.location.toLowerCase().includes(query.toLowerCase()) ||
                           act.description.toLowerCase().includes(query.toLowerCase());
      
      const matchesDestination = destinationFilter === 'All' || 
                           act.location.toLowerCase().includes(destinationFilter.toLowerCase()) ||
                           (act.destination && act.destination.toLowerCase().includes(destinationFilter.toLowerCase()));

      const matchesCategory = categoryFilter === 'All' || act.category === categoryFilter;
      
      let matchesCost = true;
      if (costFilter === 'Under1500') matchesCost = act.price < 1500;
      else if (costFilter === 'Between1500and3000') matchesCost = act.price >= 1500 && act.price <= 3000;
      else if (costFilter === 'Over3000') matchesCost = act.price > 3000;

      const matchesDuration = durationFilter === 'All' || act.duration === durationFilter;

      return matchesQuery && matchesDestination && matchesCategory && matchesCost && matchesDuration;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

  const openAddModal = (act: any) => {
    setSelectedActivity(act);
    setSuccessMsg('');
    if (trips.length > 0) {
      setTargetTripId(trips[0].id);
      setTargetDay(trips[0].itinerary?.[0]?.id || 1);
    }
  };

  const handleAddConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTripId) return;

    addActivity(targetTripId, targetDay, {
      title: selectedActivity.title,
      time: targetTime,
      location: selectedActivity.location,
      cost: selectedActivity.price,
      note: "Added from Activity Discover Search."
    });

    setSuccessMsg(`Successfully added "${selectedActivity.title}" to ${selectedTrip?.title || 'trip'} (Day ${targetDay})!`);
    setTimeout(() => {
      setSelectedActivity(null);
      setSuccessMsg('');
    }, 2000);
  };

  return (
    <div className="flex-grow max-w-container-max-width w-full mx-auto px-margin-mobile md:px-margin-desktop py-12">
      
      {/* ── Choose Your Destination Section (10 Tiles Grid) ── */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h1 className="text-display-md font-bold text-on-surface">Choose Your Destination</h1>
          {destinationFilter !== 'All' && (
            <button
              onClick={() => setDestinationFilter('All')}
              className="text-label-md font-semibold text-primary hover:underline flex items-center gap-1 bg-transparent border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">globe</span>
              Show All Destinations
            </button>
          )}
        </div>
        <p className="text-body-md text-on-surface-variant mb-6">
          Click a tile to select, or type below for a custom destination.
        </p>

        {/* 10 City Tiles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {DESTINATION_CITIES.map((city) => {
            const isSelected = destinationFilter.toLowerCase() === city.name.toLowerCase();
            return (
              <div
                key={city.id}
                onClick={() => {
                  if (isSelected) {
                    setDestinationFilter('All');
                  } else {
                    setDestinationFilter(city.name);
                  }
                }}
                className={`relative h-44 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 shadow-sm ${
                  isSelected
                    ? 'ring-4 ring-primary ring-offset-2 scale-[1.03] shadow-lg'
                    : 'hover:scale-[1.03] hover:shadow-md'
                }`}
              >
                <img
                  src={city.image}
                  alt={city.name}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop';
                  }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-4">
                  <div className="text-white">
                    <h3 className="text-title-lg font-bold flex items-baseline gap-1.5 leading-tight drop-shadow-md">
                      <span className="text-label-sm font-semibold opacity-75 uppercase tracking-wider">{city.countryCode}</span>
                      <span>{city.name}</span>
                    </h3>
                    <p className="text-label-sm text-white/80 font-medium">{city.country}</p>
                  </div>
                </div>

                {/* Selection Badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-primary text-on-primary rounded-full p-1 shadow-md flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Search & Filter Controls Toolbar ── */}
      <section className="mb-10">
        <div className="flex flex-col gap-4 bg-surface-container border border-outline-variant/30 p-4 rounded-xl shadow-sm">
          {/* Query Row */}
          <div className="flex items-center bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 w-full focus-within:border-primary transition-colors">
            <span className="material-symbols-outlined text-outline mr-3">search</span>
            <input 
              className="w-full bg-transparent border-none focus:ring-0 text-body-md text-on-surface p-0 placeholder:text-outline/70 outline-none" 
              placeholder="Search by activity name, category or description..." 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          
          {/* Filters Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">Destination Filter</label>
              <select 
                value={destinationFilter}
                onChange={(e) => setDestinationFilter(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-label-sm text-on-surface outline-none cursor-pointer font-medium"
              >
                <option value="All">All 10 Destinations</option>
                {DESTINATION_CITIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name} ({c.country})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">Interest</label>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-label-sm text-on-surface outline-none cursor-pointer font-medium"
              >
                <option value="All">All Interests</option>
                <option value="Adventure">Adventure</option>
                <option value="Culture">Culture</option>
                <option value="Food">Food</option>
                <option value="Water Sports">Water Sports</option>
                <option value="Sightseeing">Sightseeing</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">Cost range</label>
              <select 
                value={costFilter}
                onChange={(e) => setCostFilter(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-label-sm text-on-surface outline-none cursor-pointer font-medium"
              >
                <option value="All">All Costs</option>
                <option value="Under1500">Under ₹1,500</option>
                <option value="Between1500and3000">₹1,500 – ₹3,000</option>
                <option value="Over3000">₹3,000+</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">Duration</label>
              <select 
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-label-sm text-on-surface outline-none cursor-pointer font-medium"
              >
                <option value="All">All Durations</option>
                <option value="Hourly">Hourly</option>
                <option value="Half-day">Half-day</option>
                <option value="Full-day">Full-day</option>
              </select>
            </div>

            <div className="col-span-2 md:col-span-1 flex items-end gap-2">
              <button
                onClick={() => {
                  setQuery('');
                  setDestinationFilter('All');
                  setCategoryFilter('All');
                  setCostFilter('All');
                  setDurationFilter('All');
                  setSortBy('rating');
                }}
                className="w-full py-2 bg-surface-container-lowest hover:bg-surface-container border border-outline-variant rounded-lg text-label-sm font-semibold text-on-surface cursor-pointer transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-headline-md font-bold text-on-surface">
          Available Experiences ({filteredActivities.length})
          {destinationFilter !== 'All' && (
            <span className="text-primary font-semibold text-title-lg ml-2">
              in {destinationFilter}
            </span>
          )}
        </h2>
        
        <div className="flex items-center gap-2">
          <label className="text-label-sm font-semibold text-on-surface-variant">Sort:</label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-1.5 text-label-sm font-semibold text-on-surface outline-none cursor-pointer"
          >
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Active Filter Badges indicator */}
      {destinationFilter !== 'All' && (
        <div className="mb-6 flex items-center gap-2">
          <span className="text-label-sm text-on-surface-variant font-medium">Filtering by destination:</span>
          <span className="bg-primary/10 text-primary border border-primary/20 px-3.5 py-1 rounded-full text-label-sm font-bold flex items-center gap-2 shadow-sm">
            📍 {destinationFilter}
            <button 
              onClick={() => setDestinationFilter('All')} 
              className="hover:text-primary-container cursor-pointer border-none bg-transparent flex items-center"
              title="Clear Destination Filter"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </span>
        </div>
      )}

      {/* Results List */}
      <section className="flex flex-col gap-6 pb-24">
        {filteredActivities.map(act => (
          <article 
            key={act.id} 
            className="flex flex-col md:flex-row bg-surface rounded-xl border border-outline-variant/30 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div 
              onClick={() => setDetailActivity(act)}
              className="md:w-1/3 h-48 md:h-auto relative shrink-0 cursor-pointer overflow-hidden bg-surface-container-high group"
            >
              <img 
                alt={act.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                src={act.image} 
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            </div>
            <div className="p-6 md:w-2/3 flex flex-col justify-between flex-grow">
              <div>
                <div className="flex justify-between items-start mb-2 gap-4">
                  <div>
                    <span className="text-label-sm font-bold text-tertiary mb-1 uppercase tracking-wider block">📍 {act.location} ({act.duration})</span>
                    <h3 onClick={() => setDetailActivity(act)} className="text-headline-md font-bold text-on-surface hover:text-primary cursor-pointer transition-colors">{act.title}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-primary shrink-0">
                    <span className="material-symbols-outlined text-lg fill-1">star</span>
                    <span className="text-label-md font-bold">{act.rating}</span>
                    <span className="text-label-sm text-outline">({act.reviews})</span>
                  </div>
                </div>
                <p className="text-body-md text-on-surface-variant mb-4 line-clamp-3 leading-relaxed">{act.description}</p>
              </div>
              <div className="flex items-end justify-between mt-4">
                <div>
                  <span className="text-label-sm text-outline uppercase tracking-wider block mb-1">Price</span>
                  <span className="text-headline-md font-bold text-on-surface">₹{act.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setDetailActivity(act)}
                    className="px-4 py-2.5 border border-outline text-on-surface hover:bg-surface-container rounded-lg text-label-md font-semibold transition-colors cursor-pointer bg-transparent"
                  >
                    Quick View
                  </button>
                  <button 
                    onClick={() => openAddModal(act)}
                    className="bg-primary text-on-primary px-6 py-2.5 rounded-lg text-label-md font-semibold hover:bg-primary-container transition-colors shadow-sm cursor-pointer border-none"
                  >
                    Add to Itinerary
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
        {filteredActivities.length === 0 && (
          <div className="text-center py-16 border border-dashed border-outline-variant/50 rounded-xl bg-surface text-on-surface-variant space-y-4">
            <span className="material-symbols-outlined text-[48px] text-outline">location_off</span>
            <p className="text-body-lg text-on-surface font-medium">No activities found matching your selected filters{destinationFilter !== 'All' ? ` in ${destinationFilter}` : ''}.</p>
            <p className="text-body-md text-on-surface-variant">Try resetting your destination or category filters to see more activities.</p>
            <button 
              onClick={() => {
                setDestinationFilter('All');
                setCategoryFilter('All');
                setQuery('');
              }}
              className="px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-semibold hover:bg-primary-container border-none cursor-pointer"
            >
              Show All Destinations
            </button>
          </div>
        )}
      </section>

      {/* Add To Itinerary Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 max-w-md w-full p-6 animate-scale-in">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-headline-md font-bold text-on-surface">Add Activity</h3>
              <button 
                onClick={() => setSelectedActivity(null)}
                className="p-1 hover:bg-surface-container rounded-full text-outline bg-transparent border-none cursor-pointer flex items-center justify-center"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            {successMsg ? (
              <div className="py-8 text-center text-primary font-semibold">
                <span className="material-symbols-outlined text-4xl block mb-2">check_circle</span>
                {successMsg}
              </div>
            ) : trips.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-body-md text-on-surface-variant mb-6">You don't have any trips created yet to add activities to.</p>
                <button 
                  onClick={() => { setSelectedActivity(null); navigateTo('create-trip'); }}
                  className="bg-primary text-on-primary px-6 py-2.5 rounded-lg text-label-md font-semibold hover:bg-primary-container border-none cursor-pointer"
                >
                  Create a Trip
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddConfirm} className="space-y-4">
                <p className="text-body-md text-on-surface-variant">
                  Add <strong>{selectedActivity.title}</strong> (₹{selectedActivity.price.toLocaleString('en-IN')}) to your plans.
                </p>
                
                <div>
                  <label className="block text-label-md font-semibold text-on-surface-variant mb-2">Select Trip</label>
                  <select
                    value={targetTripId}
                    onChange={(e) => {
                      const tId = parseInt(e.target.value) || e.target.value;
                      setTargetTripId(tId);
                      const chosenTrip = trips.find(t => t.id === tId);
                      setTargetDay(chosenTrip?.itinerary?.[0]?.id || 1);
                    }}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-body-md text-on-surface focus:border-primary outline-none cursor-pointer"
                  >
                    {trips.map(t => (
                      <option key={t.id} value={t.id}>{t.title} ({t.destination})</option>
                    ))}
                  </select>
                </div>

                {selectedTrip && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-label-md font-semibold text-on-surface-variant mb-2">Select Day</label>
                      <select
                        value={targetDay}
                        onChange={(e) => setTargetDay(parseInt(e.target.value))}
                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-body-md text-on-surface focus:border-primary outline-none cursor-pointer"
                      >
                        {selectedTrip.itinerary.map(dayObj => (
                          <option key={dayObj.day} value={dayObj.id || dayObj.day}>Day {dayObj.day} ({dayObj.date})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-label-md font-semibold text-on-surface-variant mb-2">Select Time</label>
                      <input 
                        type="text" 
                        value={targetTime}
                        onChange={(e) => setTargetTime(e.target.value)}
                        placeholder="e.g. 10:00 AM"
                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-body-md text-on-surface focus:border-primary outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setSelectedActivity(null)}
                    className="px-4 py-2 bg-transparent text-on-surface-variant hover:bg-surface-container rounded-lg text-label-md font-semibold border-none cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-primary text-on-primary hover:bg-primary-container rounded-lg text-label-md font-semibold border-none cursor-pointer shadow-sm"
                  >
                    Confirm &amp; Add
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Quick View Details Modal */}
      {detailActivity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full border border-outline-variant/30 overflow-hidden shadow-2xl space-y-6">
            <div className="h-64 relative overflow-hidden bg-surface-container-high shrink-0">
              <img 
                src={detailActivity.image} 
                alt={detailActivity.title} 
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop';
                }}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setDetailActivity(null)}
                className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 border-none cursor-pointer flex items-center justify-center"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 md:p-8 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-label-sm font-bold text-primary uppercase tracking-wider block">
                    📍 {detailActivity.location}
                  </span>
                  <h3 className="text-headline-lg font-bold text-on-surface mt-1">{detailActivity.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider block">Price</span>
                  <span className="text-headline-lg font-bold text-primary">₹{detailActivity.price.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-label-sm text-on-surface-variant border-t border-b border-outline-variant/20 py-3">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-amber-500 fill-1">star</span>
                  <span className="font-bold text-on-surface">{detailActivity.rating}</span>
                  <span>({detailActivity.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary">schedule</span>
                  <span>Duration: <strong className="text-on-surface">{detailActivity.duration}</strong></span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary">category</span>
                  <span>Interest: <strong className="text-on-surface">{detailActivity.category}</strong></span>
                </div>
              </div>

              <p className="text-body-md text-on-surface-variant leading-relaxed">
                {detailActivity.description}
              </p>

              <div className="flex justify-end gap-2 pt-4">
                <button 
                  onClick={() => setDetailActivity(null)}
                  className="px-5 py-2.5 bg-transparent text-on-surface-variant hover:bg-surface-container rounded-lg text-label-md font-semibold border-none cursor-pointer"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    const act = detailActivity;
                    setDetailActivity(null);
                    openAddModal(act);
                  }}
                  className="px-6 py-2.5 bg-primary text-on-primary hover:bg-primary-container rounded-lg text-label-md font-semibold border-none cursor-pointer shadow-md"
                >
                  Add to Itinerary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

