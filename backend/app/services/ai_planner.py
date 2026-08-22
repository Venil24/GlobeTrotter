import json
import logging
from datetime import date, timedelta
from typing import List, Dict, Any, Optional
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

# Curated fallback high-res destination images
DEST_IMAGES: Dict[str, str] = {
    "goa": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200",
    "jaipur": "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200",
    "tokyo": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200",
    "paris": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200",
    "rome": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200",
    "bangkok": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200",
    "dubai": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200",
    "bali": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200",
    "barcelona": "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200",
    "santorini": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200",
    "kyoto": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200",
    "kerala": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200",
    "ladakh": "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=1200",
    "amalfi coast": "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200",
    "swiss alps": "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200",
    "new york": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200",
    "london": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200",
}

def get_destination_image(destination: str) -> str:
    dest_lower = destination.lower()
    for key, url in DEST_IMAGES.items():
        if key in dest_lower or dest_lower in key:
            return url
    return "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200"


def generate_fallback_plan(
    destination: str,
    start_date: date,
    end_date: date,
    budget: float = 25000.0,
    travelers: int = 1,
    category: str = "Leisure",
    interests: Optional[List[str]] = None
) -> Dict[str, Any]:
    """
    Intelligent algorithmic fallback that builds a complete day-by-day plan
    when Gemini API key is not configured or in case of network issues.
    """
    duration = (end_date - start_date).days + 1
    duration = max(1, duration)
    daily_budget = budget / duration if budget > 0 else 5000.0
    cover_image = get_destination_image(destination)

    # Activity templates
    morning_templates = [
        {"title": f"Explore Iconic Landmarks & Historic Heritage in {destination}", "time": "09:00 AM", "cost": round(daily_budget * 0.15), "category": "activities", "note": "Early morning visit for best photo lighting and fewer crowds."},
        {"title": f"Scenic Walking Tour & Cultural Quarter of {destination}", "time": "08:30 AM", "cost": 0, "category": "activities", "note": "Immerse in the local atmosphere, architecture, and morning markets."},
        {"title": f"Famous Temple & Palace Architecture Visit", "time": "09:30 AM", "cost": round(daily_budget * 0.12), "category": "activities", "note": "Guided historical exploration of renowned architecture."},
        {"title": f"Nature Walk & Panoramic Scenic Viewpoint", "time": "08:00 AM", "cost": 0, "category": "activities", "note": "Breathtaking views over the skyline and surrounding landscape."},
    ]

    afternoon_templates = [
        {"title": f"Authentic Regional Lunch & Street Food Tasting", "time": "01:00 PM", "cost": round(daily_budget * 0.20), "category": "dining", "note": "Savor local specialties and culinary favorites in popular dining areas."},
        {"title": f"Art Museum, Gallery & Cultural Exhibition Tour", "time": "02:30 PM", "cost": round(daily_budget * 0.10), "category": "activities", "note": "Discover masterworks, artisan exhibits, and craft history."},
        {"title": f"Traditional Market & Souk Shopping Excursion", "time": "03:30 PM", "cost": round(daily_budget * 0.15), "category": "activities", "note": "Browse handmade souvenirs, textiles, and authentic regional crafts."},
        {"title": f"Waterfront Stroll or Botanical Gardens Walk", "time": "03:00 PM", "cost": round(daily_budget * 0.08), "category": "activities", "note": "Relaxing afternoon surrounded by lush flora and serene waterways."},
    ]

    evening_templates = [
        {"title": f"Sunset Viewpoint & Golden Hour Photography", "time": "06:00 PM", "cost": 0, "category": "activities", "note": "Watch the sunset from the most picturesque vantage point."},
        {"title": f"Curated Dinner at Renowned Local Eatery", "time": "07:30 PM", "cost": round(daily_budget * 0.25), "category": "dining", "note": "Fine evening dining with ambient music and regional wine or drinks."},
        {"title": f"Night Market & Vibrant Evening Promenade", "time": "08:00 PM", "cost": round(daily_budget * 0.10), "category": "activities", "note": "Experience the bustling nightlife, street performers, and dessert stalls."},
        {"title": f"Cultural Performance, Show or Riverside Lounge", "time": "08:30 PM", "cost": round(daily_budget * 0.20), "category": "activities", "note": "Enjoy traditional theatrical dance, music, or illuminated river views."},
    ]

    itinerary = []
    for day_idx in range(1, duration + 1):
        day_date = start_date + timedelta(days=day_idx - 1)
        m_act = morning_templates[(day_idx - 1) % len(morning_templates)].copy()
        a_act = afternoon_templates[(day_idx - 1) % len(afternoon_templates)].copy()
        e_act = evening_templates[(day_idx - 1) % len(evening_templates)].copy()

        m_act["location"] = f"Central {destination}"
        a_act["location"] = f"Old Quarter, {destination}"
        e_act["location"] = f"Downtown {destination}"

        itinerary.append({
            "day": day_idx,
            "date": day_date.isoformat(),
            "city_header": f"Day {day_idx}: Discovering {destination}",
            "notes": f"Full day exploration focusing on {destination}'s top attractions, cuisine, and culture.",
            "activities": [m_act, a_act, e_act]
        })

    # Suggested expenses
    expenses = [
        {"title": f"Hotel & Accommodation in {destination}", "category": "lodging", "amount": round(budget * 0.35 if budget > 0 else 10000.0)},
        {"title": "Local Transport, Taxis & Metro", "category": "transit", "amount": round(budget * 0.15 if budget > 0 else 3000.0)},
        {"title": "Dining & Food Experiences", "category": "dining", "amount": round(budget * 0.25 if budget > 0 else 6000.0)},
        {"title": "Sightseeing & Entry Tickets", "category": "activities", "amount": round(budget * 0.20 if budget > 0 else 5000.0)},
    ]

    return {
        "title": f"{destination} {category} Expedition",
        "destination": destination,
        "description": f"A comprehensive {duration}-day {category.lower()} journey through {destination} tailored for {travelers} traveler{'s' if travelers > 1 else ''}, filled with iconic landmarks, authentic local food, and cultural highlights.",
        "cover_image": cover_image,
        "budget": budget,
        "travelers": travelers,
        "category": category,
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "itinerary": itinerary,
        "expenses": expenses
    }


