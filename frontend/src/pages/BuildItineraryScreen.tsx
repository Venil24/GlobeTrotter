import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';

// ══════════════════════════════════════════════════════════════
// ACTIVITY SUGGESTIONS per destination — restaurants & spots in ₹
// ══════════════════════════════════════════════════════════════
interface Suggestion {
  name: string; detail: string; cost: number; time: string; location?: string;
}
interface DestSuggestions {
  restaurants: Suggestion[];
  spots:       Suggestion[];
}

const ACTIVITY_SUGGESTIONS: Record<string, DestSuggestions> = {
  Goa: {
    restaurants: [
      { name: "Gunpowder",           detail: "Kerala-Tamil Cuisine",        cost: 700,  time: "08:00 PM", location: "Assagao, North Goa"           },
      { name: "Fisherman's Wharf",   detail: "Seafood & Goan",              cost: 1100, time: "07:30 PM", location: "Cavelossim, South Goa"         },
      { name: "Thalassa",            detail: "Greek & Mediterranean",       cost: 1600, time: "07:00 PM", location: "Vagator, North Goa"            },
      { name: "Bomra's",             detail: "Burmese Fusion Cuisine",      cost: 1200, time: "07:00 PM", location: "Fontainhas, Panjim"            },
    ],
    spots: [
      { name: "Anjuna Flea Market",        detail: "Shopping",   cost: 0,    time: "10:00 AM" },
      { name: "Fort Aguada Lighthouse",    detail: "Sightseeing",cost: 200,  time: "04:00 PM" },
      { name: "Dudhsagar Waterfalls",      detail: "Nature",     cost: 1800, time: "06:00 AM" },
      { name: "Palolem Beach Walk",        detail: "Leisure",    cost: 0,    time: "06:30 AM" },
    ],
  },
  Jaipur: {
    restaurants: [
      { name: "Suvarna Mahal",             detail: "Royal Rajasthani Fine Dining",  cost: 3500, time: "08:00 PM", location: "Rambagh Palace, JLN Marg"     },
      { name: "LMB (Laxmi Mishthan Bhandar)", detail: "Vegetarian Rajasthani",      cost: 400,  time: "12:00 PM", location: "Johari Bazaar"               },
      { name: "Peacock Rooftop",           detail: "Rajasthani & North Indian",     cost: 900,  time: "07:30 PM", location: "Hotel Pearl Palace"           },
      { name: "1135 AD at Amber Fort",     detail: "Medieval Rajput Cuisine",       cost: 2500, time: "01:00 PM", location: "Amber Fort Complex"          },
    ],
    spots: [
      { name: "Nahargarh Fort",            detail: "Heritage",   cost: 300,  time: "04:30 PM" },
      { name: "Birla Mandir",              detail: "Temple",     cost: 0,    time: "08:00 AM" },
      { name: "Albert Hall Museum",        detail: "Museum",     cost: 300,  time: "10:00 AM" },
      { name: "Sisodia Rani Garden",       detail: "Garden",     cost: 50,   time: "09:00 AM" },
    ],
  },
  Tokyo: {
    restaurants: [
      { name: "Ichiran Ramen",             detail: "Solo Booth Ramen",              cost: 900,  time: "12:00 PM", location: "Multiple Locations"          },
      { name: "Gonpachi Nishi-Azabu",      detail: "Japanese Izakaya",              cost: 2500, time: "07:00 PM", location: "Nishi-Azabu, Minato"         },
      { name: "Tsukiji Market Sushi Bar",  detail: "Fresh Omakase Sushi",           cost: 1500, time: "07:30 AM", location: "Tsukiji Outer Market"        },
      { name: "Robot Restaurant Show",     detail: "Entertainment Dinner",          cost: 4000, time: "07:00 PM", location: "Kabukicho, Shinjuku"         },
    ],
    spots: [
      { name: "Meiji Shrine & Forest",     detail: "Shrine",     cost: 0,    time: "08:00 AM" },
      { name: "Odaiba Futuristic Island",  detail: "Leisure",    cost: 0,    time: "02:00 PM" },
      { name: "Harajuku Takeshita Street", detail: "Fashion",    cost: 0,    time: "12:00 PM" },
      { name: "Akihabara Electronics Town",detail: "Shopping",   cost: 0,    time: "02:00 PM" },
    ],
  },
  Paris: {
    restaurants: [
      { name: "Café de Flore",             detail: "Classic French Bistro",         cost: 1800, time: "09:00 AM", location: "172 Bd Saint-Germain"        },
      { name: "Breizh Café",               detail: "Breton Crêperie",               cost: 1200, time: "12:00 PM", location: "Marais District"             },
      { name: "Les Deux Magots",           detail: "Parisian Café Culture",         cost: 2000, time: "10:00 AM", location: "Saint-Germain-des-Prés"      },
      { name: "Bouillon Chartier",         detail: "Traditional French Brasserie",  cost: 1500, time: "07:00 PM", location: "Rue du Faubourg Montmartre"  },
    ],
    spots: [
      { name: "Palais Royal Gardens",      detail: "Garden",     cost: 0,    time: "11:00 AM" },
      { name: "Père Lachaise Cemetery",    detail: "Historical", cost: 0,    time: "10:00 AM" },
      { name: "Le Marais Jewish Quarter",  detail: "Culture",    cost: 0,    time: "11:00 AM" },
      { name: "Arc de Triomphe",           detail: "Landmark",   cost: 1200, time: "06:00 PM" },
    ],
  },
  Rome: {
    restaurants: [
      { name: "Da Enzo al 29",             detail: "Roman Trattoria",               cost: 1800, time: "01:00 PM", location: "Trastevere, Roma"            },
      { name: "Roscioli",                  detail: "Wine Bar & Deli",               cost: 2500, time: "07:30 PM", location: "Via dei Giubbonari 21"       },
      { name: "Pizzarium by Bonci",        detail: "Artisan Pizza al Taglio",       cost: 700,  time: "12:30 PM", location: "Via della Meloria, Prati"    },
      { name: "Osteria Fernanda",          detail: "Modern Roman Fine Dining",      cost: 4000, time: "08:00 PM", location: "Trastevere District"         },
    ],
    spots: [
      { name: "Borghese Gallery",          detail: "Art Museum", cost: 3200, time: "09:00 AM" },
      { name: "Campo de' Fiori Morning",   detail: "Market",     cost: 0,    time: "08:00 AM" },
      { name: "Aventine Keyhole View",     detail: "Viewpoint",  cost: 0,    time: "10:00 AM" },
      { name: "Ostia Antica Ruins",        detail: "Day Trip",   cost: 1000, time: "08:30 AM" },
    ],
  },
  Bangkok: {
    restaurants: [
      { name: "Jay Fai (Michelin Star)",   detail: "Thai Street Food (Michelin)",   cost: 2500, time: "12:00 PM", location: "Maha Chai Road, Samranrat"   },
      { name: "Pad Thai Thip Samai",       detail: "Famous Pad Thai Stall",         cost: 400,  time: "06:00 PM", location: "Mahachai Road"               },
      { name: "Roast at The Commons",      detail: "Modern International Brunch",   cost: 1500, time: "10:00 AM", location: "The Commons, Thonglor"       },
      { name: "Cabbages & Condoms",        detail: "Thai Cuisine (Unique Concept)", cost: 1200, time: "07:30 PM", location: "Sukhumvit Soi 12"            },
    ],
    spots: [
      { name: "Jim Thompson House",        detail: "Museum",     cost: 500,  time: "10:00 AM" },
      { name: "Lumphini Park Morning",     detail: "Nature",     cost: 0,    time: "06:30 AM" },
      { name: "Chinatown Yaowarat Night",  detail: "Food & Culture",cost: 0, time: "08:00 PM" },
      { name: "Asiatique Night Bazaar",    detail: "Shopping",   cost: 0,    time: "05:00 PM" },
    ],
  },
  Dubai: {
    restaurants: [
      { name: "Nobu Dubai",                detail: "Japanese-Peruvian Fine Dining", cost: 7000, time: "08:00 PM", location: "Atlantis The Palm"           },
      { name: "Al Fanar Restaurant",       detail: "Traditional Emirati Cuisine",   cost: 2000, time: "07:30 PM", location: "Festival City Mall"          },
      { name: "Ravi Restaurant",           detail: "Authentic Pakistani",           cost: 600,  time: "12:00 PM", location: "Satwa, Dubai"                },
      { name: "BOCA Dubai",                detail: "Spanish Tapas & Fine Wine",     cost: 3500, time: "08:00 PM", location: "DIFC, Dubai"                 },
    ],
    spots: [
      { name: "Jumeirah Mosque Tour",      detail: "Heritage",   cost: 500,  time: "10:00 AM" },
      { name: "Dubai Frame",               detail: "Landmark",   cost: 2000, time: "11:00 AM" },
      { name: "La Mer Beach",              detail: "Beach",      cost: 0,    time: "05:00 PM" },
      { name: "Miracle Garden (Seasonal)", detail: "Garden",     cost: 1200, time: "10:00 AM" },
    ],
  },
  Bali: {
    restaurants: [
      { name: "Locavore",                  detail: "Modern Indonesian Fine Dining", cost: 5500, time: "07:30 PM", location: "Jl. Dewi Sita, Ubud"         },
      { name: "Naughty Nuri's Warung",     detail: "Balinese Ribs & BBQ",          cost: 1000, time: "12:30 PM", location: "Jl. Raya Sanggingan, Ubud"   },
      { name: "Merah Putih",               detail: "Contemporary Indonesian",       cost: 3000, time: "07:00 PM", location: "Seminyak, Bali"              },
      { name: "Swept Away at COMO",        detail: "Organic International Cuisine", cost: 4500, time: "01:00 PM", location: "Ubud Jungle Resort"          },
    ],
    spots: [
      { name: "Goa Gajah Elephant Cave",   detail: "Temple",     cost: 300,  time: "09:00 AM" },
      { name: "Seminyak Beach Sunset",     detail: "Beach",      cost: 0,    time: "05:30 PM" },
      { name: "Campuhan Ridge Walk",       detail: "Nature",     cost: 0,    time: "07:00 AM" },
      { name: "Tirta Empul Holy Spring",   detail: "Culture",    cost: 250,  time: "09:00 AM" },
    ],
  },
  Barcelona: {
    restaurants: [
      { name: "El Quim de la Boqueria",    detail: "Catalan Tapas at the Market",   cost: 1400, time: "10:30 AM", location: "La Boqueria Market Stall 584"},
      { name: "Bar del Pla",               detail: "Classic Tapas Bar",             cost: 1000, time: "08:00 PM", location: "El Born, C/ Montcada"        },
      { name: "Cervecería Catalana",       detail: "Spanish Pinchos & Beer",        cost: 1200, time: "07:30 PM", location: "Carrer de Mallorca 236"      },
      { name: "Disfrutar",                 detail: "Avant-garde Catalan Fine Dining",cost: 8000, time: "02:00 PM", location: "Carrer de Villarroel 163"   },
    ],
    spots: [
      { name: "El Born Historic District", detail: "Culture",    cost: 0,    time: "10:00 AM" },
      { name: "Barceloneta Beach",         detail: "Beach",      cost: 0,    time: "09:00 AM" },
      { name: "Poble Sec & Montjuïc",     detail: "Viewpoint",  cost: 0,    time: "05:00 PM" },
      { name: "Casa Batlló Exterior",      detail: "Architecture",cost: 0,   time: "10:00 AM" },
    ],
  },
  Santorini: {
    restaurants: [
      { name: "Selene",                    detail: "Modern Greek Fine Dining",       cost: 5500, time: "08:00 PM", location: "Pyrgos Village, Santorini"   },
      { name: "Metaxy Mas",                detail: "Traditional Greek Taverna",      cost: 2000, time: "01:00 PM", location: "Exo Gonia Village"           },
      { name: "Lithos",                    detail: "Mediterranean Caldera Views",    cost: 3500, time: "08:00 PM", location: "Oia Village"                 },
      { name: "Amoudi Fish Tavern",        detail: "Fresh Seafood by the Port",      cost: 2800, time: "12:30 PM", location: "Amoudi Bay, below Oia"       },
    ],
    spots: [
      { name: "Fira Town Cliffside Stroll",detail: "Sightseeing",cost: 0,    time: "09:00 AM" },
      { name: "Perissa Black Sand Beach",  detail: "Beach",      cost: 800,  time: "10:00 AM" },
      { name: "Ancient Thera Ruins",       detail: "Archaeological",cost: 600,time: "10:00 AM" },
      { name: "Oia Village Explore",       detail: "Culture",    cost: 0,    time: "10:00 AM" },
    ],
  },
};

