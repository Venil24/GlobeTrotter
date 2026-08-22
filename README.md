# GlobeTrotter — Personalized Multi-City Travel Planner

GlobeTrotter is a full-stack travel planner platform designed to make multi-city itinerary building and budget tracking simple and intuitive. This application uses a modern **React TypeScript** client connected to a robust **FastAPI & SQLAlchemy** backend with relational database persistence.

---

## Relational Database Structure

The project models data dynamically using **SQLAlchemy** (targeting PostgreSQL or SQLite):

*   **Users**: Handles credential storage and roles (Admin/User).
*   **UserProfiles**: Holds traveler bios, languages, and saved destinations.
*   **Trips**: Defines budgets, start/end dates, cover photos, and travelers count.
*   **Stops**: Represents sequential itinerary stops/days linked to cities.
*   **Cities**: Static global destinations populated via seed scripts (30+ global cities).
*   **Activities**: Attractions and things to do inside each city (6+ activities per city).
*   **TripActivities**: Specific scheduled activities assigned to days.
*   **BudgetItems**: Category-based actual expenses logged during planning.

---

## Project Structure

```
/globetrotter
  ├── /frontend
  │     ├── /src
  │     │    ├── /components    # Shared navigation and buttons
  │     │    ├── /pages         # Aligned dashboard and planner views
  │     │    ├── /services      # Axios central API config
  │     │    ├── /contexts      # AppContext React providers
  │     │    ├── /types         # TypeScript interfaces
  │     │    └── main.tsx
  │     ├── tsconfig.json
  │     └── package.json
  │
  ├── /backend
  │     ├── /app
  │     │    ├── /api           # FastAPI routers (auth, trips, stops, etc.)
  │     │    ├── /core          # Settings and JWT token handlers
  │     │    ├── /database      # SQLAlchemy connections
  │     │    ├── /models        # Database schema definitions
  │     │    ├── /schemas       # Pydantic serializer schemas
  │     │    └── /services      # Recommendations engine & seed scripts
  │     ├── main.py
  │     └── requirements.txt
  │
  └── .env.example
```

---

## Smart Suggestions Algorithm

GlobeTrotter features an algorithmic recommendation scoring service (`recommendation.py`):

*   **Interest Score**: Checks if the activity category matches selected preferences.
*   **Budget Score**: Adapts recommendations to daily budget. Tight allowances prioritize free/low-cost activities. Larger budgets unlock premium experiences.
*   **Proximity Score**: Groups activities in close geographical coordinates to minimize travel backtracking.
*   **Popularity Score**: Integrates ratings to highlight highly-rated local options.

---

## Getting Started

### Prerequisites
*   Python 3.10+
*   Node.js 18+
*   PostgreSQL or SQLite

### Local Development Setup

1.  **Backend Setup**:
    ```bash
    cd backend
    pip install -r requirements.txt
    pip install email-validator
    python main.py
    ```
    *   This will initialize `globetrotter.db` (SQLite) and run the seed script to populate 30 cities and activities automatically.
    *   The API docs will be available at `http://127.0.0.1:8000/docs`.

2.  **Frontend Setup**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    *   Vite server starts at `http://127.0.0.1:5173/`.

---

## Hackathon Test Accounts

To test features immediately, use the following pre-seeded database accounts:

*   **Standard Traveler User**:
    *   Email: `alex@globetrotter.com`
    *   Password: `password123`
*   **Administrator User**:
    *   Email: `admin@globetrotter.com`
    *   Password: `adminpwd`
