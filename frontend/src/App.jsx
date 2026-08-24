import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Page Imports
import LoginPage from './pages/LoginPage';
import ClassesPage from './pages/ClassesPage';
import MyBookingsPage from './pages/MyBookingsPage';

// Task 2: Lazy loading AdminPage using React.lazy and Suspense
const AdminPage = lazy(() => import('./pages/AdminPage'));

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />

          <main className="main-content">
            <Suspense
              fallback={
                <div className="loading-container" style={{ minHeight: '50vh' }}>
                  <div className="spinner"></div>
                  <p>Loading view...</p>
                </div>
              }
            >
              <Routes>
                {/* Public Route: Login */}
                <Route path="/" element={<LoginPage />} />

                {/* Protected Route: Classes & Trainers */}
                <Route
                  path="/classes"
                  element={
                    <ProtectedRoute>
                      <ClassesPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Route: My Bookings */}
                <Route
                  path="/my-bookings"
                  element={
                    <ProtectedRoute>
                      <MyBookingsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Route: Admin Page (Lazy Loaded with React.lazy and Suspense) */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all fallback redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>

          {/* Footer */}
          <footer className="footer">
            <div className="footer-inner">
              <div>
                <strong>FitZone Gym & Class Booking System</strong> &bull; ITUE301 AWDF Practical Exam
              </div>
              <div>
                Student ID: <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>24CE038</span> &bull; Batch: <span style={{ color: 'var(--accent-teal)', fontWeight: 700 }}>B</span>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
