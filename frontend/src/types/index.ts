export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  bio: string;
  avatar: string;
  countries_visited: number;
  countriesVisited?: number;
  language: string;
  saved_destinations?: string[];
  savedDestinations?: string;
}

export interface Activity {
  id: number;
  title: string;
  time: string;
  location: string;
  cost: number;
  note: string;
  status: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  city_header: string;
  id?: number;
  notes?: string;
  activities: Activity[];
}

export interface Expense {
  id: number;
  title: string;
  category: string;
  amount: number;
  date: string;
}

export interface Trip {
  id: number;
  title: string;
  destination: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelers: number;
  currency: string;
  status: string;
  category?: string;
  is_public: boolean;
  share_token?: string;
  interests: string[];
  itinerary: ItineraryDay[];
  expenses: Expense[];
}

export interface Comment {
  id: number;
  post_id: number;
  author_id: number;
  author_name: string;
  author_avatar: string;
  content: string;
  created_at: string;
}

export interface CommunityPost {
  id: number;
  author_id: number;
  author_name: string;
  author_avatar: string;
  title: string;
  content: string;
  destination: string;
  image: string;
  likes_count: number;
  is_liked: boolean;
  created_at: string;
  comments: Comment[];
}
