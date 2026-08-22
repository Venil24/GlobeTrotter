# GlobeTrotter — Personalized Multi-City Travel Planner ✈️

GlobeTrotter is a modern, full-stack travel planner platform designed to make multi-city itinerary building, budget tracking, and tour scheduling simple, intuitive, and dynamic. Built with a high-performance **React TypeScript** client connected to a robust **FastAPI & SQLAlchemy** backend with relational database persistence.

---

## 🌟 Key Features

*   **✨ 1-Click Smart Tour Generator**: Generate a complete day-by-day travel itinerary for any destination between your chosen start and end dates. Powered by **Google Gemini 2.0 Flash API**, scheduling morning, afternoon, and evening activities, locations, realistic cost estimates in ₹ (INR), notes, and category budget items.
*   **📅 Interactive Itinerary Builder & Timeline**: Full drag-and-drop / chronological schedule builder. Customize each tour day, edit city headers, add custom activities, modify times, and add notes.
*   **📊 Dynamic Expense & Budget Management**: Track actual spend against your planned budget across Accommodation, Dining, Transit, Activities, and miscellaneous expenses with real-time budget limit alerts.
*   **🗓️ Trip Calendar & Multi-Day Views**: Seamlessly switch between detailed timeline views and full-month calendar grids.
*   **👑 Live Real-Time Admin Portal**: Dynamic administrative dashboard displaying real database users, user growth timeline charts, top destination distribution graphs, and user itinerary inspector.
*   **🌍 Community Feed & Trip Sharing**: Share unique trip links with friends, clone public itineraries, and engage with traveler community posts and comments.

---

## 🔑 Environment Configuration & API Keys

> [!IMPORTANT]
> ### ⚠️ AI Tour Planner API Key Setup
> If the 1-Click AI Tour Planner is not generating plans or if you encounter quota/rate limits, ensure your **Google Gemini API Key** is configured in your local environment.
>
> 1. Create a `.env` file in the root or `backend/` directory (or copy from `.env.example`):
>    ```bash
>    cp .env.example .env
>    ```
> 2. Add your Gemini API key:
>    ```env
>    GEMINI_API_KEY=your_gemini_api_key_here
>    ```
> *Note: GlobeTrotter includes an intelligent built-in fallback knowledge engine for major global and Indian destinations so demo and offline usage always functions gracefully.*

---

## 📂 Project Structure

```
/GlobeTrotter
  ├── /frontend
  │     ├── /src
  │     │    ├── /components    # TopNavBar, MobileBottomNavBar, FloatingActionButton
  │     │    ├── /pages         # Dashboard, CreateTrip, BuildItinerary, ItineraryDetails, AdminDashboard...
  │     │    ├── /services      # Axios API configuration & destination datasets
  │     │    ├── /context       # Central AppContext state provider
  │     │    ├── /types         # TypeScript interfaces
  │     │    └── main.tsx
  │     ├── tsconfig.json
  │     ├── vite.config.ts
  │     └── package.json
  │
  ├── /backend
  │     ├── /app
  │     │    ├── /api           # FastAPI routers (auth, trips, stops, ai_planner, admin, budget...)
  │     │    ├── /core          # App settings, security, and JWT authentication
  │     │    ├── /database      # SQLAlchemy connection handlers
  │     │    ├── /models        # Relational database models
  │     │    ├── /schemas       # Pydantic validation schemas
  │     │    └── /services      # Gemini 2.0 Flash AI planner & database seeders
  │     ├── main.py
  │     └── requirements.txt
  │
  ├── .github/workflows/ci.yml   # Automated CI testing and build verification
  ├── .env.example
  └── README.md
```

---

## 🗄️ Database Architecture (SQLAlchemy)

*   **Users**: Credential management with hashed passwords and role control (`user`, `admin`).
*   **UserProfiles**: Bio, avatar, visited countries counter, language, and saved destinations.
*   **Trips**: Trip titles, destinations, start/end dates, total budget, travelers count, and share tokens.
*   **Stops**: Day-by-day itinerary stops chronologically linked to dates and cities.
*   **Activities & TripActivities**: Specific scheduled attractions, timings, costs, locations, and notes.
*   **BudgetItems**: Categorized expenses (lodging, transit, dining, activities, other).
*   **CommunityPosts & Comments**: Traveler feed discussions, images, and likes.

---

## 🚀 Getting Started

### Prerequisites
*   **Python 3.10+**
*   **Node.js 18+** / **npm**

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```
*   The backend starts at `http://127.0.0.1:8000`.
*   Interactive API Swagger documentation is available at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*   The Vite frontend development server starts at `http://127.0.0.1:5173`.

---

## 👥 Hackathon Test Accounts

You can test user and administrator roles immediately with pre-seeded accounts:

| Role | Email | Password | Features |
| :--- | :--- | :--- | :--- |
| **Standard Traveler** | `alex@globetrotter.com` | `password123` | Create, AI auto-plan, edit itineraries, track budgets |
| **Administrator** | `admin@globetrotter.com` | `adminpwd` | Access live Admin Portal, view all users & platform analytics |
