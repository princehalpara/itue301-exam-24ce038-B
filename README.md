# FitZone Gym & Class Booking System

**ITUE301 Advanced Web Development Framework (AWDF) - Practical Exam Project**

---

## 📋 Student & Exam Details

- **Student ID**: `24CE038`
- **Batch / Set**: `B`
- **GitHub Username**: `princehalpara`
- **Repository Name**: `itue301-exam-24CE038-B`
- **Project Name**: FitZone Gym & Class Booking System

---

## 🚀 Project Overview

**FitZone** is a full-stack gym management and class booking web application built using the MERN stack (MongoDB, Express.js, React, Node.js). The application enables gym members to explore fitness trainers, book workout sessions, manage personal bookings, and view class availability in real-time.

---

## 🏗️ Architecture & Features Overview

### 1. Frontend (React + Vite)
- **LoginPage**: Member authentication with token persistence in `AuthContext`.
- **ClassesPage**: Fetches trainer data with loading/error states, client-side specialization search filter without additional API requests, and an interactive class booking form.
- **MyBookingsPage**: Displays member bookings with populated trainer details and status badges; allows status management (e.g., cancellation).
- **TrainerCard Component**: Reusable card displaying trainer details, accepting `name`, `specialization`, and `available` props, rendering availability strictly as `"Available"` or `"Fully Booked"`.
- **AdminPage**: Lazy-loaded using `React.lazy()` and `React.Suspense` for administrative overview of all bookings.
- **Routing & State**: Protected routes via `ProtectedRoute`, full client-side routing via `react-router-dom`, and global auth state via `AuthContext`.

### 2. Backend (Node.js + Express + Mongoose)
- **Global `requestLogger` Middleware**: Logs HTTP requests upon completion using `res.on('finish')`.
- **`authGuard` Middleware**: Validates incoming `Bearer <token>` headers, extracts the member payload, and attaches `req.member`.
- **Global Error Handler**: Standardizes error responses for validation, cast errors, duplicate keys, and authorization failures with appropriate HTTP status codes.
- **RESTful Endpoints**: Authentication, trainer listings, booking creation, member booking queries with Mongoose population, and booking status updates.

### 3. Database (MongoDB & Mongoose Models)
- **`Member`**: `name` (required), `email` (required & unique), `membershipType` (`'basic' | 'premium' | 'platinum'`, default: `'basic'`).
- **`Trainer`**: `name` (required), `specialization` (required), `available` (Boolean, default: `true`).
- **`ClassBooking`**: `memberId` (ref `Member`), `trainerId` (ref `Trainer`), `date` (required), `timeSlot` (required), `status` (`'booked' | 'attended' | 'cancelled'`, default: `'booked'`).

---

## 📁 Project Structure

```
itue301-exam-24CE038-B/
├── .env.example
├── .gitignore
├── README.md
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── bookingController.js
│       │   └── trainerController.js
│       ├── middleware/
│       │   ├── authGuard.js
│       │   ├── errorHandler.js
│       │   └── requestLogger.js
│       ├── models/
│       │   ├── ClassBooking.js
│       │   ├── Member.js
│       │   └── Trainer.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── bookingRoutes.js
│       │   └── trainerRoutes.js
│       ├── seed/
│       │   └── seedData.js
│       └── server.js
└── frontend/
    ├── .env
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ProtectedRoute.jsx
        │   └── TrainerCard.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── AdminPage.jsx
        │   ├── ClassesPage.jsx
        │   ├── LoginPage.jsx
        │   └── MyBookingsPage.jsx
        └── services/
            └── api.js
```

---

## ⚙️ Environment Variables

### Backend Configuration (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/fitzone_db
JWT_SECRET=fitzone_jwt_secret_key_24CE038_exam
JWT_EXPIRE=7d
```

### Frontend Configuration (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

## 💾 MongoDB Setup

1. **Local MongoDB**:
   Ensure MongoDB Community Server is installed and running on default port `27017`:
   ```bash
   # Verify MongoDB is active
   mongosh --eval "db.version()"
   ```
2. **MongoDB Atlas (Cloud)**:
   If using Atlas, update `MONGODB_URI` in `backend/.env` with your connection string:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/fitzone_db?retryWrites=true&w=majority
   ```

---

## 🛠️ Installation & Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy .env.example to .env (if not already present)
cp .env.example .env

# (Optional) Seed the database with initial trainers and demo members
npm run seed

# Start the backend server in development mode
npm run dev
# OR for production
npm start
```
The backend will run on: **`http://localhost:5000`**

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy .env.example to .env (if not already present)
cp .env.example .env

# Start the Vite development server
npm run dev
```
The frontend will run on: **`http://localhost:5173`**

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Member login (returns JWT token and member profile) | No |
| `GET` | `/api/v1/trainers` | Retrieve all fitness trainers | No |
| `POST` | `/api/v1/bookings` | Create a new class booking for authenticated member | **Yes** (Bearer Token) |
| `GET` | `/api/v1/bookings/my` | Retrieve bookings for authenticated member (populated) | **Yes** (Bearer Token) |
| `PATCH` | `/api/v1/bookings/:id/status` | Update booking status (`booked`, `attended`, `cancelled`) | **Yes** (Bearer Token) |
| `GET` | `/api/v1/bookings/all` | Admin endpoint to view all system bookings | **Yes** (Bearer Token) |

---

## 🧪 Exam Task Verification Checklist

- [x] **Task 1: React Component Architecture**
  - `LoginPage`, `ClassesPage`, `MyBookingsPage` implemented.
  - `TrainerCard` accepting `name`, `specialization`, `available` props.
  - Availability displayed strictly as `"Available"` or `"Fully Booked"`.
- [x] **Task 2: React Routing & State**
  - `/`, `/classes` (protected), `/my-bookings` (protected).
  - `/admin` lazy-loaded with `React.lazy` and `Suspense`.
  - Navigation via React Router.
  - `AuthContext` with `member`, `token`, `login`, `logout`.
  - `ProtectedRoute` implementation.
  - `ClassesPage` booking form with structured state.
- [x] **Task 3: Express Backend**
  - All 5 required API endpoints implemented.
  - Global `requestLogger` with `res.on('finish')`.
  - `authGuard` verifying Bearer tokens and attaching `req.member`.
  - Global error handler with correct HTTP status codes.
- [x] **Task 4: React API Consumption**
  - `GET /api/v1/trainers` consumed in `useEffect`.
  - `trainers`, `loading`, and `error` states managed.
  - `TrainerCard` rendered from API response.
  - Specialization search performed client-side on fetched data without additional network requests.
- [x] **Task 5: MongoDB + Mongoose**
  - `Member` schema with `membershipType` enum (`basic`, `premium`, `platinum`).
  - `Trainer` schema with `name`, `specialization`, `available` (default `true`).
  - `ClassBooking` schema with refs, `timeSlot`, and `status` enum (`booked`, `attended`, `cancelled`).
  - MongoDB configured via `.env`.
  - Structured validation error responses.
  - `GET /api/v1/bookings/my` populates `memberId` (`name email`) and `trainerId` (`name specialization`).

---

## 👨‍💻 Author

**Prince Halpara**
- Student ID: `24CE038`
- Batch: `B`
- ITUE301 AWDF Practical Exam