async def generate_tour_itinerary(
    destination: str,
    start_date: date,
    end_date: date,
    budget: float = 25000.0,
    travelers: int = 1,
    category: str = "Leisure",
    interests: Optional[List[str]] = None
) -> Dict[str, Any]:
    """
    Generates a full day-by-day tour itinerary using Gemini 2.0 Flash API.
    Falls back gracefully to high-quality procedural planner if API key is not present.
    """
    duration = (end_date - start_date).days + 1
    duration = max(1, duration)
    interests_str = ", ".join(interests) if interests else "Sightseeing, Food, Culture, Photography"
    api_key = settings.GEMINI_API_KEY.strip()

    if not api_key:
        logger.info("No GEMINI_API_KEY configured. Utilizing built-in intelligent knowledge planner.")
        return generate_fallback_plan(destination, start_date, end_date, budget, travelers, category, interests)

    prompt = f"""
You are an expert global travel planning system. Generate a comprehensive, realistic, day-by-day travel itinerary for a tour to {destination}.

Tour Specifications:
- Destination: {destination}
- Duration: {duration} days
- Start Date: {start_date.isoformat()}
- End Date: {end_date.isoformat()}
- Total Budget: ₹{budget} INR (Indian Rupees)
- Number of Travelers: {travelers}
- Travel Style: {category}
- Interests: {interests_str}

Please generate an authentic, realistic tour itinerary covering EVERY SINGLE DAY from Day 1 to Day {duration}.
For EACH DAY, provide 3 to 4 chronological activities (Morning ~09:00 AM, Lunch/Afternoon ~01:00 PM, Afternoon Sightseeing ~04:00 PM, Evening/Dinner ~08:00 PM) with real locations, landmark names, realistic cost estimates in INR ₹, and helpful insider notes.

You MUST respond strictly with a valid JSON object following this exact schema:
{{
  "title": "{destination} Travel Itinerary",
  "destination": "{destination}",
  "description": "2-3 sentences summarizing the journey highlight and experiences.",
  "cover_image": "{get_destination_image(destination)}",
  "budget": {budget},
  "travelers": {travelers},
  "category": "{category}",
  "itinerary": [
    {{
      "day": 1,
      "date": "{start_date.isoformat()}",
      "city_header": "Day 1: Arrival & Historic Exploration",
      "notes": "Day overview notes",
      "activities": [
        {{
          "title": "Specific activity name",
          "time": "09:30 AM",
          "location": "Exact landmark / area name in {destination}",
          "cost": 500,
          "category": "activities",
          "note": "Insider tip or guidance"
        }}
      ]
    }}
  ],
  "expenses": [
    {{
      "title": "Hotel / Lodging for {duration} nights",
      "category": "lodging",
      "amount": {round(budget * 0.35 if budget > 0 else 8000)}
    }},
    {{
      "title": "Local Transportation & Transfers",
      "category": "transit",
      "amount": {round(budget * 0.15 if budget > 0 else 3000)}
    }},
    {{
      "title": "Dining & Local Cuisine",
      "category": "dining",
      "amount": {round(budget * 0.25 if budget > 0 else 6000)}
    }},
    {{
      "title": "Activity Tickets & Entry Passes",
      "category": "activities",
      "amount": {round(budget * 0.20 if budget > 0 else 5000)}
    }}
  ]
}}
IMPORTANT: Respond ONLY with raw JSON. Do not include markdown code blocks, backticks, or any additional conversational text.
"""

    gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.3,
            "responseMimeType": "application/json"
        }
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(gemini_url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                text_content = data["candidates"][0]["content"]["parts"][0]["text"]
                # Clean up if markdown backticks exist
                clean_json = text_content.strip()
                if clean_json.startswith("```json"):
                    clean_json = clean_json[7:]
                if clean_json.startswith("```"):
                    clean_json = clean_json[3:]
                if clean_json.endswith("```"):
                    clean_json = clean_json[:-3]
                clean_json = clean_json.strip()

                parsed = json.loads(clean_json)
                # Ensure cover image and dates
                if not parsed.get("cover_image"):
                    parsed["cover_image"] = get_destination_image(destination)
                parsed["start_date"] = start_date.isoformat()
                parsed["end_date"] = end_date.isoformat()
                return parsed
            else:
                logger.warning(f"Gemini API returned status {resp.status_code}: {resp.text}. Using fallback planner.")
                return generate_fallback_plan(destination, start_date, end_date, budget, travelers, category, interests)
    except Exception as e:
        logger.error(f"Error calling Gemini API: {e}. Using fallback planner.")
        return generate_fallback_plan(destination, start_date, end_date, budget, travelers, category, interests)
