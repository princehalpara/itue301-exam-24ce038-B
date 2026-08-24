import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, CalendarCheck, Shield, LogOut, User, LogIn } from 'lucide-react';

export const Navbar = () => {
  const { member, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to={isAuthenticated ? '/classes' : '/'} className="brand-logo">
          <Dumbbell className="brand-badge" size={28} />
          <span>Fit<span className="brand-badge">Zone</span></span>
        </Link>

        {/* Navigation Links */}
        <nav>
          <ul className="nav-links">
            {isAuthenticated ? (
              <>
                <li>
                  <NavLink
                    to="/classes"
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  >
                    <Dumbbell size={18} />
                    <span>Trainers & Classes</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/my-bookings"
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  >
                    <CalendarCheck size={18} />
                    <span>My Bookings</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  >
                    <Shield size={18} />
                    <span>Admin</span>
                  </NavLink>
                </li>
              </>
            ) : (
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* User Info / Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated && member ? (
            <>
              <div className="user-profile-badge">
                <User size={16} color="var(--accent-emerald)" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{member.name}</span>
                <span className={`tier-pill tier-${member.membershipType || 'basic'}`}>
                  {member.membershipType || 'basic'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.8rem', fontSize: '0.85rem' }}
                title="Log out"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/" className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
