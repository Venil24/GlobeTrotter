import math
from typing import List
from app.models.models import Trip, Activity, Stop, TripActivity

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    # Haversine distance formula in km
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 + 
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def get_recommendations(trip: Trip, stop: Stop, available_activities: List[Activity]) -> List[dict]:
    # Weights for scoring
    W_INTEREST = 35.0
    W_BUDGET = 25.0
    W_POPULARITY = 20.0
    W_PROXIMITY = 20.0

    # User interests
    user_interests = [i.strip().lower() for i in trip.interests_raw.split(",") if i.strip()]
    
    # Calculate daily allowance
    trip_days = (trip.end_date - trip.start_date).days or 1
    daily_budget = trip.total_budget / trip_days
    
    # Coordinates of existing activities in this stop to calculate proximity
    existing_coords = []
    for ta in stop.activities:
        if ta.activity:
            existing_coords.append((ta.activity.latitude, ta.activity.longitude))

    recommendations = []

    for act in available_activities:
        # 1. Interest Score (0 - 100)
        interest_score = 0.0
        if act.category.lower() in user_interests:
            interest_score = 100.0
        else:
            # Partial match checks if category substring is contained
            for ui in user_interests:
                if ui in act.category.lower() or act.category.lower() in ui:
                    interest_score = 50.0
                    break

        # 2. Budget Compatibility Score (0 - 100)
        budget_score = 100.0
        # If activity is free, it's always budget compatible
        if act.estimated_cost > 0:
            if daily_budget <= 30: # tight budget
                # Heavily penalize costly activities
                budget_score = max(0.0, 100.0 - (act.estimated_cost * 2.5))
            elif daily_budget <= 100: # medium budget
                # Mild penalty for costly activities
                budget_score = max(0.0, 100.0 - (act.estimated_cost * 0.8))
            else: # luxury budget
                # Prioritize premium activities, slightly penalize very cheap ones to offer premium experiences
                if act.estimated_cost < 20:
                    budget_score = 60.0
                else:
                    budget_score = 100.0

        # 3. Popularity Score (0 - 100)
        # Normalize 1-5 star ratings to 0-100 scale
        popularity_score = (act.popularity_score / 5.0) * 100.0

        # 4. Proximity Score (0 - 100)
        # If no activities are scheduled yet, default proximity score is 100
        proximity_score = 100.0
        if existing_coords:
            min_dist = float("inf")
            for lat, lon in existing_coords:
                dist = calculate_distance(act.latitude, act.longitude, lat, lon)
                if dist < min_dist:
                    min_dist = dist
            
            # Map distance in km to score (closer is higher score, e.g. < 5km is high score)
            proximity_score = max(0.0, 100.0 - (min_dist * 8.0))

        # Total recommendation score
        total_score = (
            (interest_score * W_INTEREST) +
            (budget_score * W_BUDGET) +
            (popularity_score * W_POPULARITY) +
            (proximity_score * W_PROXIMITY)
        ) / 100.0 # scale back to 0 - 100

        # Create reason snippet based on metrics
        reason = f"Matches your interest in '{act.category}'"
        if act.estimated_cost == 0:
            reason += " and is fully free of cost."
        elif budget_score > 80:
            reason += f" and fits your daily allowance of ${int(daily_budget)}/day."
        else:
            reason += " and is a top-rated experience."

        recommendations.append({
            "activity": act,
            "score": round(total_score, 1),
            "reason": reason
        })

    # Sort by descending score
    recommendations.sort(key=lambda x: x["score"], reverse=True)
    return recommendations
