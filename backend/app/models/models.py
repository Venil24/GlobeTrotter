from sqlalchemy import Column, Integer, String, Float, Boolean, Date, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.connection import Base

# Many-to-many relationship table for community post likes
post_likes = Table(
    "post_likes",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("post_id", Integer, ForeignKey("community_posts.id", ondelete="CASCADE"), primary_key=True)
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="user") # user, admin
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    trips = relationship("Trip", back_populates="user", cascade="all, delete-orphan")
    saved_destinations = relationship("SavedDestination", back_populates="user", cascade="all, delete-orphan")
    posts = relationship("CommunityPost", back_populates="author", cascade="all, delete-orphan")
    comments = relationship("PostComment", back_populates="author", cascade="all, delete-orphan")
    liked_posts = relationship("CommunityPost", secondary=post_likes, back_populates="liked_by")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    bio = Column(String(500), default="")
    avatar = Column(String(500), default="")
    countries_visited = Column(Integer, default=0)
    language = Column(String(50), default="English")
    saved_destinations_raw = Column(String(500), default="") # Semicolon-separated string for compatibility

    user = relationship("User", back_populates="profile")


class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    country = Column(String(100), nullable=False)
    region = Column(String(100), nullable=False)
    description = Column(String(1000), default="")
    image_url = Column(String(500), default="")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    cost_index = Column(Integer, default=3) # 1-5 scale (budget to luxury)
    popularity_score = Column(Float, default=4.0)

    activities = relationship("Activity", back_populates="city", cascade="all, delete-orphan")
    stops = relationship("Stop", back_populates="city", cascade="all, delete-orphan")
    saved_by = relationship("SavedDestination", back_populates="city", cascade="all, delete-orphan")


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    city_id = Column(Integer, ForeignKey("cities.id", ondelete="CASCADE"))
    name = Column(String(200), nullable=False, index=True)
    description = Column(String(1000), default="")
    category = Column(String(100), nullable=False)
    image_url = Column(String(500), default="")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    estimated_duration = Column(Integer, default=120) # in minutes
    estimated_cost = Column(Float, default=0.0)
    rating = Column(Float, default=4.0)
    popularity_score = Column(Float, default=4.0)

    city = relationship("City", back_populates="activities")
    trip_activities = relationship("TripActivity", back_populates="activity", cascade="all, delete-orphan")


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    name = Column(String(200), nullable=False)
    destination = Column(String(200), default="")
    description = Column(String(1000), default="")
    cover_image = Column(String(500), default="")
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    total_budget = Column(Float, default=0.0)
    travelers_count = Column(Integer, default=1)
    currency = Column(String(10), default="USD")
    status = Column(String(50), default="Draft") # Draft, Upcoming, Ongoing, Completed
    is_public = Column(Boolean, default=False)
    share_token = Column(String(100), unique=True, index=True, nullable=True)
    interests_raw = Column(String(255), default="") # Comma-separated string of selected interests
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="trips")
    stops = relationship("Stop", back_populates="trip", order_by="Stop.order_index", cascade="all, delete-orphan")
    budget_items = relationship("BudgetItem", back_populates="trip", cascade="all, delete-orphan")
    transports = relationship("Transport", back_populates="trip", cascade="all, delete-orphan")


class Stop(Base):
    __tablename__ = "stops"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id", ondelete="CASCADE"))
    city_id = Column(Integer, ForeignKey("cities.id", ondelete="CASCADE"))
    arrival_date = Column(Date, nullable=True)
    departure_date = Column(Date, nullable=True)
    order_index = Column(Integer, default=0)
    city_header = Column(String(100), nullable=True) # editable city/stop title
    notes = Column(String(500), default="")

    trip = relationship("Trip", back_populates="stops")
    city = relationship("City", back_populates="stops")
    activities = relationship("TripActivity", back_populates="stop", order_by="TripActivity.order_index", cascade="all, delete-orphan")
    budget_items = relationship("BudgetItem", back_populates="stop", cascade="all, delete-orphan")


class TripActivity(Base):
    __tablename__ = "trip_activities"

    id = Column(Integer, primary_key=True, index=True)
    stop_id = Column(Integer, ForeignKey("stops.id", ondelete="CASCADE"))
    activity_id = Column(Integer, ForeignKey("activities.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(200), nullable=False) # Activity title
    date = Column(Date, nullable=True)
    time = Column(String(50), default="10:00 AM") # e.g. 10:00 AM
    order_index = Column(Integer, default=0)
    cost = Column(Float, default=0.0) # custom/estimated cost
    location = Column(String(200), default="")
    note = Column(String(500), default="")
    status = Column(String(50), default="Planned") # Planned, Completed, Canceled

    stop = relationship("Stop", back_populates="activities")
    activity = relationship("Activity", back_populates="trip_activities")


class BudgetItem(Base):
    __tablename__ = "budget_items"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id", ondelete="CASCADE"))
    stop_id = Column(Integer, ForeignKey("stops.id", ondelete="CASCADE"), nullable=True)
    category = Column(String(100), nullable=False) # lodging, transit, dining, activities, other
    title = Column(String(200), nullable=False)
    amount = Column(Float, nullable=False) # actual cost
    date = Column(Date, nullable=True)
    notes = Column(String(500), default="")

    trip = relationship("Trip", back_populates="budget_items")
    stop = relationship("Stop", back_populates="budget_items")


class Transport(Base):
    __tablename__ = "transports"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id", ondelete="CASCADE"))
    from_stop_id = Column(Integer, ForeignKey("stops.id", ondelete="CASCADE"), nullable=True)
    to_stop_id = Column(Integer, ForeignKey("stops.id", ondelete="CASCADE"), nullable=True)
    transport_type = Column(String(100), nullable=False) # Flight, Train, Car, Bus, Cruise
    estimated_cost = Column(Float, default=0.0)
    duration = Column(Integer, default=0) # in minutes
    departure_time = Column(String(50), default="")
    arrival_time = Column(String(50), default="")

    trip = relationship("Trip", back_populates="transports")
    from_stop = relationship("Stop", foreign_keys=[from_stop_id])
    to_stop = relationship("Stop", foreign_keys=[to_stop_id])


class SavedDestination(Base):
    __tablename__ = "saved_destinations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    city_id = Column(Integer, ForeignKey("cities.id", ondelete="CASCADE"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="saved_destinations")
    city = relationship("City", back_populates="saved_by")


class CommunityPost(Base):
    __tablename__ = "community_posts"

    id = Column(Integer, primary_key=True, index=True)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String(200), nullable=False)
    content = Column(String(2000), nullable=False)
    destination = Column(String(100), default="")
    image = Column(String(500), default="")
    likes_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    author = relationship("User", back_populates="posts")
    comments = relationship("PostComment", back_populates="post", cascade="all, delete-orphan")
    liked_by = relationship("User", secondary=post_likes, back_populates="liked_posts")


class PostComment(Base):
    __tablename__ = "post_comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("community_posts.id", ondelete="CASCADE"))
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    content = Column(String(1000), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    post = relationship("CommunityPost", back_populates="comments")
    author = relationship("User", back_populates="comments")
