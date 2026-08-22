import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
import api from '../services/api';
import { User, Trip, CommunityPost } from '../types';

interface AppContextProps {
  user: User | null;
  trips: Trip[];
  posts: CommunityPost[];
  activeTripId: number | null;
  currentRoute: string;
  routeParam: any;
  loading: boolean;
  navigateTo: (route: string, param?: any) => void;
  login: (email: string, password: string) => Promise<boolean>;
  registerUser: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, bio: string, avatar: string, countries: number, language?: string) => Promise<void>;
  createTrip: (tripData: any) => Promise<void>;
  generateAutoTrip: (planData: any) => Promise<Trip | null>;
  updateTrip: (tripId: number, tripData: any) => Promise<void>;
  deleteTrip: (tripId: number) => Promise<void>;
  addActivity: (tripId: number, stopId: number, actData: any) => Promise<void>;
  deleteActivity: (tripId: number, stopId: number, actId: number) => Promise<void>;
  addExpense: (tripId: number, expData: any) => Promise<void>;
  deleteExpense: (tripId: number, expId: number) => Promise<void>;
  addStop: (tripId: number, cityId: number) => Promise<void>;
  fetchPosts: () => Promise<void>;
  createPost: (postData: any) => Promise<void>;
  likePost: (postId: number) => Promise<void>;
  addComment: (postId: number, content: string) => Promise<void>;
  cloneTrip: (shareToken: string) => Promise<void>;
}

