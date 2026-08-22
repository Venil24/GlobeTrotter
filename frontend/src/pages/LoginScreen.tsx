import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function LoginScreen() {
  const { login, registerUser } = useContext(AppContext);
  const [isRegister, setIsRegister] = useState(false);
  
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration form state
  const [regData, setRegData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    country: '',
    additionalInfo: ''
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!password.trim()) {
      alert("Please enter your password.");
      return;
    }
    login(email, password);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!regData.username.trim()) {
      alert("Please enter a username.");
      return;
    }
    if (!regData.email.includes('@')) {
      alert("Please enter a valid email address.");
      return;
    }
    if (regData.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    registerUser(regData.username, regData.email, regData.password);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("Password reset instructions have been sent to your registered email address.");
  };

  return (
    <div className="w-full min-h-screen flex text-on-surface bg-background">
      {/* Left visual area (Desktop) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-surface-container-highest overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 to-transparent"></div>
        <div className="absolute bottom-12 left-12">
          <h2 className="text-display-lg font-bold text-white mb-4">Discover Your World</h2>
          <p className="text-body-lg text-surface-container-low max-w-md">Join GlobeTrotter to plan, experience, and share unforgettable premium travel journeys.</p>
        </div>
      </div>
      
      {/* Right form area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-margin-desktop overflow-y-auto relative h-screen bg-surface">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-8 relative overflow-hidden">
          <div className="text-center mb-8">
            <span className="material-symbols-outlined text-4xl text-primary mb-2">flight_takeoff</span>
            <h1 className="text-headline-lg font-bold text-on-surface tracking-tight">GlobeTrotter</h1>
          </div>
          
          <div className="relative min-h-[400px]">
            {/* Login Panel */}
            {!isRegister ? (
              <div className="flex flex-col gap-6 w-full animate-fade-in">
                <div>
                  <h3 className="text-headline-md font-bold text-on-surface mb-2">Welcome Back</h3>
                  <p className="text-body-md text-on-surface-variant">Sign in to access your itineraries.</p>
                </div>
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-label-md font-semibold text-on-surface-variant mb-2">Email Address</label>
                    <input 
                      className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
                      placeholder="Enter your email address" 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-label-md font-semibold text-on-surface-variant mb-2">Password</label>
                    <input 
                      className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
                      placeholder="••••••••" 
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={handleForgotPassword}
                      className="text-label-md font-semibold text-primary hover:underline bg-transparent border-none cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-primary text-on-primary text-label-md font-semibold py-3 rounded-lg shadow-sm hover:shadow-md hover:bg-primary-container transition-all duration-200 cursor-pointer border-none"
                  >
                    Login
                  </button>
                </form>
                <div className="text-center mt-4">
                  <p className="text-body-md text-on-surface-variant">
                    New here? <button className="text-primary font-medium hover:underline focus:outline-none bg-transparent border-none cursor-pointer" onClick={() => setIsRegister(true)}>Create an account</button>
                  </p>
                </div>
              </div>
            ) : (
              /* Registration Panel */
              <div className="flex flex-col gap-6 w-full animate-fade-in">
                <div>
                  <h3 className="text-headline-md font-bold text-on-surface mb-2">Create Account</h3>
                  <p className="text-body-md text-on-surface-variant">Join the premium travel community.</p>
                </div>
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-label-md font-semibold text-on-surface-variant mb-2">Username</label>
                      <input 
                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
                        type="text"
                        required
                        value={regData.username}
                        onChange={(e) => setRegData({...regData, username: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-label-md font-semibold text-on-surface-variant mb-2">Password</label>
                      <input 
                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
                        type="password"
                        required
                        placeholder="Min 6 chars"
                        value={regData.password}
                        onChange={(e) => setRegData({...regData, password: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-label-md font-semibold text-on-surface-variant mb-2">First Name</label>
                      <input 
                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
                        type="text"
                        value={regData.firstName}
                        onChange={(e) => setRegData({...regData, firstName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-label-md font-semibold text-on-surface-variant mb-2">Last Name</label>
                      <input 
                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
                        type="text"
                        value={regData.lastName}
                        onChange={(e) => setRegData({...regData, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-label-md font-semibold text-on-surface-variant mb-2">Email Address</label>
                      <input 
                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
                        type="email"
                        required
                        value={regData.email}
                        onChange={(e) => setRegData({...regData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-label-md font-semibold text-on-surface-variant mb-2">Phone Number</label>
                      <input 
                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
                        type="tel"
                        value={regData.phone}
                        onChange={(e) => setRegData({...regData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-label-md font-semibold text-on-surface-variant mb-2">City</label>
                      <input 
                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
                        type="text"
                        value={regData.city}
                        onChange={(e) => setRegData({...regData, city: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-label-md font-semibold text-on-surface-variant mb-2">Country</label>
                      <input 
                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
                        type="text"
                        value={regData.country}
                        onChange={(e) => setRegData({...regData, country: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-label-md font-semibold text-on-surface-variant mb-2">Bio / Description</label>
                    <textarea 
                      className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none" 
                      rows={3}
                      value={regData.additionalInfo}
                      onChange={(e) => setRegData({...regData, additionalInfo: e.target.value})}
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-primary text-on-primary text-label-md font-semibold py-3 rounded-lg shadow-sm hover:shadow-md hover:bg-primary-container transition-all duration-200 mt-4 cursor-pointer border-none"
                  >
                    Register
                  </button>
                </form>
                <div className="text-center mt-4">
                  <p className="text-body-md text-on-surface-variant">
                    Already have an account? <button className="text-primary font-medium hover:underline focus:outline-none bg-transparent border-none cursor-pointer" onClick={() => setIsRegister(false)}>Sign in</button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
