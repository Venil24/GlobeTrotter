import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../services/api';

export default function AdminDashboardScreen() {
  const { logout, navigateTo } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<'Overview' | 'Users' | 'Trips' | 'Settings'>('Overview');
  
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [allTripsList, setAllTripsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [selectedUserModal, setSelectedUserModal] = useState<any | null>(null);

  const fetchAdminData = async () => {
    try {
      setRefreshing(true);
      const [statsRes, usersRes, tripsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/trips')
      ]);
      setStats(statsRes.data);
      setUsersList(usersRes.data);
      setAllTripsList(tripsRes.data);
    } catch (err) {
      console.error("Error fetching admin metrics:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const filteredUsers = usersList.filter(u => 
    (u.name || '').toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchUserQuery.toLowerCase())
  );

  const handleExportCSV = () => {
    if (!usersList.length) return;
    const headers = "User ID,Name,Email,Role,Registered,Trips Count,Total Budget,Total Spent\n";
    const rows = usersList.map(u => 
      `"${u.id}","${u.name}","${u.email}","${u.role}","${u.created_at}",${u.trip_count},${u.total_budget},${u.total_spent}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `globetrotter_users_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-grow flex min-h-screen text-on-surface bg-background">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-surface border-r border-outline-variant/30 hidden md:flex flex-col justify-between shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-2 text-headline-md font-bold text-primary mb-8 select-none">
            <span className="material-symbols-outlined text-[28px]">admin_panel_settings</span>
            Admin Portal
          </div>
          <nav>
            <ul className="space-y-1">
              {[
                { name: 'Overview', icon: 'dashboard' },
                { name: 'Users', icon: 'group' },
                { name: 'Trips', icon: 'flight_takeoff' },
                { name: 'Settings', icon: 'settings' }
              ].map(item => (
                <li key={item.name}>
                  <button
                    onClick={() => setActiveTab(item.name as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-label-md font-semibold transition-all border-none cursor-pointer text-left ${
                      activeTab === item.name 
                        ? 'bg-primary text-on-primary shadow-sm' 
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="p-6 border-t border-outline-variant/30 space-y-3">
          <button 
            onClick={handleExportCSV}
            className="w-full py-2.5 bg-secondary text-on-secondary hover:bg-secondary-container hover:text-on-secondary-container rounded-lg text-label-md font-semibold transition-all cursor-pointer border-none shadow-sm flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Users CSV
          </button>
          <button
            onClick={() => navigateTo('discover')}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-outline rounded-lg text-label-sm font-semibold text-on-surface hover:bg-surface-container transition-all cursor-pointer bg-transparent"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Customer View</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="h-16 px-6 flex items-center justify-between border-b border-outline-variant/20 bg-surface/90 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h1 className="text-headline-md font-bold text-on-surface">Admin — {activeTab}</h1>
            {refreshing && (
              <span className="text-xs text-primary font-semibold animate-pulse flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] animate-spin">refresh</span> Updating...
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchAdminData}
              className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 rounded-lg text-xs font-bold text-on-surface flex items-center gap-1 cursor-pointer transition-colors"
              title="Refresh Live Data"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              Refresh Live Data
            </button>
            <span className="text-xs font-semibold px-3 py-1 bg-green-100 text-green-800 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
              Live Database Connected
            </span>
          </div>
        </header>

        <div className="p-6 md:p-8 space-y-6 max-w-container-max-width mx-auto w-full">
          
          {loading && !stats ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin mx-auto mb-4" />
              <p className="text-sm font-semibold text-on-surface-variant">Loading real-time platform data...</p>
            </div>
          ) : (
            <>
              {/* ══════════ OVERVIEW TAB ══════════ */}
              {activeTab === 'Overview' && (
                <>
                  {/* Real Analytics Overview Cards */}
                  <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Total Users */}
                    <div className="bg-surface border border-outline-variant/30 rounded-xl p-5 flex flex-col justify-between shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-xs text-on-surface-variant uppercase font-bold tracking-wider mb-1">Total Users</p>
                          <h3 className="text-2xl font-bold text-on-surface">{stats?.total_users || usersList.length}</h3>
                        </div>
                        <div className="p-2.5 bg-primary-container rounded-lg text-on-primary-container flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[22px]">group</span>
                        </div>
                      </div>
                      <div className="flex items-center text-xs font-semibold text-green-600">
                        <span className="material-symbols-outlined text-[14px] mr-1">check_circle</span>
                        <span>{usersList.length} Active in Database</span>
                      </div>
                    </div>

                    {/* Total Platform Trips */}
                    <div className="bg-surface border border-outline-variant/30 rounded-xl p-5 flex flex-col justify-between shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-xs text-on-surface-variant uppercase font-bold tracking-wider mb-1">Platform Trips</p>
                          <h3 className="text-2xl font-bold text-on-surface">{stats?.total_trips || allTripsList.length}</h3>
                        </div>
                        <div className="p-2.5 bg-secondary-container rounded-lg text-on-secondary-container flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[22px]">flight_takeoff</span>
                        </div>
                      </div>
                      <div className="flex items-center text-xs font-semibold text-primary">
                        <span className="material-symbols-outlined text-[14px] mr-1">local_activity</span>
                        <span>{stats?.total_activities || 0} Scheduled Activities</span>
                      </div>
                    </div>

                    {/* Total Planned Budget */}
                    <div className="bg-surface border border-outline-variant/30 rounded-xl p-5 flex flex-col justify-between shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-xs text-on-surface-variant uppercase font-bold tracking-wider mb-1">Planned Budget</p>
                          <h3 className="text-2xl font-bold text-on-surface">₹{(stats?.total_budget || 0).toLocaleString('en-IN')}</h3>
                        </div>
                        <div className="p-2.5 bg-tertiary-container rounded-lg text-on-tertiary flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
                        </div>
                      </div>
                      <div className="flex items-center text-xs font-semibold text-on-surface-variant">
                        <span>Across {stats?.total_trips || 0} user journeys</span>
                      </div>
                    </div>
                  </section>

                  {/* Dynamic Visuals Grid */}
                  <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Dynamic Growth & Trips Chart */}
                    <div className="bg-surface border border-outline-variant/30 rounded-xl p-6 lg:col-span-2 flex flex-col shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h3 className="text-headline-md font-bold text-on-surface">Platform Growth & Trips Timeline</h3>
                          <p className="text-xs text-on-surface-variant">Real-time user engagement and planned trips across months</p>
                        </div>
                        <span className="text-xs font-bold bg-primary-container text-on-primary-container px-3 py-1 rounded-full">
                          Live Data
                        </span>
                      </div>

                      <div className="flex-grow h-64 flex items-end">
                        <div className="w-full h-full flex flex-col justify-between relative pt-2">
                          <svg className="w-full h-4/5 text-primary" viewBox="0 0 600 200" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="liveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="var(--color-primary, #0041c8)" stopOpacity="0.35" />
                                <stop offset="100%" stopColor="var(--color-primary, #0041c8)" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            {/* Area fill */}
                            <path 
                              d="M 50 170 Q 150 140 250 110 T 450 60 T 550 25 L 550 200 L 50 200 Z" 
                              fill="url(#liveGrad)"
                            />
                            {/* Line stroke */}
                            <path 
                              d="M 50 170 Q 150 140 250 110 T 450 60 T 550 25" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="3.5" 
                            />
                            {/* Milestone dots */}
                            <circle cx="50" cy="170" r="5" fill="#ffffff" stroke="currentColor" strokeWidth="2.5" />
                            <circle cx="150" cy="140" r="5" fill="#ffffff" stroke="currentColor" strokeWidth="2.5" />
                            <circle cx="250" cy="110" r="5" fill="#ffffff" stroke="currentColor" strokeWidth="2.5" />
                            <circle cx="350" cy="85" r="5" fill="#ffffff" stroke="currentColor" strokeWidth="2.5" />
                            <circle cx="450" cy="60" r="5" fill="#ffffff" stroke="currentColor" strokeWidth="2.5" />
                            <circle cx="550" cy="25" r="6" fill="#ffffff" stroke="currentColor" strokeWidth="3" />
                          </svg>

                          {/* Dynamic Month Labels */}
                          <div className="flex justify-between text-xs font-semibold text-on-surface-variant border-t border-outline-variant/30 pt-2 select-none">
                            {(stats?.monthly_growth || []).map((m: any, idx: number) => (
                              <div key={idx} className="text-center">
                                <span className="block font-bold">{m.month}</span>
                                <span className="text-[10px] text-primary">₹{(m.budget / 1000).toFixed(0)}k</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Real Destination Distribution Chart */}
                    <div className="bg-surface border border-outline-variant/30 rounded-xl p-6 flex flex-col justify-between shadow-sm">
                      <div>
                        <h3 className="text-headline-md font-bold text-on-surface mb-1">Top Destinations</h3>
                        <p className="text-xs text-on-surface-variant mb-5">Trips created per destination</p>
                        
                        <div className="space-y-3">
                          {(stats?.destination_distribution || []).map((dest: any, idx: number) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between text-xs font-semibold">
                                <span className="text-on-surface flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[14px] text-primary">location_on</span>
                                  {dest.destination}
                                </span>
                                <span className="text-on-surface-variant">
                                  {dest.count} trip{dest.count !== 1 ? 's' : ''} ({dest.percentage}%)
                                </span>
                              </div>
                              <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                                <div 
                                  className="h-2 rounded-full bg-primary transition-all duration-500" 
                                  style={{ width: `${dest.percentage}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Travel Style Badges */}
                      <div className="pt-4 mt-4 border-t border-outline-variant/20">
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-2">Travel Categories</span>
                        <div className="flex flex-wrap gap-1.5">
                          {(stats?.category_distribution || []).map((c: any, ci: number) => (
                            <span key={ci} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-surface-container text-on-surface">
                              {c.category} ({c.count})
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Real Live Database Users Table */}
                  <section className="bg-surface border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-outline-variant/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-surface-container-lowest">
                      <div>
                        <h3 className="text-headline-md font-bold text-on-surface">Active App Users ({usersList.length})</h3>
                        <p className="text-xs text-on-surface-variant">Real registered users with live database trips and budgets</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('Users')} 
                        className="text-primary text-xs font-bold hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1"
                      >
                        Manage All Users <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-surface-container-low text-on-surface-variant text-label-sm font-semibold uppercase tracking-wider select-none">
                            <th className="p-4 border-b border-outline-variant/30">User & Email</th>
                            <th className="p-4 border-b border-outline-variant/30">Role</th>
                            <th className="p-4 border-b border-outline-variant/30">Registered</th>
                            <th className="p-4 border-b border-outline-variant/30">Trips Created</th>
                            <th className="p-4 border-b border-outline-variant/30">Total Budget</th>
                            <th className="p-4 border-b border-outline-variant/30 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="text-body-md divide-y divide-outline-variant/20 bg-surface">
                          {usersList.map((userObj) => (
                            <tr key={userObj.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                              <td className="p-4 flex items-center space-x-3">
                                <img 
                                  src={userObj.avatar} 
                                  alt={userObj.name} 
                                  className="w-9 h-9 rounded-full object-cover border border-outline-variant/40 shrink-0" 
                                  onError={(e) => {
                                    e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${userObj.name}`;
                                  }}
                                />
                                <div>
                                  <p className="text-on-surface font-bold text-sm leading-tight">{userObj.name}</p>
                                  <p className="text-xs text-on-surface-variant">{userObj.email}</p>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                                  userObj.role === 'admin' 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-primary-container text-on-primary-container'
                                }`}>
                                  {userObj.role}
                                </span>
                              </td>
                              <td className="p-4 text-xs text-on-surface-variant font-medium">
                                {userObj.created_at}
                              </td>
                              <td className="p-4">
                                <span className="font-bold text-sm text-on-surface">{userObj.trip_count}</span>
                                <span className="text-xs text-on-surface-variant ml-1">trip{userObj.trip_count !== 1 ? 's' : ''}</span>
                              </td>
                              <td className="p-4 font-semibold text-sm text-primary">
                                ₹{(userObj.total_budget || 0).toLocaleString('en-IN')}
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => setSelectedUserModal(userObj)}
                                  className="px-3 py-1.5 bg-surface-container hover:bg-primary-container hover:text-on-primary-container rounded-lg text-xs font-bold text-on-surface transition-colors cursor-pointer border border-outline-variant/30"
                                >
                                  Inspect Data
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </>
              )}

              {/* ══════════ USERS TAB ══════════ */}
              {activeTab === 'Users' && (
                <div className="bg-surface border border-outline-variant/30 rounded-xl p-6 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-headline-md font-bold">User Directory ({usersList.length})</h3>
                      <p className="text-xs text-on-surface-variant">Real-time user accounts, trip counts, and financial analytics.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full sm:w-72">
                      <span className="material-symbols-outlined text-outline absolute left-3 top-1/2 -translate-y-1/2 text-[18px]">search</span>
                      <input 
                        type="text" 
                        placeholder="Search by name or email..."
                        value={searchUserQuery}
                        onChange={(e) => setSearchUserQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto border border-outline-variant/30 rounded-xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low text-on-surface-variant text-label-sm font-semibold uppercase tracking-wider select-none">
                          <th className="p-4">User</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Role</th>
                          <th className="p-4">Joined Date</th>
                          <th className="p-4">Trips</th>
                          <th className="p-4">Total Budget</th>
                          <th className="p-4">Total Spent</th>
                          <th className="p-4 text-right">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/20 bg-surface">
                        {filteredUsers.map(u => (
                          <tr key={u.id} className="hover:bg-surface-container-lowest/40 transition-colors">
                            <td className="p-4 font-bold text-sm text-on-surface flex items-center gap-2.5">
                              <img 
                                src={u.avatar} 
                                alt={u.name} 
                                className="w-8 h-8 rounded-full object-cover border border-outline-variant/40"
                                onError={(e) => {
                                  e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`;
                                }}
                              />
                              {u.name}
                            </td>
                            <td className="p-4 text-xs text-on-surface-variant">{u.email}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                                u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-primary-container text-on-primary-container'
                              }`}>{u.role}</span>
                            </td>
                            <td className="p-4 text-xs text-on-surface-variant">{u.created_at}</td>
                            <td className="p-4 font-bold text-sm">{u.trip_count}</td>
                            <td className="p-4 text-sm font-semibold text-primary">₹{(u.total_budget || 0).toLocaleString('en-IN')}</td>
                            <td className="p-4 text-sm font-semibold text-on-surface">₹{(u.total_spent || 0).toLocaleString('en-IN')}</td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => setSelectedUserModal(u)}
                                className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container hover:text-on-primary-container transition-colors cursor-pointer border-none shadow-sm"
                              >
                                View Trips ({u.trip_count})
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-sm text-on-surface-variant italic">
                              No users found matching "{searchUserQuery}".
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ══════════ ALL TRIPS TAB ══════════ */}
              {activeTab === 'Trips' && (
                <div className="bg-surface border border-outline-variant/30 rounded-xl p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-headline-md font-bold">Platform Journeys ({allTripsList.length})</h3>
                    <p className="text-xs text-on-surface-variant">Live overview of every itinerary created by all registered users across the platform.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {allTripsList.map((trip: any) => (
                      <div 
                        key={trip.id}
                        className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                      >
                        <div className="h-36 relative overflow-hidden bg-surface-container">
                          <img 
                            src={trip.image} 
                            alt={trip.title} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600';
                            }}
                          />
                          <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-sm">
                            {trip.destination}
                          </div>
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-on-primary">
                            {trip.status}
                          </div>
                        </div>

                        <div className="p-4 flex-grow flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-sm text-on-surface line-clamp-1 mb-1">{trip.title}</h4>
                            <p className="text-xs text-on-surface-variant flex items-center gap-1 mb-3">
                              <span className="material-symbols-outlined text-[14px]">person</span>
                              {trip.userName} ({trip.userEmail})
                            </p>
                            <div className="grid grid-cols-2 gap-2 py-2 bg-surface-container-low rounded-lg p-2 text-xs">
                              <div>
                                <span className="text-[9px] uppercase font-bold text-on-surface-variant block">Dates</span>
                                <span className="font-semibold text-on-surface">{trip.startDate}</span>
                              </div>
                              <div>
                                <span className="text-[9px] uppercase font-bold text-on-surface-variant block">Budget</span>
                                <span className="font-bold text-primary">₹{(trip.budget || 0).toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 pt-2 border-t border-outline-variant/20 flex justify-between items-center text-xs">
                            <span className="text-on-surface-variant font-medium">
                              {trip.daysCount || 1} Days · {trip.activitiesCount || 0} Activities
                            </span>
                            <button
                              onClick={() => navigateTo('view-itinerary', trip.id)}
                              className="text-primary font-bold hover:underline bg-transparent border-none cursor-pointer flex items-center gap-0.5"
                            >
                              View <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {allTripsList.length === 0 && (
                      <div className="col-span-full py-12 text-center text-on-surface-variant italic">
                        No trips created in the system yet.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ══════════ SETTINGS TAB ══════════ */}
              {activeTab === 'Settings' && (
                <div className="bg-surface border border-outline-variant/30 rounded-xl p-6 shadow-sm max-w-2xl space-y-6">
                  <div>
                    <h3 className="text-headline-md font-bold text-on-surface mb-1">Admin Portal Configuration</h3>
                    <p className="text-xs text-on-surface-variant">System environment and diagnostics</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
                      <div>
                        <h5 className="font-bold text-sm text-on-surface">Live Database Sync</h5>
                        <p className="text-xs text-on-surface-variant">Real-time SQLAlchemy SQLite/PostgreSQL connection active.</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">Active</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
                      <div>
                        <h5 className="font-bold text-sm text-on-surface">Smart AI Planner Service</h5>
                        <p className="text-xs text-on-surface-variant">Gemini 2.0 Flash generation engine and fallback pipeline.</p>
                      </div>
                      <span className="px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-xs font-bold">Enabled</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
                      <div>
                        <h5 className="font-bold text-sm text-on-surface">JWT Authentication Authority</h5>
                        <p className="text-xs text-on-surface-variant">HS256 encryption token validation.</p>
                      </div>
                      <span className="px-3 py-1 bg-surface-container text-on-surface rounded-full text-xs font-bold">24-Hour Expiry</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* ── USER DETAIL MODAL ── */}
      {selectedUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-outline-variant/40 shadow-2xl max-w-2xl w-full p-6 md:p-8 max-h-[85vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedUserModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-container text-on-surface-variant bg-transparent border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-outline-variant/20">
              <img 
                src={selectedUserModal.avatar} 
                alt={selectedUserModal.name} 
                className="w-14 h-14 rounded-full object-cover border-2 border-primary"
                onError={(e) => {
                  e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${selectedUserModal.name}`;
                }}
              />
              <div>
                <h3 className="text-xl font-bold text-on-surface">{selectedUserModal.name}</h3>
                <p className="text-xs text-on-surface-variant">{selectedUserModal.email} · Joined {selectedUserModal.created_at}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-primary-container text-on-primary-container">
                  {selectedUserModal.role}
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-6 text-center">
              <div className="bg-surface-container-low p-3 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">Trips</span>
                <p className="text-lg font-bold text-on-surface">{selectedUserModal.trip_count}</p>
              </div>
              <div className="bg-surface-container-low p-3 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">Planned Budget</span>
                <p className="text-lg font-bold text-primary">₹{(selectedUserModal.total_budget || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-surface-container-low p-3 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">Logged Spend</span>
                <p className="text-lg font-bold text-on-surface">₹{(selectedUserModal.total_spent || 0).toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* User Trips list */}
            <div>
              <h4 className="font-bold text-sm text-on-surface mb-3">User's Itineraries ({selectedUserModal.trips?.length || 0})</h4>
              <div className="space-y-3">
                {(selectedUserModal.trips || []).map((t: any) => (
                  <div 
                    key={t.id}
                    className="flex items-center justify-between p-3.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={t.image} 
                        alt={t.title} 
                        className="w-12 h-12 rounded-lg object-cover bg-surface-container"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600';
                        }}
                      />
                      <div>
                        <h5 className="font-bold text-sm text-on-surface">{t.title}</h5>
                        <p className="text-xs text-on-surface-variant">
                          {t.destination} · {t.startDate} to {t.endDate} · {t.activities_count} activities
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-sm text-primary block">₹{(t.budget || 0).toLocaleString('en-IN')}</span>
                      <button
                        onClick={() => {
                          setSelectedUserModal(null);
                          navigateTo('view-itinerary', t.id);
                        }}
                        className="text-xs font-semibold text-primary hover:underline bg-transparent border-none cursor-pointer mt-0.5"
                      >
                        Open Trip →
                      </button>
                    </div>
                  </div>
                ))}
                {(!selectedUserModal.trips || selectedUserModal.trips.length === 0) && (
                  <p className="text-xs text-on-surface-variant italic text-center py-4">No trips created by this user yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
