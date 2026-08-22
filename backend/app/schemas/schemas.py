from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date, datetime

# User Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserRegister(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    username: str
    role: str

class UserProfileUpdate(BaseModel):
    name: str
    bio: Optional[str] = ""
    avatar: Optional[str] = ""
    countries_visited: Optional[int] = 0
    language: Optional[str] = "English"

class UserResponse(UserBase):
    id: int
    role: str
    bio: str
    avatar: str
    countries_visited: int
    language: str
    saved_destinations: List[str]

    class Config:
        from_attributes = True

# City Schema
class CityResponse(BaseModel):
    id: int
    name: str
    country: str
    region: str
    description: str
    image_url: str
    latitude: float
    longitude: float
    cost_index: int
    popularity_score: float

    class Config:
        from_attributes = True

# Activity Schema
class ActivityResponse(BaseModel):
    id: int
    city_id: int
    name: str
    description: str
    category: str
    image_url: str
    latitude: float
    longitude: float
    estimated_duration: int
    estimated_cost: float
    rating: float
    popularity_score: float

    class Config:
        from_attributes = True

# TripActivity Schema
class TripActivityCreate(BaseModel):
    title: str
    time: Optional[str] = "10:00 AM"
    location: Optional[str] = ""
    cost: Optional[float] = 0.0
    note: Optional[str] = ""

class TripActivityUpdate(BaseModel):
    title: Optional[str] = None
    time: Optional[str] = None
    location: Optional[str] = None
    cost: Optional[float] = None
    note: Optional[str] = None
    status: Optional[str] = None

class TripActivityResponse(BaseModel):
    id: int
    stop_id: int
    activity_id: Optional[int] = None
    title: str
    date: Optional[date] = None
    time: str
    order_index: int
    cost: float
    location: str
    note: str
    status: str

    class Config:
        from_attributes = True

# Stop Schema
class StopCreate(BaseModel):
    city_id: int
    arrival_date: Optional[date] = None
    departure_date: Optional[date] = None
    order_index: Optional[int] = 0

class StopUpdate(BaseModel):
    city_header: Optional[str] = None
    notes: Optional[str] = None
    order_index: Optional[int] = None

class StopResponse(BaseModel):
    id: int
    trip_id: int
    city_id: int
    arrival_date: Optional[date] = None
    departure_date: Optional[date] = None
    order_index: int
    city_header: Optional[str] = None
    notes: str
    city: CityResponse
    activities: List[TripActivityResponse] = []

    class Config:
        from_attributes = True

# BudgetItem Schema
class BudgetItemCreate(BaseModel):
    category: str # lodging, transit, dining, activities, other
    title: str
    amount: float
    date: Optional[date] = None
    notes: Optional[str] = ""

class BudgetItemResponse(BaseModel):
    id: int
    trip_id: int
    stop_id: Optional[int] = None
    category: str
    title: str
    amount: float
    date: Optional[date] = None
    notes: str

    class Config:
        from_attributes = True

# Transport Schema
class TransportCreate(BaseModel):
    from_stop_id: int
    to_stop_id: int
    transport_type: str
    estimated_cost: Optional[float] = 0.0
    duration: Optional[int] = 0

class TransportResponse(BaseModel):
    id: int
    trip_id: int
    from_stop_id: int
    to_stop_id: int
    transport_type: str
    estimated_cost: float
    duration: int
    departure_time: str
    arrival_time: str

    class Config:
        from_attributes = True

# Trip Schema
class TripCreate(BaseModel):
    name: str
    destination: str
    description: Optional[str] = ""
    cover_image: Optional[str] = ""
    start_date: date
    end_date: date
    total_budget: float
    travelers_count: Optional[int] = 1
    currency: Optional[str] = "USD"
    is_public: Optional[bool] = False
    interests: Optional[List[str]] = []

class TripUpdate(BaseModel):
    name: Optional[str] = None
    destination: Optional[str] = None
    description: Optional[str] = None
    cover_image: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    total_budget: Optional[float] = None
    travelers_count: Optional[int] = None
    is_public: Optional[bool] = None
    interests: Optional[List[str]] = None
    itinerary: Optional[List[dict]] = None


class TripResponse(BaseModel):
    id: int
    user_id: int
    name: str
    destination: str
    description: str
    cover_image: str
    start_date: date
    end_date: date
    total_budget: float
    travelers_count: int
    currency: str
    status: str
    is_public: bool
    share_token: Optional[str] = None
    interests: List[str] = []
    stops: List[StopResponse] = []
    budget_items: List[BudgetItemResponse] = []
    transports: List[TransportResponse] = []

    class Config:
        from_attributes = True

# CommunityPost & Comments
class CommentCreate(BaseModel):
    content: str

class CommentResponse(BaseModel):
    id: int
    post_id: int
    author_id: int
    author_name: str
    author_avatar: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

class PostCreate(BaseModel):
    title: str
    content: str
    destination: Optional[str] = ""
    image: Optional[str] = ""

class PostResponse(BaseModel):
    id: int
    author_id: int
    author_name: str
    author_avatar: str
    title: str
    content: str
    destination: str
    image: str
    likes_count: int
    is_liked: bool = False
    created_at: datetime
    comments: List[CommentResponse] = []

    class Config:
        from_attributes = True
