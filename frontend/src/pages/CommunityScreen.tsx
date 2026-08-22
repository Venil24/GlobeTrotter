import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

interface CommunityTrip {
  id: string;
  shareToken: string;
  title: string;
  destination: string;
  countryCode: string;
  flag: string;
  author: string;
  authorAvatar: string;
  authorHandle: string;
  publishDate: string;
  likes: number;
  views: number;
  clones: number;
  startDate: string;
  endDate: string;
  days: number;
  budget: number;
  travelers: number;
  category: string;
  image: string;
  summary: string;
  keyStops: string[];
  itinerary: {
    day: number;
    title: string;
    activities: { title: string; time: string; location: string; cost: number; note: string }[];
  }[];
}

const PUBLIC_COMMUNITY_TRIPS: CommunityTrip[] = [
  {
    id: "comm-trip-goa",
    shareToken: "tok-goa-882",
    title: "Goa Beach, Forts & Spice Trail Expedition",
    destination: "Goa, India",
    countryCode: "IN",
    flag: "🇮🇳",
    author: "Aarav Sharma",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    authorHandle: "@aarav_travels",
    publishDate: "2 days ago",
    likes: 342,
    views: 1280,
    clones: 89,
    startDate: "2026-10-10",
    endDate: "2026-10-14",
    days: 5,
    budget: 25000,
    travelers: 2,
    category: "Adventure & Culture",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
    summary: "Complete 5-day coastal Goan itinerary covering Baga beach shacks, Calangute parasailing, Old Goa Portuguese churches, Dudhsagar waterfalls safari, and organic Ponda spice farm lunches.",
    keyStops: ["Baga Beach", "Old Goa Cathedral", "Dudhsagar Waterfalls", "Fort Aguada", "Ponda Spice Farm"],
    itinerary: [
      {
        day: 1,
        title: "Baga & Calangute Arrival",
        activities: [
          { title: "Parasailing at Calangute Beach", time: "10:00 AM", location: "Calangute, Goa", cost: 1200, note: "15-min high adrenaline flight" },
          { title: "Baga Beach Shack Dinner", time: "07:00 PM", location: "Baga Beach, Goa", cost: 800, note: "Candlelit seafood dinner at sunset" }
        ]
      },
      {
        day: 2,
        title: "Old Goa & Dolphin Cruise",
        activities: [
          { title: "Dolphin Watching Boat Cruise", time: "07:30 AM", location: "Sinquerim, Goa", cost: 600, note: "Early morning boat ride to spot dolphins" },
          { title: "Old Goa Portuguese Churches Tour", time: "09:00 AM", location: "Old Goa", cost: 300, note: "Sé Cathedral & Bom Jesus Basilica" }
        ]
      },
      {
        day: 3,
        title: "Dudhsagar Waterfalls Adventure",
        activities: [
          { title: "Dudhsagar Waterfalls Jeep Safari", time: "06:00 AM", location: "Mollem National Park", cost: 1500, note: "Jeep ride through sanctuary + waterfall swim" }
        ]
      },
      {
        day: 4,
        title: "Fort Aguada & Market Browse",
        activities: [
          { title: "Anjuna Flea Market Shopping", time: "10:00 AM", location: "Anjuna Beach", cost: 400, note: "Breezy clothes, handicrafts & spices" },
          { title: "Fort Aguada & Lighthouse Walk", time: "05:00 PM", location: "Candolim", cost: 150, note: "17th-century fort sea view at dusk" }
        ]
      },
      {
        day: 5,
        title: "Organic Spice Farm Farewell",
        activities: [
          { title: "Sahakari Spice Farm Tour & Lunch", time: "11:00 AM", location: "Ponda, Goa", cost: 800, note: "Spice plantation walk + Goan buffet" }
        ]
      }
    ]
  },
  {
    id: "comm-trip-jaipur",
    shareToken: "tok-jai-419",
    title: "Jaipur Royal Palaces & Pink City Heritage Walk",
    destination: "Jaipur, India",
    countryCode: "IN",
    flag: "🇮🇳",
    author: "Riya Verma",
    authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    authorHandle: "@riya_explores",
    publishDate: "4 days ago",
    likes: 412,
    views: 1890,
    clones: 124,
    startDate: "2026-11-01",
    endDate: "2026-11-04",
    days: 4,
    budget: 18000,
    travelers: 2,
    category: "Heritage & Royalty",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800",
    summary: "Immerse in the Pink City's royal history with Amber Fort Mirror Palace, Hawa Mahal photo spots, Johri Bazaar gem shopping, Chokhi Dhani thali dinner, and Nahargarh sunset vistas.",
    keyStops: ["Amber Fort", "Hawa Mahal", "City Palace", "Chokhi Dhani", "Nahargarh Fort"],
    itinerary: [
      {
        day: 1,
        title: "Palace Wonders & Sunset Views",
        activities: [
          { title: "Hawa Mahal Photo Stop", time: "08:00 AM", location: "Badi Choupad, Jaipur", cost: 150, note: "Sunrise view of 953 honeycomb windows" },
          { title: "City Palace Museum & Armoury", time: "10:30 AM", location: "Jaidhan Street", cost: 400, note: "Peacock courtyard & royal garments" },
          { title: "Nahargarh Fort Sunset View", time: "04:30 PM", location: "Aravalli Hills", cost: 200, note: "Golden city panorama at dusk" }
        ]
      },
      {
        day: 2,
        title: "Amber Fort & Cultural Evening",
        activities: [
          { title: "Amber Fort & Sheesh Mahal Tour", time: "09:00 AM", location: "Amer, Jaipur", cost: 500, note: "Guided walk through shimmering mirror palace" },
          { title: "Chokhi Dhani Ethnic Dinner", time: "06:00 PM", location: "Tonk Road", cost: 900, note: "Folk music, puppet show & Dal Baati thali" }
        ]
      },
      {
        day: 3,
        title: "Observatory & Bazaar Shopping",
        activities: [
          { title: "Jantar Mantar Astronomical Site", time: "10:00 AM", location: "Near City Palace", cost: 250, note: "UNESCO 18th-century stone sundial" },
          { title: "Johri Bazaar Gem & Crafts Shopping", time: "11:30 AM", location: "Johri Bazaar", cost: 300, note: "Kundan jewellery & blue pottery deals" }
        ]
      },
      {
        day: 4,
        title: "Artisan Printing Workshop",
        activities: [
          { title: "Sanganeri Block Printing Workshop", time: "11:00 AM", location: "Sanganer", cost: 600, note: "Print your own cotton scarf with wood blocks" }
        ]
      }
    ]
  },
  {
    id: "comm-trip-tokyo",
    shareToken: "tok-tky-991",
    title: "Tokyo Neon Lights, Shrines & Digital Art Odyssey",
    destination: "Tokyo, Japan",
    countryCode: "JP",
    flag: "🇯🇵",
    author: "Kenji Sato",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    authorHandle: "@kenji_tokyo",
    publishDate: "1 week ago",
    likes: 589,
    views: 2450,
    clones: 198,
    startDate: "2026-09-15",
    endDate: "2026-09-19",
    days: 5,
    budget: 65000,
    travelers: 1,
    category: "Modern & Tech",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800",
    summary: "Futuristic Tokyo itinerary blending teamLab Planets digital water museum, Shibuya Crossing, Tsukiji fresh tuna breakfast, Senso-ji temple strolls, and Akihabara gaming arcades.",
    keyStops: ["teamLab Planets", "Shibuya Scramble", "Tsukiji Market", "Senso-ji Temple", "Akihabara"],
    itinerary: [
      {
        day: 1,
        title: "Asakusa & Tokyo Skyline",
        activities: [
          { title: "Senso-ji Temple & Asakusa Stroll", time: "08:00 AM", location: "Asakusa, Tokyo", cost: 0, note: "Historic Red Kaminarimon Gate walk" },
          { title: "Tokyo Tower Main Deck Sunset", time: "07:00 PM", location: "Minato, Tokyo", cost: 660, note: "Night view of Tokyo city lights" }
        ]
      },
      {
        day: 2,
        title: "Seafood Breakfast & Digital Art",
        activities: [
          { title: "Tsukiji Outer Market Fresh Breakfast", time: "07:00 AM", location: "Tsukiji, Tokyo", cost: 1100, note: "Fresh tuna nigiri & tamagoyaki skewers" },
          { title: "teamLab Planets Digital Art Museum", time: "10:00 AM", location: "Toyosu, Tokyo", cost: 2100, note: "Barefoot water mirror rooms & crystal universe" }
        ]
      },
      {
        day: 3,
        title: "Shibuya Crossing & Harajuku Fashion",
        activities: [
          { title: "Harajuku Takeshita Street Walk", time: "12:00 PM", location: "Harajuku", cost: 550, note: "Kawaii fashion & sweet crepe stands" },
          { title: "Shibuya Scramble Crossing & Hachiko", time: "06:00 PM", location: "Shibuya Station", cost: 0, note: "World's busiest pedestrian crossing at night" }
        ]
      },
      {
        day: 4,
        title: "Gardens & Anime Arcade Culture",
        activities: [
          { title: "Shinjuku Gyoen National Garden", time: "09:00 AM", location: "Shinjuku", cost: 275, note: "Traditional Japanese landscape gardens" },
          { title: "Akihabara Electric Town Arcade Tour", time: "02:00 PM", location: "Akihabara", cost: 825, note: "Multi-floor manga stores & retro games" }
        ]
      }
    ]
  },
  {
    id: "comm-trip-paris",
    shareToken: "tok-par-554",
    title: "Paris Romance: Eiffel Tower, Louvre & Seine River",
    destination: "Paris, France",
    countryCode: "FR",
    flag: "🇫🇷",
    author: "Sophie Laurent",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    authorHandle: "@sophie_paris",
    publishDate: "5 days ago",
    likes: 670,
    views: 3100,
    clones: 245,
    startDate: "2026-10-01",
    endDate: "2026-10-05",
    days: 5,
    budget: 75000,
    travelers: 2,
    category: "Romance & Art",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    summary: "The ultimate Parisian 5-day guide including skip-line Eiffel Summit access, Mona Lisa guided tour at Louvre, Seine sunset river cruise, Versailles Palace day trip, and Saint-Germain pastry tastings.",
    keyStops: ["Eiffel Tower", "Louvre Museum", "Seine River Cruise", "Palace of Versailles", "Montmartre"],
    itinerary: [
      {
        day: 1,
        title: "Eiffel Tower & Seine Cruise",
        activities: [
          { title: "Eiffel Tower Skip-the-Line Summit Access", time: "09:00 AM", location: "Champ de Mars, Paris", cost: 3150, note: "Top deck 276m panoramic view" },
          { title: "Seine River Evening Sunset Cruise", time: "08:00 PM", location: "Pont Neuf", cost: 1620, note: "Illuminated monuments from the river" }
        ]
      },
      {
        day: 2,
        title: "Louvre Museum & Montmartre Walk",
        activities: [
          { title: "Louvre Museum Masterpieces Tour", time: "10:00 AM", location: "Rue de Rivoli", cost: 1980, note: "Mona Lisa & Venus de Milo guided walk" },
          { title: "Montmartre & Sacré-Cœur Walk", time: "03:00 PM", location: "Montmartre", cost: 0, note: "Bohemian artist quarter & Sacré-Cœur view" }
        ]
      },
      {
        day: 3,
        title: "Versailles Royal Day Trip",
        activities: [
          { title: "Palace of Versailles Hall of Mirrors Pass", time: "09:00 AM", location: "Versailles", cost: 2340, note: "Royal chambers & fountain gardens pass" }
        ]
      },
      {
        day: 4,
        title: "Patisserie Tastings & Marais District",
        activities: [
          { title: "French Patisserie & Macaron Tour", time: "09:00 AM", location: "Saint-Germain", cost: 1800, note: "Warm baguettes, eclairs & Pierre Hermé macarons" },
          { title: "Le Marais District Falafel Walk", time: "12:00 PM", location: "Le Marais", cost: 1080, note: "17th-century mansions & indie boutiques" }
        ]
      }
    ]
  }
];

