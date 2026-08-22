import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function AdminDashboardScreen() {
  const { trips, logout, navigateTo } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('Overview'); // Overview, Users, Settings

  const usersList = [
    { id: "u-1", name: "Jane Doe", email: "jane.d@example.com", status: "Online", lastActive: "2 mins ago", currentTrip: "Paris Getaway", initial: "JD", color: "bg-primary-container text-on-primary-container" },
    { id: "u-2", name: "Michael Smith", email: "m.smith@example.com", status: "Offline", lastActive: "1 hour ago", currentTrip: "Kyoto Highlights", initial: "MS", color: "bg-secondary-container text-on-secondary-container" },
    { id: "u-3", name: "Sarah Jenkins", email: "s.jenk@example.com", status: "Online", lastActive: "Just now", currentTrip: "Planning: NYC", initial: "SJ", color: "bg-tertiary-container text-on-tertiary-container" }
  ];

  return (
    <div className="flex-grow flex min-h-screen text-on-surface bg-background">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-surface border-r border-outline-variant/30 hidden md:flex flex-col justify-between shrink-0">
        <div className="p-6">
          <div className="text-headline-md font-bold text-primary mb-8 select-none">Admin Portal</div>
          <nav>
            <ul className="space-y-1">
              {[
                { name: 'Overview', icon: 'dashboard' },
                { name: 'Users', icon: 'group' },
                { name: 'Settings', icon: 'settings' }
              ].map(item => (
                <li key={item.name}>
                  <button
                    onClick={() => setActiveTab(item.name)}
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

        <div className="p-6 border-t border-outline-variant/30 space-y-4">
          <button 
            onClick={() => alert('Report exported successfully!')}
            className="w-full py-2 bg-secondary text-on-secondary hover:bg-secondary-container hover:text-on-secondary-container rounded-lg text-label-md font-semibold transition-all cursor-pointer border-none shadow-sm"
          >
            Export Reports
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
          <h1 className="text-headline-md font-bold text-on-surface">Admin — {activeTab}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-label-md font-semibold px-3 py-1 bg-surface-container rounded-full text-on-surface-variant">
              Server Status: Active
            </span>
          </div>
        </header>

        <div className="p-6 md:p-8 space-y-6 max-w-container-max-width mx-auto w-full">
          
          {activeTab === 'Overview' && (
            <>
              {/* Analytics Overview Cards */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface border border-outline-variant/30 rounded-xl p-6 flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-label-md text-on-surface-variant mb-1">Total Users</p>
                      <h3 className="text-headline-lg font-bold text-on-surface">124,592</h3>
                    </div>
                    <div className="p-3 bg-primary-container rounded-lg text-on-primary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined">group</span>
                    </div>
                  </div>
                  <div className="flex items-center text-label-sm font-semibold text-green-600">
                    <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span>
                    <span>+12.5% vs last month</span>
                  </div>
                </div>

                <div className="bg-surface border border-outline-variant/30 rounded-xl p-6 flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-label-md text-on-surface-variant mb-1">Active Trips</p>
                      <h3 className="text-headline-lg font-bold text-on-surface">{trips.length + 8340}</h3>
                    </div>
                    <div className="p-3 bg-secondary-container rounded-lg text-on-secondary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined">flight_takeoff</span>
                    </div>
                  </div>
                  <div className="flex items-center text-label-sm font-semibold text-green-600">
                    <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span>
                    <span>+5.2% vs last month</span>
                  </div>
                </div>

                <div className="bg-surface border border-outline-variant/30 rounded-xl p-6 flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-label-md text-on-surface-variant mb-1">Monthly Revenue</p>
                      <h3 className="text-headline-lg font-bold text-on-surface">₹1.24 Cr</h3>
                    </div>
                    <div className="p-3 bg-tertiary-container rounded-lg text-on-tertiary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined">account_balance_wallet</span>
                    </div>
                  </div>
                  <div className="flex items-center text-label-sm font-semibold text-error">
                    <span className="material-symbols-outlined text-[16px] mr-1">trending_down</span>
                    <span>-1.8% vs last month</span>
                  </div>
                </div>
              </section>

              {/* Data Visuals Grid */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* SVG growth chart */}
                <div className="bg-surface border border-outline-variant/30 rounded-xl p-6 lg:col-span-2 flex flex-col shadow-sm">
                  <h3 className="text-headline-md font-bold text-on-surface mb-6">User Growth Trends</h3>
                  <div className="flex-grow h-64 flex items-end">
                    {/* Render a custom interactive SVG graph */}
                    <div className="w-full h-full flex flex-col justify-between relative pt-2">
                      <svg className="w-full h-4/5 text-primary" viewBox="0 0 600 200" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-primary, #0041c8)" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="var(--color-primary, #0041c8)" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path 
                          d="M 50 150 Q 150 110 250 120 T 450 60 T 550 30 L 550 200 L 50 200 Z" 
                          fill="url(#grad)"
                        />
                        <path 
                          d="M 50 150 Q 150 110 250 120 T 450 60 T 550 30" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="3" 
                        />
                        <circle cx="50" cy="150" r="5" fill="#ffffff" stroke="currentColor" strokeWidth="2" />
                        <circle cx="150" cy="120" r="5" fill="#ffffff" stroke="currentColor" strokeWidth="2" />
                        <circle cx="250" cy="115" r="5" fill="#ffffff" stroke="currentColor" strokeWidth="2" />
                        <circle cx="350" cy="90" r="5" fill="#ffffff" stroke="currentColor" strokeWidth="2" />
                        <circle cx="450" cy="60" r="5" fill="#ffffff" stroke="currentColor" strokeWidth="2" />
                        <circle cx="550" cy="30" r="5" fill="#ffffff" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      <div className="flex justify-between text-label-sm font-semibold text-on-surface-variant border-t border-outline-variant/30 pt-2 select-none">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Region distribution charts */}
                <div className="bg-surface border border-outline-variant/30 rounded-xl p-6 flex flex-col shadow-sm">
                  <h3 className="text-headline-md font-bold text-on-surface mb-6">Trips by Region</h3>
                  <div className="flex-grow flex items-center justify-center h-48 relative">
                    <div className="w-36 h-36 rounded-full border-[12px] border-primary flex items-center justify-center relative">
                      <div className="absolute inset-[-12px] rounded-full border-[12px] border-secondary border-t-transparent border-r-transparent border-b-transparent transform rotate-45"></div>
                      <div className="absolute inset-[-12px] rounded-full border-[12px] border-tertiary-container border-t-transparent border-r-transparent transform -rotate-45"></div>
                      <div className="text-center">
                        <span className="text-headline-md font-bold block text-on-surface">8,340</span>
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant">Trips</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-label-sm font-semibold text-on-surface-variant">
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-primary mr-2"></span>Europe (45%)</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-secondary mr-2"></span>Asia (25%)</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-tertiary-container mr-2"></span>Americas (20%)</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-outline-variant mr-2"></span>Other (10%)</div>
                  </div>
                </div>
              </section>

              {/* Management Table */}
              <section className="bg-surface border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
                  <h3 className="text-headline-md font-bold text-on-surface">Recently Active Users</h3>
                  <button onClick={() => setActiveTab('Users')} className="text-primary text-label-md font-semibold hover:underline bg-transparent border-none cursor-pointer">
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low text-on-surface-variant text-label-sm font-semibold uppercase tracking-wider select-none">
                        <th className="p-4 border-b border-outline-variant/30">User</th>
                        <th className="p-4 border-b border-outline-variant/30">Status</th>
                        <th className="p-4 border-b border-outline-variant/30">Last Active</th>
                        <th className="p-4 border-b border-outline-variant/30">Current Trip</th>
                      </tr>
                    </thead>
                    <tbody className="text-body-md divide-y divide-outline-variant/20 bg-surface">
                      {usersList.map((userObj) => (
                        <tr key={userObj.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                          <td className="p-4 flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${userObj.color}`}>
                              {userObj.initial}
                            </div>
                            <div>
                              <p className="text-on-surface font-semibold">{userObj.name}</p>
                              <p className="text-label-sm text-on-surface-variant">{userObj.email}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                              userObj.status === 'Online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {userObj.status}
                            </span>
                          </td>
                          <td className="p-4 text-on-surface-variant">{userObj.lastActive}</td>
                          <td className="p-4 text-on-surface font-medium">{userObj.currentTrip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {activeTab === 'Users' && (
            <div className="bg-surface border border-outline-variant/30 rounded-xl p-6 shadow-sm">
              <h3 className="text-headline-md font-bold mb-4">User Management Database</h3>
              <p className="text-body-md text-on-surface-variant mb-6">Administrate and audit user accounts, status states, and database trip properties.</p>
              
              <div className="overflow-x-auto border border-outline-variant/30 rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant text-label-sm font-semibold uppercase select-none">
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 bg-surface">
                    {usersList.map(u => (
                      <tr key={u.id} className="hover:bg-surface-container-lowest/30">
                        <td className="p-4 font-semibold">{u.name}</td>
                        <td className="p-4 text-on-surface-variant">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            u.status === 'Online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>{u.status}</span>
                        </td>
                        <td className="p-4 text-on-surface-variant font-medium">Customer</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Settings' && (
            <div className="bg-surface border border-outline-variant/30 rounded-xl p-6 shadow-sm max-w-2xl">
              <h3 className="text-headline-md font-bold mb-4">Portal Settings</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/20">
                  <div>
                    <h5 className="font-bold text-on-surface">Enable Sandbox Mode</h5>
                    <p className="text-label-sm text-on-surface-variant">Simulates network latency and data loads.</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 cursor-pointer accent-primary" defaultChecked />
                </div>
                <div className="flex justify-between items-center p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/20">
                  <div>
                    <h5 className="font-bold text-on-surface">Verbose Debug Logging</h5>
                    <p className="text-label-sm text-on-surface-variant">Save complete console outputs for API queries.</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 cursor-pointer accent-primary" />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