/** Find the best matching suggestion key for a destination string */
function findSuggKey(destination: string): string | null {
  if (!destination) return null;
  const lower = destination.toLowerCase();
  return Object.keys(ACTIVITY_SUGGESTIONS).find(k => lower.includes(k.toLowerCase())) ?? null;
}

// ══════════════════════════════════════════════════════════════
export default function BuildItineraryScreen() {
  const { trips, activeTripId, addActivity, deleteActivity, navigateTo, updateTrip } =
    useContext(AppContext) as any;

  const [showAddForm,    setShowAddForm]    = useState<number | null>(null);
  const [editingDayNum,  setEditingDayNum]  = useState<number | null>(null);
  const [tempCityHeader, setTempCityHeader] = useState('');
  const [suggestTab,     setSuggestTab]     = useState<'restaurants' | 'spots'>('restaurants');

  // Activity form state
  const [actTitle,    setActTitle]    = useState('');
  const [actTime,     setActTime]     = useState('10:00 AM');
  const [actLocation, setActLocation] = useState('');
  const [actCost,     setActCost]     = useState('0');
  const [actNote,     setActNote]     = useState('');

  const trip = trips?.find((t: any) => t.id === activeTripId);

  // Resolve suggestion data from trip destination
  const suggKey  = useMemo(() => findSuggKey(trip?.destination || ''), [trip?.destination]);
  const suggData = suggKey ? ACTIVITY_SUGGESTIONS[suggKey] : null;

  if (!trip) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-12 text-center bg-background">
        <h2 className="text-2xl font-bold mb-4">No Trip Selected</h2>
        <p className="text-sm text-on-surface-variant mb-6">Select or create a trip to build its itinerary.</p>
        <button
          onClick={() => navigateTo('my-trips')}
          className="bg-primary text-on-primary px-6 py-2 rounded-lg text-sm font-semibold border-none cursor-pointer"
        >
          Go to My Trips
        </button>
      </div>
    );
  }

  const handleAddSubmit = (e: React.FormEvent, stopId: number) => {
    e.preventDefault();
    if (!actTitle.trim()) return;
    // stopId is the real DB id of the stop (dayObj.id), NOT the day number
    addActivity(trip.id, stopId, {
      title: actTitle, time: actTime,
      location: actLocation, cost: parseFloat(actCost) || 0, note: actNote,
    });
    setActTitle(''); setActTime('10:00 AM'); setActLocation(''); setActCost('0'); setActNote('');
    setShowAddForm(null);
  };

  const quickAdd = (s: Suggestion) => {
    setActTitle(s.name);
    setActTime(s.time);
    setActLocation(s.location || trip.destination);
    setActCost(String(s.cost));
    setActNote(s.detail);
  };

  const handleAddDay = () => {
    const nextDayNum = (trip.itinerary || []).length + 1;
    const currentEnd = new Date(trip.endDate);
    currentEnd.setDate(currentEnd.getDate() + 1);
    const newEndDateStr = currentEnd.toISOString().split('T')[0];
    updateTrip(trip.id, {
      endDate: newEndDateStr,
      itinerary: [...(trip.itinerary || []), { day: nextDayNum, date: newEndDateStr, city_header: trip.destination, activities: [] }],
    });
  };

  const handleSaveCityHeader = (dayNum: number) => {
    const updated = (trip.itinerary || []).map((d: any) =>
      d.day === dayNum ? { ...d, city_header: tempCityHeader } : d,
    );
    updateTrip(trip.id, { itinerary: updated });
    setEditingDayNum(null);
  };

  const openForm = (dayNum: number) => {
    setActTitle(''); setActTime('10:00 AM'); setActLocation(''); setActCost('0'); setActNote('');
    setSuggestTab('restaurants');
    setShowAddForm(dayNum);
  };

  const totalActivities = (trip.itinerary || []).reduce(
    (s: number, d: any) => s + (d.activities?.length || 0), 0,
  );

  return (
    <div className="flex-grow w-full max-w-[900px] mx-auto px-4 md:px-8 py-8 pb-28">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-on-surface mb-1">Build Itinerary</h1>
          <p className="text-sm text-on-surface-variant flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              {trip.destination}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              {new Date(trip.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
              {' – '}
              {new Date(trip.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">local_activity</span>
              {totalActivities} activities
            </span>
          </p>
        </div>
        <button
          onClick={() => navigateTo('itinerary-details', trip.id)}
          className="px-4 py-2 bg-secondary text-on-secondary rounded-lg text-sm font-semibold hover:bg-secondary-container transition-colors shadow-sm cursor-pointer border-none flex items-center gap-1.5 shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">visibility</span>
          View Full Itinerary
        </button>
      </div>

      {/* Day blocks */}
      <div className="space-y-6">
        {(trip.itinerary || []).map((dayObj: any) => (
          <div
            key={dayObj.day}
            className="bg-surface rounded-2xl shadow-sm border border-outline-variant/25 overflow-hidden"
          >
            {/* Day Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-surface-container-low border-b border-outline-variant/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary text-on-primary rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                  {dayObj.day}
                </div>
                {editingDayNum === dayObj.day ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      type="text"
                      value={tempCityHeader}
                      onChange={e => setTempCityHeader(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleSaveCityHeader(dayObj.day); if (e.key === 'Escape') setEditingDayNum(null); }}
                      className="bg-surface-container-lowest border border-primary rounded px-3 py-1 text-sm text-on-surface outline-none"
                    />
                    <button onClick={() => handleSaveCityHeader(dayObj.day)} className="text-primary text-xs font-bold bg-transparent border-none cursor-pointer hover:underline">Save</button>
                    <button onClick={() => setEditingDayNum(null)} className="text-on-surface-variant text-xs bg-transparent border-none cursor-pointer hover:underline">Cancel</button>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-bold text-on-surface text-sm">
                      {dayObj.city_header || trip.destination}
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      {new Date(dayObj.date).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={() => { setEditingDayNum(dayObj.day); setTempCityHeader(dayObj.city_header || trip.destination); }}
                className="p-1.5 rounded-lg hover:bg-surface-container text-outline hover:text-on-surface transition-all bg-transparent border-none cursor-pointer"
                title="Edit city / header"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
            </div>

            {/* Activity list */}
            <div className="p-6 space-y-3">
              {(dayObj.activities || []).map((act: any, i: number) => (
                <div
                  key={act.id || i}
                  className="group/act relative flex items-start gap-3 p-4 bg-surface-container-lowest border border-outline-variant/25 rounded-xl hover:border-outline-variant transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 text-xs font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-primary">{act.time}</span>
                      {(act.cost || 0) > 0 && (
                        <span className="text-xs text-on-surface-variant font-semibold">
                          · ₹{(act.cost).toLocaleString('en-IN')}
                        </span>
                      )}
                      {(act.cost || 0) === 0 && (
                        <span className="text-[10px] text-tertiary font-bold">· Free</span>
                      )}
                    </div>
                    <h4 className="font-bold text-on-surface text-sm truncate">{act.title}</h4>
                    {act.location && <p className="text-xs text-on-surface-variant truncate">{act.location}</p>}
                    {act.note && <p className="text-xs text-outline italic truncate mt-1">"{act.note}"</p>}
                  </div>
                  <button
                    onClick={() => deleteActivity(trip.id, dayObj.day, act.id)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-error-container/30 text-outline hover:text-error transition-all opacity-0 group-hover/act:opacity-100 bg-transparent border-none cursor-pointer"
                    title="Remove"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              ))}

              {(!dayObj.activities || dayObj.activities.length === 0) && showAddForm !== dayObj.day && (
                <div className="text-center py-5 text-sm text-on-surface-variant italic">
                  No activities yet — add one below.
                </div>
              )}
            </div>

            {/* ── Add Activity Form ── */}
            {showAddForm === dayObj.day ? (
              <div className="border-t border-outline-variant/20 p-6 space-y-5">
                <h4 className="font-bold text-on-surface text-sm">Add New Activity</h4>

                {/* ── SMART SUGGESTIONS PANEL ── */}
                {suggData && (
                  <div className="bg-surface-container-low rounded-xl border border-outline-variant/20 overflow-hidden">
                    {/* Tab bar */}
                    <div className="flex border-b border-outline-variant/20">
                      {(['restaurants', 'spots'] as const).map(tab => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setSuggestTab(tab)}
                          className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-none ${
                            suggestTab === tab
                              ? 'bg-primary-container text-on-primary-container'
                              : 'bg-transparent text-on-surface-variant hover:bg-surface-container'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px] align-middle mr-1">
                            {tab === 'restaurants' ? 'restaurant' : 'location_on'}
                          </span>
                          {tab === 'restaurants' ? 'Restaurants' : 'Nearby Spots'}
                          <span className="ml-1 opacity-60">
                            ({suggData[tab].length})
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Suggestion cards */}
                    <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {suggData[suggestTab].map((s, si) => (
                        <button
                          key={si}
                          type="button"
                          onClick={() => quickAdd(s)}
                          className="group/sug flex items-center gap-3 p-3 rounded-lg bg-surface hover:bg-primary-container/40 border border-outline-variant/20 hover:border-primary/30 transition-all cursor-pointer text-left w-full"
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            suggestTab === 'restaurants' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            <span className="material-symbols-outlined text-[18px]">
                              {suggestTab === 'restaurants' ? 'restaurant' : 'location_on'}
                            </span>
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="font-bold text-on-surface text-xs truncate">{s.name}</p>
                            <p className="text-[10px] text-on-surface-variant truncate">{s.detail}</p>
                            {s.location && <p className="text-[10px] text-outline truncate">{s.location}</p>}
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs font-bold text-primary">
                              {s.cost > 0 ? `₹${s.cost.toLocaleString('en-IN')}` : 'Free'}
                            </p>
                            <p className="text-[10px] text-on-surface-variant">{s.time}</p>
                          </div>
                          <div className="ml-1 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center opacity-0 group-hover/sug:opacity-100 transition-opacity shrink-0">
                            <span className="material-symbols-outlined text-[14px]">add</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="text-center pb-3 text-[10px] text-on-surface-variant">
                      Click any card to pre-fill the form ↓
                    </p>
                  </div>
                )}

                {/* Manual form */}
                <form onSubmit={(e) => handleAddSubmit(e, dayObj.id)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">Activity Title *</label>
                      <input
                        type="text" required placeholder="e.g. Tour of Tokyo Tower"
                        value={actTitle} onChange={e => setActTitle(e.target.value)}
                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm text-on-surface focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">Location</label>
                      <input
                        type="text" placeholder="e.g. Minato City, Tokyo"
                        value={actLocation} onChange={e => setActLocation(e.target.value)}
                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm text-on-surface focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">Time</label>
                      <input
                        type="text" placeholder="e.g. 10:00 AM"
                        value={actTime} onChange={e => setActTime(e.target.value)}
                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm text-on-surface focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">Cost (₹)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-bold">₹</span>
                        <input
                          type="number" min="0" placeholder="0"
                          value={actCost} onChange={e => setActCost(e.target.value)}
                          className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest pl-8 pr-4 py-2 text-sm text-on-surface focus:border-primary outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Notes / Instructions</label>
                    <input
                      type="text" placeholder="e.g. Bring voucher, reservation at 10 AM sharp"
                      value={actNote} onChange={e => setActNote(e.target.value)}
                      className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm text-on-surface focus:border-primary outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button" onClick={() => setShowAddForm(null)}
                      className="px-4 py-2 bg-transparent text-on-surface-variant hover:bg-surface-container rounded-lg text-xs font-semibold border-none cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container border-none cursor-pointer shadow-sm"
                    >
                      Add Activity
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="px-6 pb-5">
                <button
                  onClick={() => openForm(dayObj.day)}
                  className="text-primary text-sm font-bold flex items-center gap-1.5 hover:underline bg-transparent border-none cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Add Activity
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Add Day */}
        <button
          onClick={handleAddDay}
          className="w-full py-4 border-2 border-dashed border-outline-variant/40 rounded-2xl text-on-surface-variant font-semibold text-sm hover:border-primary hover:text-primary bg-surface/30 hover:bg-surface/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined">add</span> Add Day
        </button>
      </div>
    </div>
  );
}
