# PromoteHub — Promotional & Marketing Campaign Management Platform

PromoteHub is a production-ready, full-stack promotional platform engineered for creators, brands, and marketing teams to plan, launch, manage, and scale marketing promotions, coupon deals, and promotional campaigns with enterprise-grade data isolation.

---

## Table of Contents
1. [Platform Overview & Key Features](#platform-overview--key-features)
2. [Technology Stack](#technology-stack)
3. [Architecture & Design Decisions](#architecture--design-decisions)
4. [Project Folder Structure](#project-folder-structure)
5. [Database Schema (MongoDB Atlas)](#database-schema-mongodb-atlas)
6. [API Specification & Endpoints](#api-specification--endpoints)
7. [Authentication Strategy (HttpOnly Cookies vs. localStorage)](#authentication-strategy)
8. [Security Hardening](#security-hardening)
9. [Prerequisites & Environment Variables](#prerequisites--environment-variables)
10. [Local Development Setup](#local-development-setup)
11. [Running Tests & Database Seeder](#running-tests--database-seeder)
12. [Production Deployment Guide](#production-deployment-guide)
13. [Future Scalability Roadmap](#future-scalability-roadmap)

---

## Platform Overview & Key Features

* **Full Authentication Lifecycle**: Secure user registration, credential login, password hashing via `bcryptjs`, and session management via secure `HttpOnly` JWT cookies and Bearer fallback.
* **Campaign Management (CRUD)**:
  * Create high-impact campaigns with rich descriptions, discount codes, coupon instructions, and live banner image preview.
  * Update, pause, or complete campaigns in real time.
  * Delete campaigns with strict double-confirmation modals.
* **Public Marketplace**:
  * Real-time search by keywords, offers, and titles with debouncing.
  * Category quick-filtering across 10 industry sectors.
  * Detailed campaign viewing with one-click offer copy-to-clipboard.
* **Executive Dashboard**:
  * Real-time KPI metric cards (Total, Active, Drafts, Completed).
  * Fast-action campaign launcher and recent campaigns summary table.
  * Active engagement ratio and future-ready metrics foundation.
* **Promoter Profile & Security**:
  * Customizable promoter bio, company name, and avatar.
  * Password changing with strict current-password validation.

---

## Technology Stack

### Frontend
* **React 18**: Modular functional components, hooks, and clean lifecycle management.
* **Vite**: Rapid Hot Module Replacement (HMR) and optimized rollup production bundles.
* **Tailwind CSS**: Modern SaaS aesthetic, responsive design system, and custom brand tokens.
* **React Router v6**: Client-side layout routing, route protection, and parameter mapping.
* **Axios**: Centralized HTTP client configured with `withCredentials: true` and response interceptors.
* **Lucide React**: Clean, accessible iconography.

### Backend
* **Node.js & Express.js**: Asynchronous REST API following layered architecture: `Routes -> Validators -> Middleware -> Controllers -> Services -> Models`.
* **MongoDB Atlas & Mongoose**: Cloud document database with strict schema validation, compound indexes, text indexes, and populate virtuals.
* **JWT & bcryptjs**: Cryptographic token signing and salting (12 rounds).
* **Security Suite**: `helmet`, `cors`, `express-rate-limit`, `cookie-parser`, `express-validator`, and NoSQL query sanitization.

---

## Architecture & Design Decisions

```
+-------------------------------------------------------------+
|              React 18 + Vite (Tailwind CSS)                |
|  AuthContext | CampaignMarketplace | Dashboard | Forms     |
+------------------------------+------------------------------+
                               |
                   HTTP + HttpOnly Cookies (withCredentials)
                               |
+------------------------------v------------------------------+
|                    Express.js REST API                      |
|  Helmet | CORS | RateLimiter | NoSQLSanitizer | AuthGuard   |
+------------------------------+------------------------------+
                               |
              Layered Separation of Concerns
       Controllers  --->  Services  --->  Mongoose Models
                               |
+------------------------------v------------------------------+
|                 MongoDB Atlas Cloud Cluster                |
|      Users Collection       |     Campaigns Collection      |
+-------------------------------------------------------------+
```

---

## Project Folder Structure

```
promotehub/
├── package.json                   # Root orchestrator script
├── .gitignore
├── README.md                      # Platform documentation
│
├── server/                        # Express Backend Application
│   ├── package.json
│   ├── .env.example
│   ├── .env                       # Local secrets (MongoDB Atlas URI, JWT Secret)
│   ├── server.js                  # Entry point & connection bootstrap
│   ├── tests/
│   │   └── apiSmokeTest.js        # Automated integration & IDOR test suite
│   └── src/
│       ├── app.js                 # Express app initialization & middleware
│       ├── config/
│       │   └── db.js              # MongoDB Atlas Mongoose connection pool
│       ├── constants/
│       │   └── campaignConstants.js # Categories and status enums
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── userController.js
│       │   └── campaignController.js
│       ├── middleware/
│       │   ├── authMiddleware.js  # JWT cookie/Bearer verification & user attachment
│       │   ├── errorMiddleware.js # Centralized 404 & error handlers
│       │   └── rateLimiter.js     # Rate limiting guards
│       ├── models/
│       │   ├── User.js            # User schema & bcrypt pre-save hooks
│       │   └── Campaign.js        # Campaign schema, compound indexes & text search
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── userRoutes.js
│       │   └── campaignRoutes.js
│       ├── services/
│       │   ├── authService.js
│       │   ├── userService.js
│       │   └── campaignService.js
│       ├── utils/
│       │   ├── apiResponse.js     # Standardized JSON response helper
│       │   ├── generateToken.js   # JWT signing & HttpOnly cookie configuration
│       │   ├── logger.js          # Structured console logger
│       │   └── seedData.js        # Database seeder with sample campaigns
│       └── validators/
│           ├── authValidator.js
│           ├── userValidator.js
│           └── campaignValidator.js
│
└── client/                        # React 18 + Vite Frontend Application
    ├── package.json
    ├── vite.config.js             # Dev server & /api proxy configuration
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── components/
        │   ├── common/            # Button, Input, Select, Textarea, Card, Modal, etc.
        │   ├── layout/            # Navbar, Footer
        │   ├── campaigns/         # CampaignCard, CampaignForm, CampaignFilters, StatusBadge
        │   └── dashboard/         # StatCard, RecentCampaignsList
        ├── context/
        │   └── AuthContext.jsx    # Session restoration & state management
        ├── hooks/
        │   ├── useAuth.js
        │   └── useDebounce.js
        ├── pages/
        │   ├── HomePage.jsx
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── CampaignsListPage.jsx
        │   ├── CampaignDetailPage.jsx
        │   ├── DashboardPage.jsx
        │   ├── MyCampaignsPage.jsx
        │   ├── CreateCampaignPage.jsx
        │   ├── EditCampaignPage.jsx
        │   ├── ProfilePage.jsx
        │   └── NotFoundPage.jsx
        ├── routes/
        │   ├── AppRoutes.jsx
        │   └── ProtectedRoute.jsx
        └── services/
            ├── api.js             # Central Axios instance with credentials
            ├── authService.js
            ├── userService.js
            └── campaignService.js
```

---

## Database Schema (MongoDB Atlas)

### User Collection
* `name`: String (2-60 chars, required)
* `email`: String (unique index, lowercase, validated email format)
* `password`: String (bcrypt hashed, `select: false` by default)
* `role`: String (enum: `['user', 'admin']`, default: `'user'`)
* `avatar`: String (URL)
* `bio`: String (max 250 chars)
* `company`: String (max 100 chars)
* `createdAt`, `updatedAt`: Timestamps

### Campaign Collection
* `title`: String (3-120 chars, text indexed)
* `description`: String (10-2000 chars, text indexed)
* `promotionalContent`: String (promo codes, terms, redeem links, text indexed)
* `imageUrl`: String (valid URL)
* `category`: String (enum: 10 categories, indexed)
* `targetAudience`: String (max 150 chars)
* `startDate`, `endDate`: Dates (validated: `endDate > startDate`)
* `status`: String (enum: `['draft', 'active', 'paused', 'completed']`, indexed)
* `budget`: Number (non-negative)
* `user`: ObjectId (ref: `'User'`, required, indexed)
* `createdAt`, `updatedAt`: Timestamps

**Indexes for High Performance**:
* `{ user: 1, status: 1 }`: Fast user dashboard lookups and status aggregation.
* `{ status: 1, createdAt: -1 }`: Fast public feed pagination.
* Full-text search index on `{ title, description, promotionalContent }`.

---

## API Specification & Endpoints

All responses follow a uniform JSON envelope:
```json
// Success
{ "success": true, "message": "...", "data": { ... } }

// Error
{ "success": false, "message": "...", "errors": [ ... ] }
```

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register user, issue HttpOnly cookie, return profile.
* `POST /api/auth/login` — Verify credentials, issue HttpOnly cookie.
* `POST /api/auth/logout` — Clear session cookie.
* `GET /api/auth/me` — Verify session and return currently authenticated user.

### User Profile (`/api/users`)
* `GET /api/users/profile` — Get user profile and campaign count statistics.
* `PUT /api/users/profile` — Update profile details (`name`, `avatar`, `bio`, `company`).
* `PUT /api/users/change-password` — Change password with current password verification.

### Campaigns (`/api/campaigns`)
* `GET /api/campaigns` — Browse active campaigns with search, category filtering, and pagination.
* `GET /api/campaigns/:id` — View campaign details (drafts restricted to creator).
* `GET /api/campaigns/user/my` — Get logged-in user's campaigns with status filtering.
* `GET /api/campaigns/user/stats` — Get aggregate counts (`total`, `active`, `draft`, `paused`, `completed`) and recent campaigns.
* `POST /api/campaigns` — Create a new campaign (creator stamped to `req.user._id`).
* `PUT /api/campaigns/:id` — Update a campaign (strictly owner-authorized).
* `DELETE /api/campaigns/:id` — Delete a campaign (strictly owner-authorized).

---

## Authentication Strategy

### Why HttpOnly Cookies over localStorage?
* **XSS Vulnerability in `localStorage`**: Tokens saved in `localStorage` can be read and exfiltrated by any arbitrary JavaScript executing in the browser (e.g. through compromised npm packages or XSS vulnerabilities).
* **HttpOnly Cookie Security**: When the browser receives `Set-Cookie: token=...; HttpOnly; SameSite=Lax; Secure`, JavaScript code is physically prevented from accessing the cookie. The browser automatically attaches the cookie to requests made to the API.
* **Production Decision**: We use **HttpOnly cookies** for all web browser operations. The backend also supports `Authorization: Bearer <token>` headers as a fallback for API testing clients and integration testing.

---

## Security Hardening

1. **IDOR Defense**: All campaign modifications and deletions enforce that `campaign.user.toString() === req.user._id.toString()`. Requests from unauthorized users are rejected with `403 Forbidden`.
2. **Brute-Force Rate Limiting**: `express-rate-limit` limits authentication attempts to 30 requests per 15 minutes per IP.
3. **NoSQL Query Injection Prevention**: Sanitization middleware deletes any keys starting with `$` or containing `.`.
4. **Helmet Headers**: Configured with Content Security Policy, X-Frame-Options (`DENY`), and MIME protection.
5. **CORS Whitelisting**: Strict origin matching against `CLIENT_URL`.

---

## Prerequisites & Environment Variables

### Prerequisites
* Node.js v18+ (tested on Node v25)
* npm v9+
* Active MongoDB Atlas Cluster or local MongoDB instance

### Backend Environment Configuration (`server/.env`)
```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.i6ljxqd.mongodb.net/promotehub?retryWrites=true&w=majority
JWT_SECRET=your_long_secure_jwt_secret_key_minimum_32_characters
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

---

## Local Development Setup

1. **Clone & Install Dependencies**:
   ```bash
   cd promotehub
   npm run install:all
   ```

2. **Configure Environment Secrets**:
   Copy `server/.env.example` to `server/.env` and update `MONGODB_URI` and `JWT_SECRET`.

3. **Seed Initial Sample Data (Optional but Recommended)**:
   ```bash
   cd server
   npm run seed
   ```
   *Seeds demo account:* `alex.morgan@promotehub.com` / `Password123!` with 6 rich campaigns across Technology, E-commerce, Healthcare, Fashion, Finance, and Food.

4. **Run Both Backend & Frontend Simultaneously**:
   From root directory:
   ```bash
   npm run dev
   ```
   * Or run independently:
     * Backend: `npm run server` (runs on `http://localhost:5000`)
     * Frontend: `npm run client` (runs on `http://localhost:5173`)

---

## Running Tests & Database Seeder

### Run Backend Integration & IDOR Security Tests
```bash
cd server
npm test
```
The test suite performs 13 automated tests:
1. MongoDB Atlas connectivity check
2. Health check endpoint `/api/health`
3. User registration
4. Duplicate email prevention (rejects with 400)
5. User login and JWT generation
6. Session verification via `/api/auth/me`
7. Campaign creation
8. Single campaign retrieval by ID
9. Public campaign feed & category filtering
10. Dashboard stats aggregation
11. Campaign update
12. **IDOR security barrier check (unauthorized user modification rejected with 403)**
13. Campaign deletion & resource cleanup

### Run Frontend Production Build Check
```bash
cd client
npm run build
```
Compiles and validates all JSX, components, and Tailwind directives into `dist/`.

---

## Production Deployment Guide

### Backend Deployment (e.g. Render, Railway, AWS ECS)
1. Set `NODE_ENV=production`.
2. Configure environment variables in host provider dashboard (`PORT`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`).
3. Build command: `npm install --omit=dev`.
4. Start command: `node server.js`.

### Frontend Deployment (e.g. Vercel, Netlify, Cloudflare Pages)
1. Framework Preset: **Vite**.
2. Root Directory: `client`.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Set environment variable: `VITE_API_URL=https://api.yourdomain.com/api`.
6. Add SPA rewrite rule (`/* -> /index.html 200`).

---

## Future Scalability Roadmap

The platform has been deliberately structured to support rapid scaling:
* **Analytics & Tracking**: Campaign schema is indexed and ready for click/impression event streams.
* **Subscriptions & Payments**: User schema includes role/metadata ready for Stripe webhook integration.
* **Media Uploads**: `imageUrl` input easily switches to Cloudinary or AWS S3 presigned upload middleware.
* **AI Campaign Copy Generation**: Service layer is isolated to allow direct integration with Gemini or OpenAI models to generate campaign titles and promotional copy on demand.