export const AppContext = createContext<AppContextProps>({} as AppContextProps);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [activeTripId, setActiveTripId] = useState<number | null>(null);
  const [currentRoute, setCurrentRoute] = useState<string>('login');
  const [routeParam, setRouteParam] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Ref to prevent popstate handler from pushing duplicate history entries
  const isPopStateNav = useRef(false);

  // Push a browser history entry for a given route
  const pushHistory = useCallback((route: string, param: any = null) => {
    if (!isPopStateNav.current) {
      window.history.pushState({ route, param }, '', `#${route}`);
    }
    isPopStateNav.current = false;
  }, []);

  // Check login state on mount
  useEffect(() => {
    const token = localStorage.getItem('gt_token');
    if (token) {
      fetchUser()
        .then(() => {
          const params = new URLSearchParams(window.location.search);
          const sharedToken = params.get('shared');
          if (sharedToken) {
            setCurrentRoute('public-view');
            setRouteParam(sharedToken);
            window.history.replaceState({ route: 'public-view', param: sharedToken }, '', `#public-view`);
          } else {
            setCurrentRoute('discover');
            window.history.replaceState({ route: 'discover', param: null }, '', `#discover`);
          }
        })
        .catch(() => {
          setCurrentRoute('login');
          window.history.replaceState({ route: 'login', param: null }, '', `#login`);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      const params = new URLSearchParams(window.location.search);
      const sharedToken = params.get('shared');
      if (sharedToken) {
        setCurrentRoute('public-view');
        setRouteParam(sharedToken);
        window.history.replaceState({ route: 'public-view', param: sharedToken }, '', `#public-view`);
      } else {
        window.history.replaceState({ route: 'login', param: null }, '', `#login`);
      }
    }

    // Listen for browser back/forward button
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state && state.route) {
        isPopStateNav.current = true;
        setCurrentRoute(state.route);
        setRouteParam(state.param ?? null);
        if (state.route === 'view-itinerary' || state.route === 'build-itinerary') {
          setActiveTripId(state.param);
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route: string, param: any = null) => {
    setCurrentRoute(route);
    setRouteParam(param);
    if (route === 'view-itinerary' || route === 'build-itinerary') {
      setActiveTripId(param);
    }
    pushHistory(route, param);
  };

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      fetchTrips();
      fetchPosts();
    } catch (err) {
      logout();
    }
  };

  const fetchTrips = async () => {
    try {
      const res = await api.get('/trips');
      setTrips(res.data);
    } catch (err) {
      console.error("Error loading trips:", err);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('gt_token', res.data.access_token);
      localStorage.setItem('gt_username', res.data.username);
      localStorage.setItem('gt_role', res.data.role);
      
      const userRes = await api.get('/auth/me');
      setUser(userRes.data);
      await fetchTrips();
      await fetchPosts();
      
      navigateTo('discover');
      return true;
    } catch (err) {
      return false;
    }
  };

  const registerUser = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('gt_token', res.data.access_token);
      localStorage.setItem('gt_username', res.data.username);
      localStorage.setItem('gt_role', res.data.role);

      const userRes = await api.get('/auth/me');
      setUser(userRes.data);
      await fetchTrips();
      await fetchPosts();

      navigateTo('discover');
      return true;
    } catch (err) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('gt_token');
    localStorage.removeItem('gt_username');
    localStorage.removeItem('gt_role');
    setUser(null);
    setTrips([]);
    setPosts([]);
    setCurrentRoute('login');
  };

  const updateProfile = async (name: string, bio: string, avatar: string, countries: number, language?: string) => {
    try {
      const res = await api.put('/profile', { 
        name, 
        bio, 
        avatar, 
        countries_visited: countries, 
        language 
      });
      setUser(res.data);
    } catch (err) {
      console.error("Profile edit error:", err);
    }
  };

  const createTrip = async (tripData: any) => {
    try {
      const res = await api.post('/trips', {
        name: tripData.title,
        destination: tripData.destination,
        description: tripData.description || "",
        cover_image: tripData.image || "",
        start_date: tripData.startDate,
        end_date: tripData.endDate,
        total_budget: parseFloat(tripData.budget) || 0.0,
        travelers_count: parseInt(tripData.travelers) || 1,
        interests: tripData.interests || []
      });
      
      const newTrip = res.data;
      setTrips(prev => [...prev, newTrip]);

      // ── Post selected suggestion activities distributed across days ──
      const itineraryWithActs: any[] = tripData.itinerary || [];
      const serverStops: any[] = newTrip.itinerary || [];

      for (const dayObj of itineraryWithActs) {
        const acts: any[] = dayObj.activities || [];
        if (acts.length === 0) continue;

        // Match the server stop by day number
        const serverStop = serverStops.find((s: any) => s.day === dayObj.day);
        if (!serverStop) continue;

        for (const act of acts) {
          try {
            await api.post(`/stops/${serverStop.id}/activities`, {
              title: act.title,
              time: act.time || "10:00 AM",
              location: act.location || tripData.destination || "",
              cost: parseFloat(act.cost) || 0.0,
              note: act.note || "",
            });
          } catch (actErr) {
            console.warn("Could not add activity:", act.title, actErr);
          }
        }
      }

      // ── Post budget items for selected suggestions ──
      const expenses: any[] = tripData.expenses || [];
      for (const exp of expenses) {
        try {
          await api.post(`/trips/${newTrip.id}/budget-items`, {
            title: exp.title,
            category: exp.category || "activities",
            amount: parseFloat(exp.amount) || 0.0,
          });
        } catch (expErr) {
          console.warn("Could not add expense:", exp.title, expErr);
        }
      }

      await fetchTrips();
      navigateTo('build-itinerary', newTrip.id);
    } catch (err) {
      console.error("Trip creation error:", err);
    }
  };

  const generateAutoTrip = async (planData: any): Promise<Trip | null> => {
    try {
      const res = await api.post('/ai/plan-trip', {
        destination: planData.destination,
        start_date: planData.startDate,
        end_date: planData.endDate,
        budget: parseFloat(String(planData.budget || 25000)) || 25000.0,
        travelers: parseInt(String(planData.travelers || 1)) || 1,
        category: planData.category || "Leisure",
        interests: planData.interests || []
      });
      const newTrip = res.data;
      setTrips(prev => [...prev, newTrip]);
      await fetchTrips();
      return newTrip;
    } catch (err) {
      console.error("Auto plan trip error:", err);
      throw err;
    }
  };

  const updateTrip = async (tripId: number, tripData: any) => {
    try {
      const res = await api.put(`/trips/${tripId}`, {
        name: tripData.title,
        destination: tripData.destination,
        description: tripData.description,
        cover_image: tripData.image,
        start_date: tripData.startDate,
        end_date: tripData.endDate,
        total_budget: tripData.budget ? parseFloat(tripData.budget) : undefined,
        travelers_count: tripData.travelers ? parseInt(tripData.travelers) : undefined,
        is_public: tripData.is_public,
        interests: tripData.interests,
        itinerary: tripData.itinerary
      });
      
      setTrips(prev => prev.map(t => t.id === tripId ? res.data : t));
    } catch (err) {
      console.error("Update trip error:", err);
    }
  };

  const deleteTrip = async (tripId: number) => {
    try {
      await api.delete(`/trips/${tripId}`);
      setTrips(prev => prev.filter(t => t.id !== tripId));
    } catch (err) {
      console.error("Delete trip error:", err);
    }
  };

  const addStop = async (tripId: number, cityId: number) => {
    try {
      await api.post(`/trips/${tripId}/stops`, { city_id: cityId });
      await fetchTrips();
    } catch (err) {
      console.error("Add stop error:", err);
    }
  };

  const addActivity = async (tripId: number, stopId: number, actData: any) => {
    try {
      const res = await api.post(`/stops/${stopId}/activities`, {
        title: actData.title,
        time: actData.time || "10:00 AM",
        location: actData.location || "",
        cost: parseFloat(actData.cost) || 0.0,
        note: actData.note || ""
      });
      
      setTrips(prev => prev.map(t => t.id === tripId ? res.data : t));
    } catch (err) {
      console.error("Add activity error:", err);
    }
  };

  const deleteActivity = async (tripId: number, stopId: number, actId: number) => {
    try {
      const res = await api.delete(`/trip-activities/${actId}`);
      setTrips(prev => prev.map(t => t.id === tripId ? res.data : t));
    } catch (err) {
      console.error("Delete activity error:", err);
    }
  };

  const addExpense = async (tripId: number, expData: any) => {
    try {
      const res = await api.post(`/trips/${tripId}/budget-items`, {
        category: expData.category || "other",
        title: expData.title,
        amount: parseFloat(expData.amount) || 0.0,
        notes: expData.notes || ""
      });
      
      setTrips(prev => prev.map(t => t.id === tripId ? res.data : t));
    } catch (err) {
      console.error("Add expense error:", err);
    }
  };

  const deleteExpense = async (tripId: number, expId: number) => {
    try {
      const res = await api.delete(`/budget-items/${expId}`);
      setTrips(prev => prev.map(t => t.id === tripId ? res.data : t));
    } catch (err) {
      console.error("Delete expense error:", err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error("Error loading posts:", err);
    }
  };

  const createPost = async (postData: any) => {
    try {
      const res = await api.post('/posts', postData);
      setPosts(prev => [res.data, ...prev]);
    } catch (err) {
      console.error("Post creation error:", err);
    }
  };

  const likePost = async (postId: number) => {
    try {
      const res = await api.post(`/posts/${postId}/like`);
      setPosts(prev => prev.map(p => p.id === postId ? res.data : p));
    } catch (err) {
      console.error("Like post error:", err);
    }
  };

  const addComment = async (postId: number, content: string) => {
    try {
      const res = await api.post(`/posts/${postId}/comments`, { content });
      setPosts(prev => prev.map(p => p.id === postId ? res.data : p));
    } catch (err) {
      console.error("Add comment error:", err);
    }
  };

  const cloneTrip = async (shareToken: string) => {
    try {
      const res = await api.post(`/trips/shared/${shareToken}/clone`);
      const cloned = res.data;
      setTrips(prev => [...prev, cloned]);
      navigateTo('my-trips');
    } catch (err) {
      console.error("Clone shared trip error:", err);
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      trips,
      posts,
      activeTripId,
      currentRoute,
      routeParam,
      loading,
      navigateTo,
      login,
      registerUser,
      logout,
      updateProfile,
      createTrip,
      generateAutoTrip,
      updateTrip,
      deleteTrip,
      addActivity,
      deleteActivity,
      addExpense,
      deleteExpense,
      addStop,
      fetchPosts,
      createPost,
      likePost,
      addComment,
      cloneTrip
    }}>
      {children}
    </AppContext.Provider>
  );
};
