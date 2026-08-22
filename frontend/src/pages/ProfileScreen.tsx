import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function ProfileScreen() {
  const { user, trips, updateProfile, logout, navigateTo } = useContext(AppContext);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [countries, setCountries] = useState(user?.countriesVisited || '0');
  const [email, setEmail] = useState(user?.email || '');
  const [language, setLanguage] = useState(user?.language || 'English');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, bio, avatar, parseInt(String(countries)) || 0, language);
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    const confirm = window.confirm("Are you absolutely sure you want to delete your GlobeTrotter account? This action is permanent and deletes all SQL databases and itineraries.");
    if (confirm) {
      alert("Account successfully deleted.");
      logout();
    }
  };

  // Convert comma separated saved destinations to array safely
  const savedDestList = Array.isArray(user?.saved_destinations)
    ? user.saved_destinations
    : (typeof user?.saved_destinations === 'string' && user.saved_destinations
        ? (user.saved_destinations as string).split(';').map(d => d.trim())
        : (user?.savedDestinations
            ? user.savedDestinations.split(';').map(d => d.trim())
            : ["Amalfi Coast, Italy", "Tokyo, Japan", "Swiss Alps, Switzerland"]));

  const formatDateStr = (dateStr?: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    if (!y || !m || !d) return dateStr;
    const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    return dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="flex-grow max-w-container-max-width w-full mx-auto px-margin-mobile md:px-margin-desktop py-12">

      {/* Profile Card */}
      <div className="bg-surface border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-sm mb-12">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-full overflow-hidden bg-surface-container-high border-4 border-primary shrink-0 shadow-md">
            <img
              alt={user?.name}
              className="w-full h-full object-cover"
              src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";
              }}
            />
          </div>

          {/* User Details */}
          <div className="flex-grow text-center md:text-left space-y-4 w-full">
            {!isEditing ? (
              <>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-display-lg font-bold text-on-surface mb-1">{user?.name}</h1>
                    <p className="text-body-md text-on-surface-variant mb-1">{user?.email}</p>
                    <p className="text-body-md text-primary font-semibold flex items-center justify-center md:justify-start gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">public</span>
                      {user?.countriesVisited} Countries Visited
                      <span className="text-outline-variant">•</span>
                      <span className="material-symbols-outlined text-[18px]">translate</span>
                      {user?.language || 'English'}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setName(user?.name || '');
                        setBio(user?.bio || '');
                        setAvatar(user?.avatar || '');
                        setCountries(user?.countriesVisited || '0');
                        setEmail(user?.email || '');
                        setLanguage(user?.language || 'English');
                        setIsEditing(true);
                      }}
                      className="px-6 py-2.5 bg-primary text-on-primary hover:bg-primary-container rounded-lg text-label-md font-semibold transition-colors shadow-sm cursor-pointer border-none"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-4 py-2.5 bg-error/10 text-error hover:bg-error/20 rounded-lg text-label-md font-semibold transition-colors cursor-pointer border-none"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
                <p className="text-body-lg text-on-surface-variant leading-relaxed italic">
                  "{user?.bio || 'No bio written yet.'}"
                </p>
                <div className="flex justify-center md:justify-start gap-4">
                  <div className="bg-surface-container border border-outline-variant/20 px-4 py-2 rounded-lg text-center">
                    <span className="text-headline-md font-bold text-on-surface block">{trips.length}</span>
                    <span className="text-label-sm text-on-surface-variant uppercase tracking-wider text-[10px]">Total Trips</span>
                  </div>
                  <div className="bg-surface-container border border-outline-variant/20 px-4 py-2 rounded-lg text-center">
                    <span className="text-headline-md font-bold text-on-surface block">
                      ₹{trips.reduce((sum, t) => sum + (t.budget || 0), 0).toLocaleString('en-IN')}
                    </span>
                    <span className="text-label-sm text-on-surface-variant uppercase tracking-wider text-[10px]">Invested Budget</span>
                  </div>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-headline-md font-bold text-on-surface">Edit Profile Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-body-md text-on-surface focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-body-md text-on-surface focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-1">Countries Visited</label>
                    <input
                      type="number"
                      min="0"
                      value={countries}
                      onChange={(e) => setCountries(e.target.value)}
                      className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-body-md text-on-surface focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-1">Language Preference</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-body-md text-on-surface focus:border-primary outline-none cursor-pointer"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="Japanese">Japanese</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-1">Avatar Image URL</label>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-body-md text-on-surface focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-1">Bio</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface focus:border-primary outline-none resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-transparent text-on-surface-variant hover:bg-surface-container rounded-lg text-label-sm font-semibold border-none cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-on-primary hover:bg-primary-container rounded-lg text-label-sm font-semibold border-none cursor-pointer shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Preplanned / Active Trips Section */}
      <section className="space-y-6 mb-12">
        <div className="flex items-center justify-between">
          <h2 className="text-headline-lg font-bold text-on-surface">Active Plans</h2>
          <button
            onClick={() => navigateTo('my-trips')}
            className="text-primary hover:underline text-label-md font-semibold bg-transparent border-none cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-gutter animate-fade-in">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-surface rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigateTo('view-itinerary', trip.id)}
            >
              <div className="h-32 bg-surface-container-high relative overflow-hidden shrink-0">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  alt={trip.title}
                  src={trip.image}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop';
                  }}
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-label-md font-bold text-on-surface truncate mb-1">{trip.title}</h3>
                <p className="text-label-sm text-on-surface-variant mb-4">
                  {formatDateStr(trip.startDate)}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateTo('view-itinerary', trip.id);
                  }}
                  className="mt-auto w-full py-1.5 border border-outline text-on-surface rounded-lg text-label-sm font-semibold hover:bg-surface-container transition-colors cursor-pointer bg-transparent"
                >
                  View
                </button>
              </div>
            </div>
          ))}

          <div
            onClick={() => navigateTo('create-trip')}
            className="bg-surface-container-low rounded-xl border border-dashed border-outline-variant/50 shadow-sm overflow-hidden flex flex-col items-center justify-center p-6 min-h-[200px] hover:bg-surface-container transition-colors cursor-pointer group select-none"
          >
            <span className="material-symbols-outlined text-outline mb-2 group-hover:text-primary transition-colors text-[32px]">add_circle</span>
            <h3 className="text-label-md text-on-surface-variant font-semibold group-hover:text-primary transition-colors">Plan New Trip</h3>
          </div>
        </div>
      </section>

      {/* Saved Destinations & Visited Memories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Saved Destinations list (1/3 width) */}
        <div className="bg-surface border border-outline-variant/30 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-headline-md font-bold text-on-surface">Saved Destinations</h3>
          <p className="text-body-md text-on-surface-variant">Quick list of saved destinations of interest.</p>
          <div className="space-y-2">
            {savedDestList.map((dest, index) => (
              <div
                key={index}
                onClick={() => navigateTo('activity-search', dest)}
                className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg border border-outline-variant/20 hover:bg-surface-container transition-all cursor-pointer group"
              >
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">star</span>
                <span className="text-body-md font-semibold text-on-surface">{dest}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visited Memories (2/3 width) */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-headline-lg font-bold text-on-surface">Visited Memories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              <div className="h-40 relative overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src="https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600"
                  alt="Amalfi Coast"
                />
                <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm px-2 py-1 rounded-md">
                  <span className="text-label-sm font-semibold text-on-surface">2025</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-label-md font-bold text-on-surface mb-1">Amalfi Coast Escape</h3>
                <p className="text-body-sm text-on-surface-variant line-clamp-2">
                  A week-long journey through winding coastal roads, incredible seafood, and Mediterranean vistas.
                </p>
              </div>
            </div>

            <div className="bg-surface rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              <div className="h-40 relative overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600"
                  alt="Tokyo"
                />
                <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm px-2 py-1 rounded-md">
                  <span className="text-label-sm font-semibold text-on-surface">2024</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-label-md font-bold text-on-surface mb-1">Tokyo Discovery</h3>
                <p className="text-body-sm text-on-surface-variant line-clamp-2">
                  Immersed in the vibrant culture, futuristic technology, and culinary scene of Japan's capital.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