export default function CommunityScreen() {
  const { createTrip, navigateTo, trips } = useContext(AppContext) as any;

  // Search & filter state for community feed
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal states
  const [readOnlyTrip, setReadOnlyTrip] = useState<CommunityTrip | null>(null);
  const [socialModalTrip, setSocialModalTrip] = useState<CommunityTrip | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Date picker modal state (shown before copying a trip)
  const [datePickerTrip, setDatePickerTrip] = useState<CommunityTrip | null>(null);
  const [copyStartDate, setCopyStartDate] = useState('');
  const [copyEndDate, setCopyEndDate] = useState('');
  const [copyLoading, setCopyLoading] = useState(false);

  // Filter public trips
  const filteredCommunityTrips = PUBLIC_COMMUNITY_TRIPS.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          trip.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          trip.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || trip.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  // Action: Copy Public URL Link to Clipboard
  const handleCopyPublicUrl = (shareToken: string) => {
    const publicUrl = `${window.location.origin}/?shared=${shareToken}`;
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopiedToken(shareToken);
      showToast("📋 Public URL copied to clipboard!");
      setTimeout(() => setCopiedToken(null), 3000);
    });
  };

  // Action: "Copy Trip" — opens the date picker modal first
  const handleCopyTripToAccount = (commTrip: CommunityTrip) => {
    // Pre-fill dates with today + trip duration
    const today = new Date();
    const endDefault = new Date(today);
    endDefault.setDate(today.getDate() + commTrip.days - 1);
    setCopyStartDate(today.toISOString().split('T')[0]);
    setCopyEndDate(endDefault.toISOString().split('T')[0]);
    setDatePickerTrip(commTrip);
  };

  // Confirm copy after user picks dates
  const confirmCopyWithDates = async () => {
    if (!datePickerTrip || !copyStartDate || !copyEndDate) return;

    const start = new Date(copyStartDate);
    const end = new Date(copyEndDate);
    if (end < start) {
      alert('End date must be on or after start date.');
      return;
    }

    setCopyLoading(true);
    try {
      const commTrip = datePickerTrip;

      // Build the itinerary payload using the USER's chosen dates
      const itineraryPayload = commTrip.itinerary.map(dayObj => ({
        day: dayObj.day,
        date: (() => {
          const d = new Date(copyStartDate);
          d.setDate(d.getDate() + dayObj.day - 1);
          return d.toISOString().split('T')[0];
        })(),
        activities: dayObj.activities.map(act => ({
          id: `comm-${commTrip.id}-d${dayObj.day}-${Math.random().toString(36).slice(2, 7)}`,
          title: act.title,
          time: act.time,
          location: act.location,
          cost: act.cost,
          note: act.note,
        })),
      }));

      // Build expense items from all activities
      const expenses = commTrip.itinerary
        .flatMap(d => d.activities)
        .filter(a => a.cost > 0)
        .map(a => ({
          title: a.title,
          category: 'activities',
          amount: a.cost,
        }));

      await createTrip({
        title: commTrip.title,
        destination: commTrip.destination.split(',')[0].trim(),
        startDate: copyStartDate,
        endDate: copyEndDate,
        category: commTrip.category,
        travelers: commTrip.travelers,
        budget: commTrip.budget,
        description: commTrip.summary,
        image: commTrip.image,
        expenses,
        itinerary: itineraryPayload,
      });

      setTimeout(() => navigateTo('my-trips'), 100);
      showToast(`🎉 "${commTrip.title}" has been copied to your My Trips!`);
      setDatePickerTrip(null);
      if (readOnlyTrip) setReadOnlyTrip(null);
    } catch (err) {
      console.error(err);
      showToast("⚠️ Could not copy trip. Please try again.");
    } finally {
      setCopyLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="flex-grow max-w-[1280px] w-full mx-auto px-4 md:px-8 py-10">

      {/* ── Toast Notification Banner ── */}
      {successToast && (
        <div className="fixed top-20 right-4 md:right-8 z-50 bg-primary text-on-primary px-6 py-3.5 rounded-xl shadow-xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-[24px]">verified</span>
          <span className="font-bold text-sm">{successToast}</span>
          <button onClick={() => navigateTo('my-trips')} className="ml-2 px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded text-xs font-bold border-none cursor-pointer">
            View My Trips →
          </button>
        </div>
      )}

      {/* ── Header ── */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <span className="text-label-sm uppercase font-bold text-primary tracking-widest block mb-1">GlobeTrotter Community Hub</span>
          <h1 className="text-3xl md:text-4xl font-bold text-on-surface">Shared Public Itineraries 🌍</h1>
          <p className="text-on-surface-variant text-sm mt-1 max-w-2xl">
            Explore curated public itineraries created by fellow travelers. Preview full read-only itineraries, share public URLs, or 1-click <strong>"Copy Trip"</strong> to import into your account!
          </p>
        </div>

        <button
          onClick={() => navigateTo('create-trip')}
          className="px-6 py-3 bg-primary text-on-primary hover:bg-primary-container font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer border-none flex items-center gap-2 shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          Share New Trip
        </button>
      </header>

      {/* ── Search & Category Filter Toolbar ── */}
      <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-4 md:p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Search box */}
          <div className="md:col-span-8 flex items-center bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
            <span className="material-symbols-outlined text-outline mr-3">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search public trips by destination, title, author or keywords..."
              className="w-full bg-transparent border-none text-sm text-on-surface outline-none placeholder:text-outline-variant"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-4 flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider shrink-0">Filter:</span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3 py-3 text-sm text-on-surface font-semibold outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Adventure">Adventure</option>
              <option value="Culture">Culture & Heritage</option>
              <option value="Romance">Romance & Art</option>
              <option value="Modern">Modern & Tech</option>
            </select>
          </div>

        </div>
      </div>

      {/* ── Public Itineraries Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredCommunityTrips.map(commTrip => {
          const publicUrl = `${window.location.origin}/?shared=${commTrip.shareToken}`;
          const isCopied = copiedToken === commTrip.shareToken;

          return (
            <div
              key={commTrip.id}
              className="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Banner & Badges */}
                <div className="relative h-56 w-full overflow-hidden bg-surface-container-high">
                  <img 
                    src={commTrip.image} 
                    alt={commTrip.title} 
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {/* Destination Tag */}
                  <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-on-surface flex items-center gap-1.5 shadow">
                    <span className="text-base">{commTrip.flag}</span>
                    <span>{commTrip.destination}</span>
                  </div>

                  {/* Public Share Badge */}
                  <div className="absolute top-4 right-4 bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow">
                    <span className="material-symbols-outlined text-[14px]">public</span>
                    Public URL Ready
                  </div>

                  {/* Title on Banner */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h2 className="text-xl font-bold leading-tight text-white mb-1 drop-shadow-md">
                      {commTrip.title}
                    </h2>
                    <p className="text-xs text-white/80 font-medium">
                      {commTrip.days} Days · {commTrip.travelers} Traveler{commTrip.travelers > 1 ? 's' : ''} · Category: <span className="font-bold text-white">{commTrip.category}</span>
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-5">
                  
                  {/* Author Profile Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                    <div className="flex items-center gap-3">
                      <img src={commTrip.authorAvatar} alt={commTrip.author} className="w-10 h-10 rounded-full object-cover border border-outline-variant" />
                      <div>
                        <p className="text-sm font-bold text-on-surface leading-tight">{commTrip.author}</p>
                        <p className="text-xs text-on-surface-variant">{commTrip.authorHandle} · {commTrip.publishDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-semibold text-on-surface-variant">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-error">favorite</span> {commTrip.likes}</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-primary">file_copy</span> {commTrip.clones} copies</span>
                    </div>
                  </div>

                  {/* Itinerary Summary */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Itinerary Summary</h4>
                    <p className="text-sm text-on-surface leading-relaxed line-clamp-3 mb-3">
                      {commTrip.summary}
                    </p>

                    {/* Key Stops Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {commTrip.keyStops.map((stop, idx) => (
                        <span key={idx} className="text-[11px] font-semibold bg-surface-container-high text-on-surface px-2.5 py-1 rounded-md border border-outline-variant/20 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px] text-primary">location_on</span>
                          {stop}
                        </span>
                      ))}
                    </div>

                    {/* Budget Overview Badge */}
                    <div className="bg-surface-container-low border border-outline-variant/30 p-3 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[20px]">account_balance_wallet</span>
                        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Planned Budget</span>
                      </div>
                      <span className="text-base font-bold text-primary">₹{commTrip.budget.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Public URL Box Component */}
                  <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-3 space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">link</span>
                      Public URL (Shareable Link)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={publicUrl}
                        className="w-full bg-surface-container text-xs text-on-surface px-3 py-2 rounded-lg border border-outline-variant/20 outline-none font-mono select-all"
                      />
                      <button
                        onClick={() => handleCopyPublicUrl(commTrip.shareToken)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border-none cursor-pointer shrink-0 flex items-center gap-1 ${
                          isCopied ? 'bg-green-600 text-white' : 'bg-surface-container-high hover:bg-outline-variant/30 text-on-surface'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">{isCopied ? 'check' : 'content_copy'}</span>
                        {isCopied ? 'Copied!' : 'Copy Link'}
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0 border-t border-outline-variant/20 mt-4 flex flex-wrap gap-2 justify-between items-center bg-surface">
                
                {/* Read-Only View Button */}
                <button
                  onClick={() => setReadOnlyTrip(commTrip)}
                  className="px-4 py-2.5 border border-outline text-on-surface hover:bg-surface-container rounded-xl text-xs font-bold transition-colors border-none cursor-pointer bg-transparent flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  Read-Only View
                </button>

                <div className="flex items-center gap-2">
                  {/* Social Share Button */}
                  <button
                    onClick={() => setSocialModalTrip(commTrip)}
                    className="p-2.5 bg-surface-container-high hover:bg-outline-variant/30 text-on-surface rounded-xl transition-colors border-none cursor-pointer flex items-center justify-center"
                    title="Share to Social Media"
                  >
                    <span className="material-symbols-outlined text-[18px]">share</span>
                  </button>

                  {/* "Copy Trip" Button (Primary CTA) */}
                  <button
                    onClick={() => handleCopyTripToAccount(commTrip)}
                    className="px-5 py-2.5 bg-primary text-on-primary hover:bg-primary-container rounded-xl text-xs font-bold transition-all border-none cursor-pointer shadow-md flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    Copy Trip
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* ── 1. READ-ONLY VIEW MODAL ── */}
      {readOnlyTrip && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface border border-outline-variant/30 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col my-auto">
            
            {/* Modal Header Banner */}
            <div className="relative h-48 w-full bg-surface-container-high shrink-0">
              <img src={readOnlyTrip.image} alt={readOnlyTrip.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              
              <button
                onClick={() => setReadOnlyTrip(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors border-none cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/90 text-on-primary text-[11px] font-bold rounded-full uppercase tracking-wider mb-2">
                  <span className="material-symbols-outlined text-[14px]">visibility</span>
                  Read-Only Community Preview
                </span>
                <h2 className="text-2xl font-bold text-white">{readOnlyTrip.title}</h2>
                <p className="text-xs text-white/80">Creator: {readOnlyTrip.author} ({readOnlyTrip.authorHandle}) · {readOnlyTrip.destination}</p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-6 flex-grow">
              
              {/* Info Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-container-low border border-outline-variant/20 p-4 rounded-xl text-center">
                <div>
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant block">Duration</span>
                  <span className="text-sm font-bold text-on-surface">{readOnlyTrip.days} Days</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant block">Travelers</span>
                  <span className="text-sm font-bold text-on-surface">{readOnlyTrip.travelers} Person</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant block">Category</span>
                  <span className="text-sm font-bold text-on-surface">{readOnlyTrip.category}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant block">Budget</span>
                  <span className="text-sm font-bold text-primary">₹{readOnlyTrip.budget.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Read-only Itinerary Summary */}
              <div>
                <h3 className="text-base font-bold text-on-surface mb-2">Itinerary Summary Description</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed italic bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20">
                  "{readOnlyTrip.summary}"
                </p>
              </div>

              {/* Day-by-Day Read-Only Timeline */}
              <div>
                <h3 className="text-base font-bold text-on-surface mb-4">Day-by-Day Itinerary Schedule</h3>
                <div className="space-y-4">
                  {readOnlyTrip.itinerary.map(dayObj => (
                    <div key={dayObj.day} className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Day {dayObj.day}</span>
                        <h4 className="text-sm font-bold text-on-surface">{dayObj.title}</h4>
                      </div>
                      <div className="space-y-2">
                        {dayObj.activities.map((act, i) => (
                          <div key={i} className="flex items-center justify-between bg-surface-container px-3 py-2 rounded-lg text-xs">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                              <span className="font-bold text-on-surface">{act.time}</span>
                              <span className="text-on-surface font-semibold">— {act.title}</span>
                            </div>
                            <span className="font-bold text-primary">₹{act.cost.toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Public URL Field inside Modal */}
              <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-4 space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Public Share URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/?shared=${readOnlyTrip.shareToken}`}
                    className="w-full bg-surface-container-lowest text-xs text-on-surface px-3 py-2.5 rounded-lg border border-outline-variant/30 outline-none font-mono"
                  />
                  <button
                    onClick={() => handleCopyPublicUrl(readOnlyTrip.shareToken)}
                    className="px-4 py-2.5 bg-primary text-on-primary rounded-lg text-xs font-bold border-none cursor-pointer shrink-0"
                  >
                    Copy URL
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-6 border-t border-outline-variant/30 bg-surface flex justify-between items-center gap-4 shrink-0">
              <button
                onClick={() => setReadOnlyTrip(null)}
                className="px-6 py-2.5 border border-outline text-on-surface hover:bg-surface-container rounded-xl text-xs font-semibold border-none cursor-pointer bg-transparent"
              >
                Close Preview
              </button>

              <button
                onClick={() => handleCopyTripToAccount(readOnlyTrip)}
                className="px-8 py-3 bg-primary text-on-primary hover:bg-primary-container rounded-xl text-sm font-bold border-none cursor-pointer shadow-lg flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">content_copy</span>
                Copy Trip to My Account
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── 2. SOCIAL MEDIA SHARING MODAL ── */}
      {socialModalTrip && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-outline-variant/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6">
            
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">share</span>
                Social Media Sharing
              </h3>
              <button onClick={() => setSocialModalTrip(null)} className="text-on-surface-variant hover:text-on-surface bg-transparent border-none cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant">
              Share <strong>"{socialModalTrip.title}"</strong> across your social channels with a single click:
            </p>

            {/* Social Media Buttons Grid */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this travel itinerary for ${socialModalTrip.destination}: ${window.location.origin}/?shared=${socialModalTrip.shareToken}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#25D366]/10 text-[#25D366] font-bold text-xs hover:bg-[#25D366]/20 transition-colors no-underline border border-[#25D366]/30 justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                WhatsApp
              </a>

              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Exploring ${socialModalTrip.title} on GlobeTrotter!`)}&url=${encodeURIComponent(`${window.location.origin}/?shared=${socialModalTrip.shareToken}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-black/10 dark:bg-white/10 text-on-surface font-bold text-xs hover:bg-black/20 transition-colors no-underline border border-outline-variant/30 justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                Twitter / X
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/?shared=${socialModalTrip.shareToken}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#1877F2]/10 text-[#1877F2] font-bold text-xs hover:bg-[#1877F2]/20 transition-colors no-underline border border-[#1877F2]/30 justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
                Facebook
              </a>

              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${window.location.origin}/?shared=${socialModalTrip.shareToken}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] font-bold text-xs hover:bg-[#0A66C2]/20 transition-colors no-underline border border-[#0A66C2]/30 justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">work</span>
                LinkedIn
              </a>

            </div>

            {/* Direct URL copy button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  handleCopyPublicUrl(socialModalTrip.shareToken);
                  setSocialModalTrip(null);
                }}
                className="w-full py-3 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container transition-colors border-none cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">content_copy</span>
                Copy Direct Share Link
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── 3. DATE PICKER MODAL (before copying) ── */}
      {datePickerTrip && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-outline-variant/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 animate-in">

            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">date_range</span>
                  Choose Your Travel Dates
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Pick your preferred dates for <strong>"{datePickerTrip.title}"</strong>
                </p>
              </div>
              <button
                onClick={() => setDatePickerTrip(null)}
                className="text-on-surface-variant hover:text-on-surface bg-transparent border-none cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Trip Summary Badge */}
            <div className="flex items-center gap-3 bg-surface-container-low border border-outline-variant/20 rounded-xl p-3">
              <img src={datePickerTrip.image} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-on-surface truncate">{datePickerTrip.destination}</p>
                <p className="text-xs text-on-surface-variant">
                  {datePickerTrip.days} Days · {datePickerTrip.travelers} Traveler{datePickerTrip.travelers > 1 ? 's' : ''} · ₹{datePickerTrip.budget.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Date Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">Start Date</label>
                <input
                  type="date"
                  value={copyStartDate}
                  onChange={e => {
                    setCopyStartDate(e.target.value);
                    // Auto-adjust end date to maintain same trip duration
                    if (e.target.value) {
                      const newStart = new Date(e.target.value);
                      const newEnd = new Date(newStart);
                      newEnd.setDate(newStart.getDate() + datePickerTrip.days - 1);
                      setCopyEndDate(newEnd.toISOString().split('T')[0]);
                    }
                  }}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3 py-3 text-sm text-on-surface outline-none focus:border-primary transition-colors cursor-pointer font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">End Date</label>
                <input
                  type="date"
                  value={copyEndDate}
                  min={copyStartDate}
                  onChange={e => setCopyEndDate(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3 py-3 text-sm text-on-surface outline-none focus:border-primary transition-colors cursor-pointer font-semibold"
                />
              </div>
            </div>

            {/* Duration Preview */}
            {copyStartDate && copyEndDate && (
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">flight_takeoff</span>
                  <span className="text-xs font-bold text-on-surface">
                    {Math.max(1, Math.ceil((new Date(copyEndDate).getTime() - new Date(copyStartDate).getTime()) / 86400000) + 1)} day trip
                  </span>
                </div>
                <span className="text-xs text-on-surface-variant font-medium">
                  {new Date(copyStartDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  {' → '}
                  {new Date(copyEndDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setDatePickerTrip(null)}
                className="flex-1 px-4 py-3 border border-outline text-on-surface hover:bg-surface-container rounded-xl text-sm font-semibold cursor-pointer bg-transparent"
              >
                Cancel
              </button>
              <button
                onClick={confirmCopyWithDates}
                disabled={copyLoading || !copyStartDate || !copyEndDate}
                className="flex-1 px-4 py-3 bg-primary text-on-primary hover:bg-primary-container rounded-xl text-sm font-bold border-none cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copyLoading ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    Copying...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">content_copy</span>
                    Confirm & Copy Trip
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
