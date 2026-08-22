from sqlalchemy.orm import Session
from app.models.models import City, Activity, User, UserProfile
from app.core.security import get_password_hash

def seed_database(db: Session):
    # Check if cities already exist
    if db.query(City).first() is not None:
        print("Database already seeded. Skipping seeder.")
        return

    print("Seeding cities and activities database...")

    # Create default user for hackathon testing
    if db.query(User).filter(User.email == "alex@globetrotter.com").first() is None:
        user = User(
            name="Alex Mercer",
            email="alex@globetrotter.com",
            password_hash=get_password_hash("password123"),
            role="user"
        )
        db.add(user)
        db.flush()
        
        profile = UserProfile(
            user_id=user.id,
            bio="Full stack developer traveling the world. Coding from beaches and coffee shops.",
            avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
            countries_visited=8,
            language="English",
            saved_destinations_raw="Goa, India; Tokyo, Japan; Paris, France"
        )
        db.add(profile)

    # Admin User
    if db.query(User).filter(User.email == "admin@globetrotter.com").first() is None:
        admin_user = User(
            name="GlobeTrotter Administrator",
            email="admin@globetrotter.com",
            password_hash=get_password_hash("adminpwd"),
            role="admin"
        )
        db.add(admin_user)
        db.flush()

        profile_admin = UserProfile(
            user_id=admin_user.id,
            bio="Lead architect and system administrator of GlobeTrotter.",
            avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
            countries_visited=12,
            language="English"
        )
        db.add(profile_admin)

    # Seed list of 30 Cities
    cities_data = [
        {"name": "Goa", "country": "India", "region": "South Asia", "lat": 15.2993, "lon": 74.1240, "cost": 2, "pop": 4.8, "img": "https://lh3.googleusercontent.com/aida-public/AB6AXuC5F_jmAqAfzyuSkOCZyTFRkyECtbdvkS0qGWnnqMoiXEaGkjak2FVc-96p1iTvTdkSchafngU3XQuTOhM7s3avxVxtSoKB9n6cobvJ14r6SBRoUmPkc3iuOLx09J0p2O3HtfMLAoe8iDtpFKavu7h01tgC1CfETQXjHXjrFgkfYdUfFikf5UQnhjCHPn3lsBRx9USQgN_bzpV6NQwlywxNqmroFMkhBN51hTBlzU2xf6J7HrpykolU"},
        {"name": "Mumbai", "country": "India", "region": "South Asia", "lat": 19.0760, "lon": 72.8777, "cost": 3, "pop": 4.6, "img": "https://lh3.googleusercontent.com/aida-public/AB6AXuDFW6c2-Byp6W140Lph6-6H6-PjS3X6XJ2uY5-jD_05K0_0-2s-3V0Xy6v5u3q0A-pXINO2O-zJ6y7wGq8wH0MzX6v-K5gX6o-u-wR6y5v_pP-r"},
        {"name": "Tokyo", "country": "Japan", "region": "East Asia", "lat": 35.6762, "lon": 139.6503, "cost": 4, "pop": 4.9, "img": "https://lh3.googleusercontent.com/aida-public/AB6AXuATEohDm8zCj_ermd_wSuvQJeDpfHSUL2kADRJpl9HcF3EM3y9FKN-zzPdh_Z1Sst8EGl00d4Ws_0EVIbgfuLliTFsWfTpuXX84a_sPzRgOfI1GVL6ntGdfnkDlWE2rwOdu9OmE8RqNUDxu5UK2D4gdVwdI_EhA6ujCxUVYBKPPV1ftJoEmkehz3Bs_gFiZ4jKxAYqiswH0mQ1mjgCkWAgZom-mijIoyxPPTVhkzuvPBEChejSOjd9V"},
        {"name": "Paris", "country": "France", "region": "Western Europe", "lat": 48.8566, "lon": 2.3522, "cost": 4, "pop": 4.8, "img": "https://lh3.googleusercontent.com/aida-public/AB6AXuADgdCkvv6hccO-ejPtrh_3frMT9ZAmUv4UuLS_KBSD2TuZ1eTEKTEDLdUUirgkln8nq58tZHuDkls4PARDx8sYvbOYtrjGGVYuxBpizoKLlgNFKRiTdIh7p9zEVzDjgo7F4Ioo3SBb8fQtaOlm9mBGol_Nxtxs_YURL0cfxwXA3-MMzLy17E5W8feGHgD5U5j3d0UXaxUUtCBNrb6evkJK6COto8JQyJ7Z_6Fqfw6E6h1uWk-7Fid4"},
        {"name": "New York", "country": "United States", "region": "North America", "lat": 40.7128, "lon": -74.0060, "cost": 5, "pop": 4.9, "img": "https://lh3.googleusercontent.com/aida-public/AB6AXuCe1fE1C0g1eK3P3R6Wp0Vv1qJ4Y5eQd1m9uR3oW0A8r3g9V8X0yY-rD1uY3oW0A8r3g9V8X0yY-rD1uY3oW0A8r3g9V8X"},
        {"name": "Rome", "country": "Italy", "region": "Southern Europe", "lat": 41.9028, "lon": 12.4964, "cost": 3, "pop": 4.7, "img": "https://lh3.googleusercontent.com/aida-public/AB6AXuB9-T8ARvR0uXVKrIIfxsjXrD0Aw7jRFfqtD_RGv3b9Yiu2u7N4VliHL67f3m4CdVK0atb9JmdLGvKbJHEeuU1tggPnw5gfGq84487uhTxQCH4RHhyYF1yIIdNODwmKwKnPzw-j4Fq0Ed71cB1mvoWkt64yXIrwfovxp8yJNzGc5wgU_zCRmiJ_0WV-71LYRGu8kioTFlUecOzwZDQdo4UykoT8w2a01WqVVEviQdNc4CBKSnmwXd5H"},
        {"name": "Bali", "country": "Indonesia", "region": "Southeast Asia", "lat": -8.4095, "lon": 115.1889, "cost": 2, "pop": 4.7, "img": "https://lh3.googleusercontent.com/aida-public/AB6AXuB8_LZZ7C_Vq_qWreXSlPyJoIIBmlcwRg-ja_gwIoeAryJ2cQg8bv09bdMz"},
        {"name": "London", "country": "United Kingdom", "region": "Western Europe", "lat": 51.5074, "lon": -0.1278, "cost": 4, "pop": 4.8, "img": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600"},
        {"name": "Dubai", "country": "United Arab Emirates", "region": "Middle East", "lat": 25.2048, "lon": 55.2708, "cost": 5, "pop": 4.8, "img": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600"},
        {"name": "Singapore", "country": "Singapore", "region": "Southeast Asia", "lat": 1.3521, "lon": 103.8198, "cost": 4, "pop": 4.7, "img": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600"},
        {"name": "Bangkok", "country": "Thailand", "region": "Southeast Asia", "lat": 13.7563, "lon": 100.5018, "cost": 2, "pop": 4.6, "img": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600"},
        {"name": "Jaipur", "country": "India", "region": "South Asia", "lat": 26.9124, "lon": 75.7873, "cost": 2, "pop": 4.5, "img": "https://images.unsplash.com/photo-1477584322811-5a3ecf535533?w=600"},
        {"name": "Delhi", "country": "India", "region": "South Asia", "lat": 28.7041, "lon": 77.1025, "cost": 2, "pop": 4.4, "img": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600"},
        {"name": "Barcelona", "country": "Spain", "region": "Southern Europe", "lat": 41.3851, "lon": 2.1734, "cost": 3, "pop": 4.7, "img": "https://images.unsplash.com/photo-1583422409516-2895a77efedd?w=600"},
        {"name": "Rishikesh", "country": "India", "region": "South Asia", "lat": 30.0869, "lon": 78.2676, "cost": 1, "pop": 4.5, "img": "https://images.unsplash.com/photo-1571536802807-304bc15a6248?w=600"},
        {"name": "Manali", "country": "India", "region": "South Asia", "lat": 32.2396, "lon": 77.1887, "cost": 1, "pop": 4.6, "img": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600"},
        {"name": "Udaipur", "country": "India", "region": "South Asia", "lat": 24.5854, "lon": 73.7125, "cost": 2, "pop": 4.6, "img": "https://images.unsplash.com/photo-1595867818082-08386b72d5e9?w=600"},
        {"name": "Sydney", "country": "Australia", "region": "Oceania", "lat": -33.8688, "lon": 151.2093, "cost": 4, "pop": 4.8, "img": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600"},
        {"name": "Cape Town", "country": "South Africa", "region": "Africa", "lat": -33.9249, "lon": 18.4241, "cost": 3, "pop": 4.7, "img": "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600"},
        {"name": "Cairo", "country": "Egypt", "region": "North Africa", "lat": 30.0444, "lon": 31.2357, "cost": 1, "pop": 4.5, "img": "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600"},
        {"name": "Reykjavik", "country": "Iceland", "region": "Northern Europe", "lat": 64.1466, "lon": -21.9426, "cost": 5, "pop": 4.7, "img": "https://images.unsplash.com/photo-1504829857797-ddff28127792?w=600"},
        {"name": "Bangalore", "country": "India", "region": "South Asia", "lat": 12.9716, "lon": 77.5946, "cost": 2, "pop": 4.3, "img": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600"},
        {"name": "Hyderabad", "country": "India", "region": "South Asia", "lat": 17.3850, "lon": 78.4867, "cost": 2, "pop": 4.4, "img": "https://images.unsplash.com/photo-1608958416715-bc44a861614e?w=600"},
        {"name": "Ahmedabad", "country": "India", "region": "South Asia", "lat": 23.0225, "lon": 72.5714, "cost": 1, "pop": 4.2, "img": "https://images.unsplash.com/photo-1627581977755-1f1917f6505e?w=600"},
        {"name": "Amsterdam", "country": "Netherlands", "region": "Western Europe", "lat": 52.3676, "lon": 4.9041, "cost": 4, "pop": 4.7, "img": "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=600"},
        {"name": "Rio de Janeiro", "country": "Brazil", "region": "South America", "lat": -22.9068, "lon": -43.1729, "cost": 3, "pop": 4.6, "img": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600"},
        {"name": "Istanbul", "country": "Turkey", "region": "Southern Europe", "lat": 41.0082, "lon": 28.9784, "cost": 2, "pop": 4.7, "img": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600"},
        {"name": "Vancouver", "country": "Canada", "region": "North America", "lat": 49.2827, "lon": -123.1207, "cost": 4, "pop": 4.7, "img": "https://images.unsplash.com/photo-1559511260-66a654ae982a?w=600"},
        {"name": "Kyoto", "country": "Japan", "region": "East Asia", "lat": 35.0116, "lon": 135.7681, "cost": 3, "pop": 4.8, "img": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600"},
        {"name": "Santorini", "country": "Greece", "region": "Southern Europe", "lat": 36.3932, "lon": 25.4615, "cost": 5, "pop": 4.9, "img": "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600"}
    ]

    for city_info in cities_data:
        city = City(
            name=city_info["name"],
            country=city_info["country"],
            region=city_info["region"],
            description=f"Explore the wonders and beautiful landmarks of {city_info['name']} in {city_info['country']}.",
            image_url=city_info["img"],
            latitude=city_info["lat"],
            longitude=city_info["lon"],
            cost_index=city_info["cost"],
            popularity_score=city_info["pop"]
        )
        db.add(city)
        db.flush()

        # Activities definitions for this city
        # Seed 5 to 6 activities each
        activities = [
            {
                "name": f"Classic {city.name} Walking Tour",
                "desc": f"Discover the iconic history and architectural highlights of {city.name} with an expert local guide.",
                "cat": "Sightseeing",
                "cost": 15.0 if city.cost_index > 2 else 5.0,
                "dur": 120,
                "rating": 4.5,
                "offset_lat": 0.005, "offset_lon": 0.005
            },
            {
                "name": f"Vibrant {city.name} Food Experience",
                "desc": f"Sample authentic regional delicacies and local street food in the heart of {city.name}.",
                "cat": "Food",
                "cost": 30.0 if city.cost_index > 2 else 12.0,
                "dur": 90,
                "rating": 4.8,
                "offset_lat": -0.004, "offset_lon": 0.003
            },
            {
                "name": f"Scenic Photo Shoot in {city.name}",
                "desc": "Capture beautiful memories with professional photos set against panoramic views.",
                "cat": "Entertainment",
                "cost": 50.0 if city.cost_index > 2 else 20.0,
                "dur": 60,
                "rating": 4.6,
                "offset_lat": 0.002, "offset_lon": -0.005
            },
            {
                "name": f"{city.name} Cultural Museum Entrance",
                "desc": "Immerse yourself in centuries of art, historical archives, and interactive exhibitions.",
                "cat": "Culture",
                "cost": 12.0 if city.cost_index > 2 else 0.0, # free for budget
                "dur": 180,
                "rating": 4.4,
                "offset_lat": -0.006, "offset_lon": -0.002
            },
            {
                "name": f"Hidden Secrets of {city.name} Cycle Tour",
                "desc": "Bike through quaint neighborhoods and hidden spots off the beaten path.",
                "cat": "Adventure",
                "cost": 25.0 if city.cost_index > 2 else 10.0,
                "dur": 150,
                "rating": 4.7,
                "offset_lat": 0.003, "offset_lon": 0.006
            }
        ]

        # Add a custom beach/nature activity for coastal regions
        if city.name in ["Goa", "Bali", "Santorini", "Amalfi Coast", "Maldives", "Sydney"]:
            activities.append({
                "name": f"Sunset Beach Catamaran Cruise in {city.name}",
                "desc": "Sail off the coast to catch beautiful golden hour views with light drinks.",
                "cat": "Beach",
                "cost": 75.0 if city.cost_index > 3 else 35.0,
                "dur": 120,
                "rating": 4.9,
                "offset_lat": 0.010, "offset_lon": -0.010
            })
        else:
            activities.append({
                "name": f"Green Nature Park Escape in {city.name}",
                "desc": "A relaxing hike or picnic in the city's highest rated botanic gardens.",
                "cat": "Nature",
                "cost": 0.0, # free nature
                "dur": 120,
                "rating": 4.5,
                "offset_lat": 0.009, "offset_lon": -0.008
            })

        for act_info in activities:
            act = Activity(
                city_id=city.id,
                name=act_info["name"],
                description=act_info["desc"],
                category=act_info["cat"],
                image_url=city.image_url,
                latitude=city.latitude + act_info["offset_lat"],
                longitude=city.longitude + act_info["offset_lon"],
                estimated_duration=act_info["dur"],
                estimated_cost=act_info["cost"],
                rating=act_info["rating"],
                popularity_score=act_info["rating"]
            )
            db.add(act)

    db.commit()
    print("Database seeding completed successfully.")
