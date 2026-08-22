import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

// ─── helpers ───────────────────────────────────────────────
const fmt = (n: number) =>
  n > 0 ? `₹${n.toLocaleString('en-IN')}` : 'Free';

function activityIcon(title = '') {
  const t = title.toLowerCase();
  if (t.includes('hotel') || t.includes('check-in') || t.includes('stay') || t.includes('resort') || t.includes('hostel')) return 'hotel';
  if (t.includes('flight') || t.includes('airport') || t.includes('fly')) return 'flight';
  if (t.includes('train') || t.includes('metro') || t.includes('bus') || t.includes('transit')) return 'train';
  if (t.includes('food') || t.includes('dinner') || t.includes('lunch') || t.includes('breakfast') || t.includes('restaurant') || t.includes('cafe') || t.includes('dhaba') || t.includes('cuisine') || t.includes('eat') || t.includes('dining')) return 'restaurant';
  if (t.includes('museum') || t.includes('fort') || t.includes('palace') || t.includes('temple') || t.includes('church') || t.includes('cathedral') || t.includes('monument') || t.includes('ruins') || t.includes('archaeological')) return 'account_balance';
  if (t.includes('beach') || t.includes('cruise') || t.includes('boat') || t.includes('sail') || t.includes('catamaran') || t.includes('yacht')) return 'sailing';
  if (t.includes('shopping') || t.includes('market') || t.includes('souk') || t.includes('bazaar') || t.includes('mall')) return 'shopping_bag';
  if (t.includes('hike') || t.includes('trek') || t.includes('adventure') || t.includes('safari') || t.includes('atv') || t.includes('mount') || t.includes('volcano')) return 'hiking';
  if (t.includes('class') || t.includes('cooking') || t.includes('workshop') || t.includes('lesson') || t.includes('learn')) return 'school';
  if (t.includes('show') || t.includes('dance') || t.includes('theatre') || t.includes('music') || t.includes('concert') || t.includes('performance')) return 'theater_comedy';
  if (t.includes('garden') || t.includes('park') || t.includes('nature') || t.includes('forest') || t.includes('waterfall')) return 'eco';
  return 'local_activity';
}

const ICON_COLORS: Record<string, string> = {
  hotel: 'bg-tertiary-container text-on-tertiary-container',
  flight: 'bg-secondary-container text-on-secondary-container',
  train: 'bg-secondary-container text-on-secondary-container',
  restaurant: 'bg-red-100 text-red-700',
  account_balance: 'bg-primary-container text-on-primary-container',
  sailing: 'bg-blue-100 text-blue-700',
  shopping_bag: 'bg-tertiary-container text-on-tertiary-container',
  hiking: 'bg-green-100 text-green-700',
  school: 'bg-amber-100 text-amber-700',
  theater_comedy: 'bg-purple-100 text-purple-700',
  eco: 'bg-emerald-100 text-emerald-700',
  local_activity: 'bg-primary-container text-on-primary-container',
};

function getActivityCategory(act: any): 'lodging' | 'transit' | 'dining' | 'activities' {
  if (act?.category) {
    const c = String(act.category).toLowerCase();
    if (c.includes('lodging') || c.includes('hotel') || c.includes('accommodation') || c.includes('stay') || c.includes('resort')) return 'lodging';
    if (c.includes('transit') || c.includes('transport') || c.includes('flight') || c.includes('drive') || c.includes('train')) return 'transit';
    if (c.includes('dining') || c.includes('food') || c.includes('restaurant') || c.includes('meal')) return 'dining';
    if (c.includes('activity') || c.includes('sightseeing') || c.includes('culture') || c.includes('adventure') || c.includes('beach') || c.includes('nature')) return 'activities';
  }
  const text = `${act?.title || ''} ${act?.note || ''} ${act?.location || ''}`.toLowerCase();
  
  if (text.includes('hotel') || text.includes('check-in') || text.includes('stay') || text.includes('resort') || text.includes('hostel') || text.includes('villa') || text.includes('airbnb') || text.includes('lodging') || text.includes('suite') || text.includes('guesthouse')) {
    return 'lodging';
  }
  if (text.includes('flight') || text.includes('airport') || text.includes('fly') || text.includes('train') || text.includes('metro') || text.includes('bus') || text.includes('transit') || text.includes('cab') || text.includes('taxi') || text.includes('ferry') || text.includes('auto-rickshaw') || text.includes('drive') || text.includes('transfer') || text.includes('transport') || text.includes('car rental')) {
    return 'transit';
  }
  if (text.includes('food') || text.includes('dinner') || text.includes('lunch') || text.includes('breakfast') || text.includes('restaurant') || text.includes('cafe') || text.includes('dhaba') || text.includes('cuisine') || text.includes('eat') || text.includes('dining') || text.includes('meal') || text.includes('brunch') || text.includes('tasting') || text.includes('snack') || text.includes('bistro') || text.includes('bar') || text.includes('pub') || text.includes('bakery') || text.includes('izakaya') || text.includes('sushi') || text.includes('ramen') || text.includes('tapas') || text.includes('taverna') || text.includes('warung') || text.includes('trattoria') || text.includes('omakase')) {
    return 'dining';
  }
  return 'activities';
}

