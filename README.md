# PocketSmart AI: AI-Powered Budget Planning & Smart Recommendation System

> **A GenAI-driven cross-platform recommendation system that delivers personalized, budget-based suggestions across Home Interiors, Event Planning, and Jewelry Selection with Indian market e-commerce integration.**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%2F%20Express-009688.svg)](https://fastapi.tiangolo.com)
[![Google Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini%201.5%20%2F%203.8%20Flash-4285F4.svg)](https://ai.google.dev/)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Tailwind%20CSS-61DAFB.svg)](https://react.dev/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

---

## 📌 Project Overview

Managing budgets across disparate lifestyle needs—such as interior renovations, celebration organizing, or occasion jewelry shopping—can be overwhelming due to wide price dispersions and fragmented shopping platforms. 

**PocketSmart AI** eliminates financial guesswork using Google Gemini multimodal AI. It dynamically allocates budgets in Indian Rupees (INR ₹), balances aesthetic preferences with financial constraints, and provides search links to popular platforms including **Amazon India, Flipkart, IKEA India, Swiggy, Zomato, BookMyShow, OYO, and Tanishq**.

---

## 🎯 Core Planning Scenarios

### 1. Home Interior Budget Planner
- **Inputs**: Total budget (INR ₹), fixture quantities (lights, ceiling fans, furniture pieces, dining tables), room selections (Living Room, Kitchen, Bedroom), and custom requirements.
- **Output**: Intelligent spending allocation, itemized breakdown tables, price percentages, money-saving advice, and direct search links to **IKEA India, Amazon, Flipkart, Myntra, and Ajio**.

### 2. AI Party & Event Planner
- **Inputs**: Total budget, guest count, party type (Birthday, Wedding Dinner, Anniversary, Corporate Mixer), venue type, and service toggles (Catering, Decoration, Entertainment).
- **Output**: Proportional budget distribution, venue suggestions with capacity limits, contingency buffer reserves, printable event plans, and vendor links to **Swiggy, Zomato, BookMyShow, Booking.com, MakeMyTrip, and OYO Rooms**.

### 3. Jewelry Budget Planner (Multimodal AI)
- **Inputs**: Total budget, occasion (Wedding, Festival, Birthday, Formal), style preferences, and **optional outfit photo upload**.
- **Output**: Multimodal Gemini vision analysis detecting outfit colors, style aesthetic, and formality; suggested jewelry items (chokers, earrings, kadas, rings, watches) within budget; styling tips; and shopping links to **Tanishq, CaratLane, BlueStone, Melorra, and Meesho**.

---

## 🏗️ System Architecture

```text
                               ┌──────────────────────────────────────────────┐
                               │             PocketSmart AI UI                │
                               │  (Responsive Web App / HTML / Jinja / React) │
                               └──────────────────────┬───────────────────────┘
                                                      │
                                                      │ HTTP / REST Endpoints
                                                      ▼
                               ┌──────────────────────────────────────────────┐
                               │           Backend Routing & Auth             │
                               │  FastAPI / Express Server (JWT Auth, Cookies)│
                               │  • /register   • /token      • /logout       │
                               │  • /session-info  • /session-data            │
                               │  • /home-budget   • /party-budget            │
                               │  • /jewelry-budget • /recommendation-history │
                               └───────────┬──────────────────────┬───────────┘
                                           │                      │
                   JSON Prompts & Images   │                      │ Search Query Strings
                                           ▼                      ▼
                     ┌───────────────────────────┐    ┌──────────────────────────────┐
                     │     Google Gemini AI      │    │  Connected Indian Platforms  │
                     │  (Gemini 1.5 / 3.8 Flash) │    │  • Amazon India  • Flipkart  │
                     │  • Multimodal Vision      │    │  • IKEA India    • Swiggy    │
                     │  • Dynamic INR Allocation │    │  • Zomato        • OYO       │
                     │  • Structured JSON Output │    │  • Tanishq       • CaratLane │
                     └───────────────────────────┘    └──────────────────────────────┘
```

---

## 📂 Repository Structure

```text
.
├── server.ts                  # Express/Vite full-stack backend running on port 3000
├── src/
│   ├── api.ts                 # Typed API client connecting to backend endpoints
│   ├── types.ts               # Data models (Budget inputs, results, history, users)
│   ├── App.tsx                # Master router & session handling
│   ├── components/
│   │   ├── Navbar.tsx         # Header navigation bar with auth controls
│   │   ├── Footer.tsx         # Multi-column footer with platform integrations
│   │   └── DetailModal.tsx    # Recommendation history detailed inspector
│   └── pages/
│       ├── LandingPage.tsx    # Showcase landing page with hero & testimonials
│       ├── LoginPage.tsx      # Dual Sign In / Get Started Free interface
│       ├── DashboardPage.tsx  # User dashboard with recent activity feed
│       ├── HomePlannerPage.tsx    # Home interior budgeting form & results
│       ├── PartyPlannerPage.tsx   # Party planning & venue suggestions
│       ├── JewelryPlannerPage.tsx # Multimodal outfit upload & jewelry styling
│       └── HistoryPage.tsx        # Color-coded recommendation history log
├── PocketSmart/               # Reference Python/FastAPI codebase
│   ├── app.py                 # FastAPI backend routes & Gemini integration
│   ├── gemini_utils.py        # Prompt orchestration & JSON parser
│   ├── requirements.txt       # Python package dependencies
│   └── templates/             # Jinja2 HTML templates
└── metadata.json              # Project capabilities & service configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Google Gemini API Key (`GEMINI_API_KEY`)

### Installation & Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/pocketsmart-ai.git
   cd pocketsmart-ai
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```

5. Open your browser at `http://localhost:3000`.

---

## 🔑 Demo Account Credentials

For quick evaluation, use the pre-configured demo account:
- **Username**: `sai`
- **Password**: `password123`
*(Or use the 1-click demo button directly on the Sign In page)*

---

## 🛡️ Key Features

- **Strict Session Security**: JWT authentication with automatic 30-minute background session cleanup.
- **Multimodal Visual Analysis**: Color and pattern extraction from uploaded apparel photos for jewelry matching.
- **Localized Cost Intelligence**: Structured INR (₹) estimates calibrated for Indian retail platforms.
- **Zero Mock Pre-login**: Always greets users with the Get Started / Sign In gateway upon entry.
