import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { DESTINATION_DATA } from '../services/activityData';

// ── types ──
interface Activity {
  id: string; title: string; category: string;
  cost?: number; price?: number; time: string; note: string;
  tier: 'must' | 'popular' | 'extended'; icon: string;
}

function getActCost(act: Activity): number {
  return act.price ?? act.cost ?? 0;
}

const DEST_KEYS = Object.keys(DESTINATION_DATA);
const TIER_LABELS: Record<string, string> = { must: 'Must Do', popular: 'Popular', extended: 'Full Itinerary' };

function matchDestination(input: string): string | null {
  if (!input) return null;
  const lower = input.toLowerCase().trim();
  return DEST_KEYS.find(k =>
    lower.includes(k.toLowerCase()) ||
    lower.includes(DESTINATION_DATA[k].country.toLowerCase()) ||
    k.toLowerCase().includes(lower),
  ) ?? null;
}

function tiersForDays(days: number): string[] {
  if (days <= 2) return ['must'];
  if (days <= 5) return ['must', 'popular'];
  return ['must', 'popular', 'extended'];
}

// ══════════════════════════════════════════════════════════════
export default function CreateTripScreen() {
  const { createTrip, generateAutoTrip, navigateTo } = useContext(AppContext) as any;

  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('20000');
  const [travelers, setTravelers] = useState('2');
  const [category, setCategory] = useState('Leisure');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  // ── Auto-Plan State ──
  const [isAutoPlanning, setIsAutoPlanning] = useState(false);
  const [autoPlanStep, setAutoPlanStep] = useState('');
  const [showAutoModal, setShowAutoModal] = useState(false);
  const [autoDest, setAutoDest] = useState('');
  const [autoStart, setAutoStart] = useState('');
  const [autoEnd, setAutoEnd] = useState('');
  const [autoBudget, setAutoBudget] = useState('25000');
  const [autoTravelers, setAutoTravelers] = useState('2');
  const [autoCategory, setAutoCategory] = useState('Leisure');

  const matchedKey = useMemo(() => matchDestination(destination), [destination]);
  const matchedDest = matchedKey ? DESTINATION_DATA[matchedKey] : null;

  const tripDays = useMemo(() => {
    if (!startDate || !endDate) return 0; // 0 = dates not set yet
    const diff = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1;
    return Math.max(1, diff);
  }, [startDate, endDate]);

  // Always show at least Must Do; show more tiers once dates are known
  const allowedTiers = useMemo(() => tiersForDays(tripDays > 0 ? tripDays : 3), [tripDays]);
  const suggestions = useMemo(() => matchedDest?.activities.filter(a => allowedTiers.includes(a.tier)) ?? [], [matchedDest, allowedTiers]);
  const selectedCount = Object.values(selected).filter(Boolean).length;
  const selectedCost = suggestions.filter(a => selected[a.id]).reduce((s, a) => s + getActCost(a), 0);

  const toggle = (id: string) => setSelected(p => ({ ...p, [id]: !p[id] }));

  const pickDest = (key: string) => {
    setDestination(key);
    if (!title) setTitle(`${key} Adventure`);
    if (!coverUrl) setCoverUrl(DESTINATION_DATA[key].image);
    setSelected({});
  };

  const handleAutoPlanTrigger = async (
    targetDest?: string,
    targetStart?: string,
    targetEnd?: string,
    targetBudget?: string,
    targetTravelers?: string,
    targetCategory?: string
  ) => {
    const dest = (targetDest || destination || autoDest).trim();
    const sDate = targetStart || startDate || autoStart;
    const eDate = targetEnd || endDate || autoEnd;
    const bud = targetBudget || budget || autoBudget;
    const trav = targetTravelers || travelers || autoTravelers;
    const cat = targetCategory || category || autoCategory;

    if (!dest || !sDate || !eDate) {
      setAutoDest(dest || destination);
      setAutoStart(sDate || startDate);
      setAutoEnd(eDate || endDate);
      setAutoBudget(bud || budget || '25000');
      setAutoTravelers(trav || travelers || '2');
      setAutoCategory(cat || category || 'Leisure');
      setShowAutoModal(true);
      return;
    }

    if (new Date(eDate) < new Date(sDate)) {
      alert('End date cannot be earlier than start date.');
      return;
    }

    try {
      setIsAutoPlanning(true);
      setAutoPlanStep(`Analyzing top cultural attractions & spots in ${dest}...`);

      const t1 = setTimeout(() => {
        setAutoPlanStep(`Scheduling morning, afternoon & evening activities for each day...`);
      }, 1100);

      const t2 = setTimeout(() => {
        setAutoPlanStep(`Calculating daily expense estimates & optimizing timeline...`);
      }, 2300);

      const newTrip = await generateAutoTrip({
        destination: dest,
        startDate: sDate,
        endDate: eDate,
        budget: parseFloat(bud) || 25000,
        travelers: parseInt(trav) || 1,
        category: cat,
        interests: ['Sightseeing', 'Food', 'Culture', 'Photography']
      });

      clearTimeout(t1);
      clearTimeout(t2);

      if (newTrip) {
        setShowAutoModal(false);
        setIsAutoPlanning(false);
        navigateTo('build-itinerary', newTrip.id);
      }
    } catch (err) {
      setIsAutoPlanning(false);
      alert('Error generating auto itinerary. Please try again.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !destination || !startDate || !endDate) {
      alert('Please fill out Title, Destination, Start Date & End Date.');
      return;
    }
    const start = new Date(startDate);
    const dayCount = tripDays;
    const itinerary = Array.from({ length: dayCount }, (_, i) => {
      const d = new Date(start); d.setDate(start.getDate() + i);
      return { day: i + 1, date: d.toISOString().split('T')[0], activities: [] as any[] };
    });
    const checkedActs = suggestions.filter(a => selected[a.id]);
    // Distribute selected activities evenly across all days (round-robin)
    checkedActs.forEach((act, index) => {
      const dayIndex = index % itinerary.length;
      const actCost = getActCost(act);
      itinerary[dayIndex].activities.push({
        id: `act-${act.id}`,
        title: act.title,
        time: act.time,
        location: destination,
        cost: actCost,
        note: act.note,
      });
    });
    const expenses = checkedActs.filter(a => getActCost(a) > 0).map(a => ({
      title: a.title, category: a.category === 'Dining' ? 'dining' : 'activities', amount: getActCost(a),
    }));
    const fallbackImages = [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200',
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200',
    ];
    createTrip({
      title, destination, startDate, endDate, category,
      travelers: parseInt(travelers) || 1,
      budget: parseFloat(budget) || 20000,
      description,
      image: coverUrl.trim() || matchedDest?.image || fallbackImages[0],
      expenses, itinerary,
    });
  };

  return (
    <div className="flex-grow pt-8 pb-32 px-4 md:px-8 max-w-[1280px] mx-auto w-full">

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-2">Plan a New Trip ✈️</h1>
        <p className="text-on-surface-variant">
          Pick a destination, set your dates, choose activities — or let our 1-click generator build your entire tour.
        </p>
      </header>

      {/* ── AUTO-PLAN BANNER CARD ── */}
      <div className="mb-10 bg-gradient-to-r from-primary/15 via-secondary/15 to-primary-container/20 border border-primary/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-md">
            <span className="material-symbols-outlined text-[30px]">auto_awesome</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-primary text-on-primary">
                Smart Feature
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-on-surface">1-Click Full-Tour Generator</h2>
            </div>
            <p className="text-sm text-on-surface-variant max-w-2xl">
              Select your destination and dates — our system will instantly design an authentic day-by-day tour with morning, afternoon, and evening activities, locations, and budget breakdown.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (destination && startDate && endDate) {
              handleAutoPlanTrigger(destination, startDate, endDate, budget, travelers, category);
            } else {
              setAutoDest(destination);
              setAutoStart(startDate);
              setAutoEnd(endDate);
              setAutoBudget(budget);
              setAutoTravelers(travelers);
              setAutoCategory(category);
              setShowAutoModal(true);
            }
          }}
          className="w-full md:w-auto px-8 py-3.5 bg-primary text-on-primary rounded-xl text-sm font-bold hover:bg-primary-container hover:text-on-primary-container transition-all shadow-md cursor-pointer border-none flex items-center justify-center gap-2 shrink-0 group hover:scale-[1.02]"
        >
          <span className="material-symbols-outlined text-[20px] text-amber-300 group-hover:rotate-12 transition-transform">
            auto_awesome
          </span>
          Auto-Plan My Entire Tour
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">

        {/* ── DESTINATION TILES ── */}
        <section className="bg-surface rounded-2xl border border-outline-variant/30 p-6 md:p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-on-surface mb-1">Choose Your Destination</h2>
            <p className="text-sm text-on-surface-variant">
              Click a tile to select, or type below for a custom destination.
            </p>
          </div>

          {/* 10 tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            {DEST_KEYS.map(key => {
              const d = DESTINATION_DATA[key];
              const isActive = matchedKey === key;
              return (
                <button
                  key={key} type="button" onClick={() => pickDest(key)}
                  className={`relative rounded-xl overflow-hidden h-32 text-left transition-all duration-200 cursor-pointer border-2 hover:scale-[1.04] ${isActive
                    ? 'border-primary shadow-lg shadow-primary/20 scale-[1.04]'
                    : 'border-transparent hover:border-primary/40'
                    }`}
                >
                  <img
                    src={d.image}
                    alt={key}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop';
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  {isActive && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow">
                      <span className="material-symbols-outlined text-on-primary text-[14px]">check</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-2.5">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-base">{d.flag}</span>
                      <p className="text-white text-sm font-bold leading-tight">{key}</p>
                    </div>
                    <p className="text-white/70 text-[10px]">{d.country}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom destination input */}
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1">
              Or type a custom destination *
            </label>
            <input
              type="text" required placeholder="e.g. Kerala, Kyoto, Istanbul, Ladakh…"
              value={destination} onChange={e => setDestination(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-sm text-on-surface focus:border-primary outline-none"
            />
            {matchedDest && (
              <p className="mt-2 text-xs text-primary flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                {matchedDest.flag} {matchedKey} — {matchedDest.description}
              </p>
            )}
          </div>
        </section>

        {/* ── TRIP DETAILS ── */}
        <section className="bg-surface rounded-2xl border border-outline-variant/30 p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-on-surface mb-6">Trip Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1">Trip Title *</label>
              <input type="text" required placeholder="e.g. Rajasthan Royal Expedition" value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-sm text-on-surface focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-sm text-on-surface focus:border-primary outline-none cursor-pointer">
                {['Leisure', 'Adventure', 'Cultural', 'Business', 'Honeymoon', 'Family', 'Solo Backpacking'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1">Start Date *</label>
              <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-sm text-on-surface focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1">End Date *</label>
              <input type="date" required value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-sm text-on-surface focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1">Budget (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">₹</span>
                <input type="number" min="0" placeholder="20000" value={budget} onChange={e => setBudget(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-8 pr-4 py-3 text-sm text-on-surface focus:border-primary outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1">Travelers</label>
              <input type="number" min="1" max="20" value={travelers} onChange={e => setTravelers(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-sm text-on-surface focus:border-primary outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-on-surface mb-1">Cover Image URL (Optional)</label>
              <input type="text" placeholder="https://images.unsplash.com/…" value={coverUrl} onChange={e => setCoverUrl(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-sm text-on-surface focus:border-primary outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-on-surface mb-1">Trip Description (Optional)</label>
              <textarea rows={3} placeholder="Brief overview of your travel goals…" value={description} onChange={e => setDescription(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-sm text-on-surface focus:border-primary outline-none resize-none" />
            </div>
          </div>

          {/* Duration badge */}
          {tripDays > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1 text-sm text-primary font-semibold">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                {tripDays} day{tripDays !== 1 ? 's' : ''} planned
              </span>
              {matchedKey && (
                <span className="text-xs text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full">
                  Showing: {allowedTiers.map(t => TIER_LABELS[t]).join(', ')} activities
                </span>
              )}
            </div>
          )}
        </section>

        {/* ── ACTIVITY SUGGESTIONS ── */}
        {matchedDest && suggestions.length > 0 && (
          <section>
            {/* Section header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-b border-outline-variant/30 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                  <span>{matchedDest.flag}</span>
                  Top Things to Do in {matchedKey}
                </h2>
                <p className="text-sm text-on-surface-variant mt-1">
                  {tripDays > 0
                    ? <>Curated for your <strong>{tripDays}-day</strong> trip — activities will be spread across your days. ✓ Select to add. All costs in ₹.</>
                    : <>Select activities below to distribute across your trip days. <span className="text-primary font-semibold">Set dates above</span> to refine suggestions. All costs in ₹.</>
                  }
                </p>
              </div>
              {selectedCount > 0 && (
                <div className="text-sm font-semibold bg-primary-container text-on-primary-container px-3 py-1.5 rounded-full flex items-center gap-1.5 shrink-0">
                  <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                  {selectedCount} added · ₹{selectedCost.toLocaleString('en-IN')}
                </div>
              )}
            </div>

            {/* Tier badges */}
            {allowedTiers.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {allowedTiers.map(tier => (
                  <span key={tier} className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${tier === 'must' ? 'bg-primary-container text-on-primary-container' :
                    tier === 'popular' ? 'bg-secondary-container text-on-secondary-container' :
                      'bg-tertiary-container text-on-tertiary-container'
                    }`}>
                    {TIER_LABELS[tier]}
                  </span>
                ))}
              </div>
            )}

            {/* Activity cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {suggestions.map(act => {
                const isChecked = !!selected[act.id];
                const actPrice = getActCost(act);
                return (
                  <label
                    key={act.id}
                    className={`cursor-pointer relative bg-surface rounded-xl border-2 overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md ${isChecked
                      ? 'border-primary shadow-md shadow-primary/15'
                      : 'border-outline-variant/30 hover:border-primary/40'
                      }`}
                  >
                    {/* Icon block */}
                    <div className={`relative h-36 flex items-center justify-center shrink-0 ${isChecked ? 'bg-primary-container/40' : 'bg-surface-container'
                      }`}>
                      <span className="material-symbols-outlined text-[52px] text-outline-variant/60">{act.icon}</span>

                      {/* Tier badge */}
                      <div className="absolute top-2 left-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${act.tier === 'must' ? 'bg-primary text-on-primary' :
                          act.tier === 'popular' ? 'bg-secondary text-on-secondary' :
                            'bg-tertiary text-on-tertiary'
                          }`}>
                          {TIER_LABELS[act.tier]}
                        </span>
                      </div>

                      {/* Checkbox */}
                      <div className="absolute top-2 right-2 bg-surface/80 backdrop-blur-sm rounded-full p-1">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded accent-primary cursor-pointer"
                          checked={isChecked}
                          onChange={() => toggle(act.id)}
                        />
                      </div>

                      {/* Checked overlay */}
                      {isChecked && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                            <span className="material-symbols-outlined text-on-primary text-[24px]">check</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider">{act.category}</span>
                        <span className="text-xs font-bold text-primary">{act.time}</span>
                      </div>
                      <h3 className="font-bold text-on-surface text-sm mb-1 leading-snug">{act.title}</h3>
                      <p className="text-xs text-on-surface-variant line-clamp-2 flex-grow">{act.note}</p>
                      <div className="mt-3 pt-2 border-t border-outline-variant/20 flex items-center justify-between">
                        <span className={`font-bold text-sm ${actPrice > 0 ? 'text-on-surface' : 'text-tertiary'}`}>
                          {actPrice > 0 ? `₹${actPrice.toLocaleString('en-IN')}` : 'Free'}
                        </span>
                        <span className={`text-xs font-semibold ${isChecked ? 'text-primary' : 'text-on-surface-variant'}`}>
                          {isChecked ? '✓ Added' : 'Tap to add'}
                        </span>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>
        )}

        {/* No match hint */}
        {destination && !matchedDest && (
          <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-[36px] text-outline-variant mb-2 block">travel_explore</span>
            <p className="text-sm text-on-surface-variant">
              Custom destination: <strong>"{destination}"</strong>
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              Tip: Click the <strong>"Auto-Plan My Entire Tour"</strong> button above or below to generate a tailored day-by-day itinerary automatically!
            </p>
          </section>
        )}

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-2">
          <button
            type="button" onClick={() => navigateTo('my-trips')}
            className="px-8 py-3 border border-outline text-on-surface hover:bg-surface-container rounded-lg text-sm font-semibold cursor-pointer bg-transparent"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleAutoPlanTrigger(destination, startDate, endDate, budget, travelers, category)}
            className="px-8 py-3 bg-secondary text-on-secondary rounded-lg text-sm font-bold hover:bg-secondary-container hover:text-on-secondary-container transition-colors shadow-sm cursor-pointer border-none flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            Auto-Plan Tour (1-Click)
          </button>
          <button
            type="submit"
            className="px-10 py-3 bg-primary text-on-primary rounded-lg text-sm font-bold hover:bg-primary-container transition-colors shadow-sm cursor-pointer border-none flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
            Create Custom Trip
          </button>
        </div>
      </form>

      {/* ── AUTO PLAN MODAL ── */}
      {showAutoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-outline-variant/40 shadow-2xl max-w-lg w-full p-6 md:p-8 relative">
            <button
              onClick={() => setShowAutoModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-container text-on-surface-variant bg-transparent border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow">
                <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-on-surface">Auto-Plan Your Tour</h3>
                <p className="text-xs text-on-surface-variant">Instant full itinerary generated for your dates</p>
              </div>
            </div>

            <div className="space-y-4 my-6">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Destination *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kyoto, Paris, Goa, Ladakh..."
                  value={autoDest}
                  onChange={e => setAutoDest(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:border-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={autoStart}
                    onChange={e => setAutoStart(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={autoEnd}
                    min={autoStart}
                    onChange={e => setAutoEnd(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Budget (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="25000"
                    value={autoBudget}
                    onChange={e => setAutoBudget(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Travelers</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={autoTravelers}
                    onChange={e => setAutoTravelers(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Travel Style</label>
                <select
                  value={autoCategory}
                  onChange={e => setAutoCategory(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary outline-none cursor-pointer"
                >
                  {['Leisure', 'Adventure', 'Cultural', 'Business', 'Honeymoon', 'Family', 'Solo Backpacking'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAutoModal(false)}
                className="px-5 py-2.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-lg bg-transparent border-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAutoPlanTrigger(autoDest, autoStart, autoEnd, autoBudget, autoTravelers, autoCategory)}
                className="px-6 py-2.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container shadow-md cursor-pointer border-none flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
                Generate Complete Tour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LOADING OVERLAY ── */}
      {isAutoPlanning && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[32px] animate-pulse">
                flight_takeoff
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2">Designing Your Day-by-Day Itinerary</h3>
          <p className="text-primary-container text-sm font-semibold animate-pulse max-w-md">
            {autoPlanStep || "Generating comprehensive itinerary..."}
          </p>
          <p className="text-white/60 text-xs mt-4">
            Curating morning, afternoon & evening activities, local food, and optimal routes...
          </p>
        </div>
      )}
    </div>
  );
}
