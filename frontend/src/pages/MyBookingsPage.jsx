import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CalendarCheck, Calendar, Clock, User, Award, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * MyBookingsPage Component
 * Fulfills TASK 1, 2, 3, 5:
 * - GET /api/v1/bookings/my (populated memberId and trainerId)
 * - Status display for 'booked', 'attended', 'cancelled'
 * - PATCH /api/v1/bookings/:id/status to manage booking status
 */
export const MyBookingsPage = () => {
  const { member } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch bookings for the logged-in member
  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getMyBookings();
      if (res.success && Array.isArray(res.data)) {
        setBookings(res.data);
      } else {
        setBookings([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch personal bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  // Update status (e.g. Cancel or Mark Attended) -> PATCH /api/v1/bookings/:id/status
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setUpdatingId(bookingId);
      setActionMessage(null);

      const res = await api.updateBookingStatus(bookingId, newStatus);
      if (res.success) {
        setActionMessage({
          type: 'success',
          text: `Booking successfully marked as ${newStatus}!`,
        });

        // Update booking in local state
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? res.data : b))
        );

        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err.message || 'Failed to update booking status.',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.25)', borderRadius: 'var(--radius-full)', marginBottom: '0.75rem' }}>
            <CalendarCheck size={15} color="var(--accent-teal)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Personal Schedule
            </span>
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>My Class Bookings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Manage your booked workout sessions, check trainer assignments, and update attendance status.
          </p>
        </div>

        <button
          onClick={fetchMyBookings}
          className="btn btn-secondary"
          disabled={loading}
          style={{ gap: '0.5rem' }}
        >
          <RefreshCw size={16} className={loading ? 'spinner' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Action Alerts */}
      {actionMessage && (
        <div className={`alert alert-${actionMessage.type}`}>
          {actionMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your personal workout schedule...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <div>
            <strong>Error Loading Bookings:</strong> {error}
          </div>
        </div>
      )}

      {/* Bookings Display */}
      {!loading && !error && (
        <>
          {bookings.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <Calendar size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
              <h3>No Bookings Found</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', maxWidth: '500px', margin: '0.5rem auto 1.5rem' }}>
                You haven't reserved any fitness classes yet. Explore our certified trainers and book your first session today!
              </p>
              <Link to="/classes" className="btn btn-primary">
                Browse Classes & Trainers
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {bookings.map((booking) => {
                const trainer = booking.trainerId;
                const bookingMember = booking.memberId;
                const isCancelled = booking.status === 'cancelled';
                const isAttended = booking.status === 'attended';
                const isBooked = booking.status === 'booked';

                return (
                  <div
                    key={booking._id}
                    className="glass-card"
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1.5rem',
                      opacity: isCancelled ? 0.65 : 1,
                      borderLeft: isBooked
                        ? '4px solid var(--accent-emerald)'
                        : isAttended
                        ? '4px solid var(--accent-teal)'
                        : '4px solid var(--accent-rose)',
                    }}
                  >
                    {/* Left: Trainer & Session Info */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                      <div
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: 'var(--radius-md)',
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--accent-emerald)',
                          fontWeight: 700,
                          fontSize: '1.25rem',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                        }}
                      >
                        {trainer?.name ? trainer.name.charAt(0) : 'T'}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                          <h3 style={{ fontSize: '1.25rem' }}>
                            {trainer?.name || 'Assigned Fitness Coach'}
                          </h3>
                          {/* Populated Trainer Specialization */}
                          <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.1)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                            {trainer?.specialization || 'General Training'}
                          </span>
                        </div>

                        {/* Date & Time Slot */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Calendar size={15} color="var(--accent-emerald)" />
                            {booking.date}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Clock size={15} color="var(--accent-teal)" />
                            {booking.timeSlot}
                          </span>
                        </div>

                        {/* Populated Member details */}
                        <div style={{ marginTop: '0.5rem', fontSize: '0.825rem', color: 'var(--text-dim)' }}>
                          <span>Booked for: <strong>{bookingMember?.name || member?.name}</strong> ({bookingMember?.email || member?.email})</span>
                          {booking.notes && (
                            <span style={{ display: 'block', fontStyle: 'italic', marginTop: '0.2rem' }}>
                              Notes: "{booking.notes}"
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Status Badge & Action Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {/* Status Badge */}
                      <span className={`status-badge status-${booking.status}`}>
                        {booking.status === 'attended' && <CheckCircle2 size={14} />}
                        {booking.status === 'cancelled' && <XCircle size={14} />}
                        {booking.status === 'booked' && <Clock size={14} />}
                        {booking.status}
                      </span>

                      {/* Status Action Buttons (PATCH /api/v1/bookings/:id/status) */}
                      {isBooked && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleStatusChange(booking._id, 'attended')}
                            disabled={updatingId === booking._id}
                            className="btn btn-secondary"
                            style={{ padding: '0.45rem 0.8rem', fontSize: '0.825rem', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#34d399' }}
                            title="Mark as Attended"
                          >
                            Mark Attended
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking._id, 'cancelled')}
                            disabled={updatingId === booking._id}
                            className="btn btn-danger"
                            style={{ padding: '0.45rem 0.8rem', fontSize: '0.825rem' }}
                            title="Cancel Booking"
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      {isCancelled && (
                        <button
                          onClick={() => handleStatusChange(booking._id, 'booked')}
                          disabled={updatingId === booking._id}
                          className="btn btn-secondary"
                          style={{ padding: '0.45rem 0.8rem', fontSize: '0.825rem' }}
                        >
                          Re-Book
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyBookingsPage;