// ─── component ─────────────────────────────────────────────
export default function ItineraryDetailsScreen() {
  const { trips, activeTripId, addExpense, deleteExpense, navigateTo, updateTrip } =
    useContext(AppContext) as any;

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expCategory, setExpCategory] = useState('dining');
  const [expAmount, setExpAmount] = useState('');

  const trip = trips?.find((t: any) => t.id === activeTripId);

  // ── no trip ──
  if (!trip) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-12 text-center bg-background">
        <span className="material-symbols-outlined text-[64px] text-outline mb-4">map</span>
        <h2 className="text-headline-lg font-bold mb-4">No Trip Selected</h2>
        <p className="text-body-md text-on-surface-variant mb-6">
          Select a trip from My Trips to view its full itinerary.
        </p>
        <button
          onClick={() => navigateTo('my-trips')}
          className="bg-primary text-on-primary px-6 py-2 rounded-lg text-label-md font-semibold border-none cursor-pointer"
        >
          Go to My Trips
        </button>
      </div>
    );
  }

  // ── handlers ──
  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim() || !expAmount) return;
    addExpense(trip.id, {
      title: expTitle,
      category: expCategory,
      amount: parseFloat(expAmount) || 0,
    });
    setExpTitle('');
    setExpAmount('');
    setShowAddExpense(false);
  };

  const handleAddDay = () => {
    const nextDay = (trip.itinerary?.length || 0) + 1;
    const end = new Date(trip.endDate);
    end.setDate(end.getDate() + 1);
    const newEnd = end.toISOString().split('T')[0];
    updateTrip?.(trip.id, {
      endDate: newEnd,
      itinerary: [
        ...(trip.itinerary || []),
        { day: nextDay, date: newEnd, activities: [] },
      ],
    });
  };

  const handleShare = () => {
    const url = `${window.location.origin}/?shared=${trip.share_token || trip.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  // ── budget maths ──
  const expenses: any[] = trip.expenses || [];
  const byCategory = (cat: string) =>
    expenses.filter((e) => e.category === cat).reduce((s, e) => s + (e.amount || 0), 0);

  const allItineraryActivities = (trip.itinerary || []).flatMap((d: any) => d.activities || []);
  
  const itineraryLodging = allItineraryActivities
    .filter((a: any) => getActivityCategory(a) === 'lodging')
    .reduce((s: number, a: any) => s + (a.cost || 0), 0);

  const itineraryTransit = allItineraryActivities
    .filter((a: any) => getActivityCategory(a) === 'transit')
    .reduce((s: number, a: any) => s + (a.cost || 0), 0);

  const itineraryDining = allItineraryActivities
    .filter((a: any) => getActivityCategory(a) === 'dining')
    .reduce((s: number, a: any) => s + (a.cost || 0), 0);

  const itineraryActivities = allItineraryActivities
    .filter((a: any) => getActivityCategory(a) === 'activities')
    .reduce((s: number, a: any) => s + (a.cost || 0), 0);

  const lodging = byCategory('lodging') + itineraryLodging;
  const transit = byCategory('transit') + itineraryTransit;
  const dining = byCategory('dining') + itineraryDining;
  const activities = byCategory('activities') + itineraryActivities;
  
  const other = expenses
    .filter((e) => !['lodging', 'transit', 'dining', 'activities'].includes(e.category))
    .reduce((s, e) => s + (e.amount || 0), 0);
  const totalSpent = lodging + transit + dining + activities + other;
  const budget = trip.budget || 0;
  const dayCount = (trip.itinerary || []).length || 1;
  const totalActivities = (trip.itinerary || []).reduce(
    (s: number, d: any) => s + (d.activities?.length || 0),
    0,
  );
  const avgPerDay = Math.round(totalSpent / dayCount);
  const targetPerDay = Math.round(budget / dayCount);
  const pct = (v: number) => (budget > 0 ? Math.min(100, Math.round((v / budget) * 100)) : 0);

  // ── calendar grid ──
  const buildGrid = () => {
    const start = new Date(trip.startDate);
    const dow = start.getDay();
    const cells: any[] = [];
    for (let i = 0; i < dow; i++) cells.push(null);
    (trip.itinerary || []).forEach((d: any) => cells.push(d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  };

  return (
    <div className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8 pb-28">

      {/* ── Cover Banner ── */}
      <div className="relative rounded-2xl overflow-hidden mb-8 h-56 md:h-80 shadow-xl">
        <img
          src={trip.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1400'}
          alt={trip.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/90 text-on-primary text-[11px] font-bold rounded-full mb-3 uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px]">trip_origin</span>
            Trip Dashboard
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight drop-shadow">
            {trip.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-white/80 text-sm">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              {trip.destination}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              {new Date(trip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              {' – '}
              {new Date(trip.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">group</span>
              {trip.travelers} Traveler{trip.travelers !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Days',       value: dayCount,                         icon: 'calendar_month',       color: 'text-primary'   },
          { label: 'Total Activities', value: totalActivities,                  icon: 'local_activity',       color: 'text-tertiary'  },
          { label: 'Budget',           value: `₹${budget.toLocaleString('en-IN')}`, icon: 'account_balance_wallet', color: 'text-secondary' },
          { label: 'Spent So Far',     value: `₹${totalSpent.toLocaleString('en-IN')}`, icon: 'receipt', color: totalSpent > budget ? 'text-error' : 'text-on-surface' },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-surface border border-outline-variant/30 rounded-xl p-4 flex items-center gap-3 shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
              <span className={`material-symbols-outlined text-[20px] ${s.color}`}>{s.icon}</span>
            </div>
            <div>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">{s.label}</p>
              <p className="font-bold text-on-surface text-sm">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Action Bar ── */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
          className="px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">
            {viewMode === 'list' ? 'calendar_month' : 'format_list_bulleted'}
          </span>
          {viewMode === 'list' ? 'Calendar View' : 'Timeline View'}
        </button>
        <button
          onClick={handleShare}
          className="px-4 py-2.5 bg-secondary text-on-secondary rounded-lg text-sm font-semibold hover:bg-secondary-container hover:text-on-secondary-container transition-colors shadow-sm cursor-pointer border-none flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">
            {copiedLink ? 'check' : 'share'}
          </span>
          {copiedLink ? 'Link Copied!' : 'Share Trip'}
        </button>
        <button
          onClick={() => navigateTo('build-itinerary', trip.id)}
          className="px-6 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary-container transition-colors shadow-sm cursor-pointer border-none flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
          Edit Itinerary
        </button>
      </div>

      {/* ── Main 2-col Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ──── LEFT: Timeline / Calendar ──── */}
        <div className="lg:col-span-8">

          {viewMode === 'list' ? (
            /* ══════ TIMELINE LIST VIEW ══════ */
            <div className="relative">
              {/* vertical connector line */}
              <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-outline-variant/25 hidden sm:block z-0" />

              <div className="space-y-10">
                {(trip.itinerary || []).map((dayObj: any, index: number) => {
                  const dayCost = (dayObj.activities || []).reduce(
                    (s: number, a: any) => s + (a.cost || 0),
                    0,
                  );
                  const isOver = dayCost > targetPerDay && targetPerDay > 0;

                  return (
                    <div key={dayObj.day} className="relative z-10">
                      {/* Day Header Row */}
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-16 h-16 rounded-2xl bg-primary text-on-primary flex flex-col items-center justify-center shadow-md shrink-0 relative z-10">
                          <span className="text-[9px] uppercase tracking-widest opacity-80 font-bold">Day</span>
                          <span className="text-2xl font-bold leading-none">{dayObj.day}</span>
                        </div>
                        <div className="flex-grow pt-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h2 className="text-xl font-bold text-on-surface">
                              {dayObj.city_header || trip.destination}
                            </h2>
                            {isOver && (
                              <span className="inline-flex items-center gap-1 bg-error-container text-on-error-container text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                <span className="material-symbols-outlined text-[12px]">warning</span>
                                Over Budget
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                              {new Date(dayObj.date).toLocaleDateString('en-IN', {
                                weekday: 'long', month: 'short', day: 'numeric',
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">local_activity</span>
                              {dayObj.activities?.length || 0} activities
                            </span>
                            {dayCost > 0 && (
                              <span className={`flex items-center gap-1 font-semibold ${isOver ? 'text-error' : 'text-primary'}`}>
                                <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
                                ₹{dayCost.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Activity Cards */}
                      <div className="pl-0 sm:pl-20 space-y-3">
                        {dayObj.activities && dayObj.activities.length > 0 ? (
                          dayObj.activities.map((act: any, ai: number) => {
                            const icon = activityIcon(act.title);
                            const colorClass = ICON_COLORS[icon] || ICON_COLORS.local_activity;
                            return (
                              <div
                                key={act.id || ai}
                                className="bg-surface rounded-xl border border-outline-variant/25 p-5 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group"
                              >
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-start gap-4">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                                    <span className="material-symbols-outlined text-[22px]">{icon}</span>
                                  </div>
                                  <div className="flex-grow min-w-0">
                                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                                      <h3 className="font-bold text-on-surface text-sm">{act.title}</h3>
                                      <div className="flex items-center gap-2 shrink-0">
                                        {act.time && (
                                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-container rounded-full text-[11px] font-semibold text-on-surface-variant">
                                            <span className="material-symbols-outlined text-[13px]">schedule</span>
                                            {act.time}
                                          </span>
                                        )}
                                        <span className={`font-bold text-sm ${(act.cost || 0) > 0 ? 'text-primary' : 'text-tertiary'}`}>
                                          {fmt(act.cost || 0)}
                                        </span>
                                      </div>
                                    </div>
                                    {act.location && (
                                      <p className="text-xs text-on-surface-variant flex items-center gap-1 mb-1">
                                        <span className="material-symbols-outlined text-[13px]">location_on</span>
                                        {act.location}
                                      </p>
                                    )}
                                    {act.note && (
                                      <p className="text-xs text-outline italic bg-surface-container px-3 py-2 rounded-lg mt-2 border-l-2 border-outline-variant/30">
                                        "{act.note}"
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="py-8 border-2 border-dashed border-outline-variant/30 rounded-xl text-center bg-surface-container-lowest/30">
                            <span className="material-symbols-outlined text-[32px] text-outline-variant mb-2 block">add_circle</span>
                            <p className="text-sm text-on-surface-variant italic">No activities planned yet.</p>
                            <button
                              onClick={() => navigateTo('build-itinerary', trip.id)}
                              className="mt-2 text-primary text-xs font-bold hover:underline bg-transparent border-none cursor-pointer"
                            >
                              Add activities →
                            </button>
                          </div>
                        )}

                        {/* Day total footer */}
                        {dayObj.activities && dayObj.activities.length > 0 && (
                          <div className="flex justify-between items-center pt-2 px-2 text-xs text-on-surface-variant border-t border-outline-variant/20 mt-1">
                            <span>{dayObj.activities.length} activities</span>
                            <span>
                              Day total:{' '}
                              <span className={`font-bold ${isOver ? 'text-error' : 'text-on-surface'}`}>
                                ₹{dayCost.toLocaleString('en-IN')}
                              </span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Connector arrow between days */}
                      {index < (trip.itinerary || []).length - 1 && (
                        <div className="hidden sm:flex justify-center pl-20 py-3">
                          <div className="flex flex-col items-center gap-0.5 text-outline-variant/40">
                            <div className="w-px h-3 bg-outline-variant/30" />
                            <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add Day */}
                <div className="pl-0 sm:pl-20 pt-2">
                  <button
                    onClick={handleAddDay}
                    className="w-full py-4 border-2 border-dashed border-outline-variant/40 rounded-xl text-on-surface-variant font-semibold text-sm hover:border-primary hover:text-primary bg-surface/30 hover:bg-surface/60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined">add</span> Add Day
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ══════ CALENDAR GRID VIEW ══════ */
            <div className="bg-surface border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-on-surface">Trip Calendar</h3>
                <span className="text-xs text-on-surface-variant font-semibold bg-surface-container px-3 py-1 rounded-full">
                  {(trip.itinerary || []).length} Days
                </span>
              </div>

              {/* Day-of-week headers */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d} className="text-center text-[10px] font-bold text-on-surface-variant uppercase tracking-wider py-2">
                    {d}
                  </div>
                ))}
              </div>

              {/* Grid cells */}
              <div className="grid grid-cols-7 gap-1">
                {buildGrid().map((dayObj: any, i: number) => {
                  if (!dayObj) return <div key={`empty-${i}`} className="min-h-[90px] rounded-lg bg-surface-container-lowest/20" />;
                  const dayCost = (dayObj.activities || []).reduce((s: number, a: any) => s + (a.cost || 0), 0);
                  const isOver = dayCost > targetPerDay && targetPerDay > 0;
                  const isNear = dayCost > targetPerDay * 0.8 && !isOver && targetPerDay > 0;
                  return (
                    <button
                      key={dayObj.day}
                      onClick={() => setViewMode('list')}
                      className={`min-h-[90px] p-2 rounded-lg border flex flex-col justify-between transition-all cursor-pointer hover:scale-[1.03] text-left ${
                        isOver
                          ? 'bg-red-50 border-red-200 hover:bg-red-100'
                          : isNear
                          ? 'bg-amber-50 border-amber-200 hover:bg-amber-100'
                          : 'bg-surface-container-low border-outline-variant/30 hover:bg-surface-container'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-primary">Day {dayObj.day}</span>
                          {isOver && <span className="material-symbols-outlined text-error text-[14px]">warning</span>}
                          {isNear && <span className="material-symbols-outlined text-amber-500 text-[14px]">info</span>}
                        </div>
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase block">
                          {new Date(dayObj.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </span>
                        <p className="text-[9px] text-on-surface-variant truncate mt-1">{dayObj.city_header || trip.destination}</p>
                      </div>
                      <div className="mt-2 pt-1 border-t border-outline-variant/15 flex justify-between items-end">
                        <span className="text-[9px] text-on-surface-variant">{dayObj.activities?.length || 0} acts</span>
                        <span className={`text-[10px] font-bold ${isOver ? 'text-error' : 'text-on-surface'}`}>
                          {dayCost > 0 ? `₹${dayCost.toLocaleString('en-IN')}` : '—'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-outline-variant/20">
                {[
                  { color: 'bg-surface-container-low border border-outline-variant/30', label: 'On Budget' },
                  { color: 'bg-amber-50 border border-amber-200', label: 'Near Limit (80%+)' },
                  { color: 'bg-red-50 border border-red-200', label: 'Over Budget' },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                    <div className={`w-3 h-3 rounded ${l.color}`} />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ──── RIGHT: Budget Sidebar ──── */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">

            {/* Budget Summary Card */}
            <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
              <div className="p-5 border-b border-outline-variant/20 bg-surface-container-lowest flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Trip Expenses</h3>
                  <p className="text-sm text-on-surface-variant">Spending breakdown</p>
                </div>
                <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${totalSpent > budget ? 'bg-error-container text-on-error-container' : 'bg-primary-container text-on-primary-container'}`}>
                  {totalSpent > budget ? 'Over Budget' : 'On Track'}
                </span>
              </div>

              <div className="p-5 space-y-5">
                {/* Totals */}
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[10px] text-outline uppercase tracking-wider block mb-1">Total Spent</span>
                    <div className="text-3xl font-bold text-primary">₹{totalSpent.toLocaleString('en-IN')}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-outline uppercase tracking-wider block mb-1">Budget</span>
                    <div className="text-lg font-semibold text-on-surface">₹{budget.toLocaleString('en-IN')}</div>
                  </div>
                </div>

                {/* Global bar */}
                <div>
                  <div className="w-full bg-surface-variant rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${totalSpent > budget ? 'bg-error' : 'bg-primary'}`}
                      style={{ width: `${Math.min(100, (totalSpent / Math.max(budget, 1)) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-on-surface-variant mt-1">
                    <span>{pct(totalSpent)}% used</span>
                    <span>₹{Math.max(0, budget - totalSpent).toLocaleString('en-IN')} left</span>
                  </div>
                </div>

                {/* Daily averages */}
                <div className="grid grid-cols-2 gap-3 py-3 bg-surface-container-low rounded-xl border border-outline-variant/15 text-center">
                  <div>
                    <span className="text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">Avg Spent/Day</span>
                    <span className="text-sm font-bold text-on-surface block mt-1">₹{avgPerDay.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">Target/Day</span>
                    <span className="text-sm font-bold text-on-surface block mt-1">₹{targetPerDay.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Category bars */}
                <div className="space-y-3">
                  {[
                    { label: 'Accommodation', val: lodging,    color: 'bg-primary'         },
                    { label: 'Dining',         val: dining,     color: 'bg-tertiary'        },
                    { label: 'Activities',     val: activities, color: 'bg-secondary'       },
                    { label: 'Transport',      val: transit,    color: 'bg-outline'         },
                    ...(other > 0 ? [{ label: 'Other', val: other, color: 'bg-outline-variant' }] : []),
                  ].map((c) => (
                    <div key={c.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-on-surface font-medium">{c.label}</span>
                        <span className="text-on-surface-variant font-semibold">
                          ₹{c.val.toLocaleString('en-IN')} ({pct(c.val)}%)
                        </span>
                      </div>
                      <div className="w-full bg-surface-variant rounded-full h-2">
                        <div
                          className={`${c.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${pct(c.val)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowAddExpense(!showAddExpense)}
                  className="w-full bg-primary text-on-primary py-3 rounded-lg text-sm font-semibold shadow-sm hover:bg-primary-container transition-colors border-none cursor-pointer"
                >
                  {showAddExpense ? 'Cancel' : 'Log New Expense'}
                </button>
              </div>
            </div>

            {/* Add Expense Form */}
            {showAddExpense && (
              <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 p-5">
                <h4 className="text-lg font-bold mb-4 text-on-surface">Log Expense</h4>
                <form onSubmit={handleExpenseSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs text-on-surface-variant mb-1 font-semibold">Description *</label>
                    <input
                      type="text" required placeholder="e.g. Auto-rickshaw to temple"
                      value={expTitle} onChange={(e) => setExpTitle(e.target.value)}
                      className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm text-on-surface focus:border-primary outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-on-surface-variant mb-1 font-semibold">Category</label>
                      <select
                        value={expCategory} onChange={(e) => setExpCategory(e.target.value)}
                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm text-on-surface focus:border-primary outline-none cursor-pointer"
                      >
                        <option value="lodging">Lodging</option>
                        <option value="transit">Transit</option>
                        <option value="dining">Dining</option>
                        <option value="activities">Activities</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-on-surface-variant mb-1 font-semibold">Amount (₹) *</label>
                      <input
                        type="number" min="1" step="1" required placeholder="0"
                        value={expAmount} onChange={(e) => setExpAmount(e.target.value)}
                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm text-on-surface focus:border-primary outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-secondary text-on-secondary rounded-lg font-semibold hover:bg-secondary-container hover:text-on-secondary-container transition-all cursor-pointer border-none shadow-sm"
                  >
                    Save Expense
                  </button>
                </form>
              </div>
            )}

            {/* Expense Log */}
            <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 p-5">
              <h4 className="text-lg font-bold mb-4 text-on-surface">
                Expense Log ({expenses.length})
              </h4>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {expenses.map((exp: any) => (
                  <div
                    key={exp.id}
                    className="flex justify-between items-center p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-lg group"
                  >
                    <div className="min-w-0 pr-4">
                      <h5 className="text-sm font-bold text-on-surface truncate">{exp.title}</h5>
                      <span className="text-[10px] uppercase font-bold text-outline-variant px-2 py-0.5 rounded bg-surface-container mt-1 inline-block">
                        {exp.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-bold text-on-surface">₹{exp.amount?.toLocaleString('en-IN')}</span>
                      <button
                        onClick={() => deleteExpense(trip.id, exp.id)}
                        className="p-1 rounded-full hover:bg-error-container/30 text-outline hover:text-error transition-all opacity-0 group-hover:opacity-100 bg-transparent border-none cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  </div>
                ))}
                {expenses.length === 0 && (
                  <div className="text-center py-6 text-on-surface-variant italic text-sm">
                    No expenses logged yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
