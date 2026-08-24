import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Shield, Users, Calendar, Dumbbell, AlertCircle, CheckCircle2, XCircle, Clock } from 'lucide-react';

/**
 * AdminPage Component
 * Lazy loaded using React.lazy and Suspense
 * Provides administrative overview of all bookings and system data
 */
export const AdminPage = () => {
  const [bookings, setBookings] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [bookingsRes, trainersRes] = await Promise.all([
          api.getAllBookings(),
          api.getTrainers(),
        ]);

        if (bookingsRes.success) setBookings(bookingsRes.data || []);
        if (trainersRes.success) setTrainers(trainersRes.data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch admin statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await api.updateBookingStatus(id, newStatus);
      if (res.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? res.data : b))
        );
      }
    } catch (err) {
      alert(err.message || 'Error updating status');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'all') return true;
    return b.status === statusFilter;
  });

  const bookedCount = bookings.filter((b) => b.status === 'booked').length;
  const attendedCount = bookings.filter((b) => b.status === 'attended').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: 'var(--radius-full)', marginBottom: '0.75rem' }}>
          <Shield size={15} color="var(--accent-purple)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            System Administration
          </span>
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          FitZone Gym Control Center
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          (Lazy Loaded via React.lazy & Suspense) Comprehensive gym operations, booking rosters, and trainer load.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Total Bookings</span>
            <Calendar size={18} color="var(--accent-teal)" />
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: '#fff' }}>{bookings.length}</p>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Confirmed / Active</span>
            <Clock size={18} color="var(--accent-cyan)" />
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: '#38bdf8' }}>{bookedCount}</p>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Completed Sessions</span>
            <CheckCircle2 size={18} color="var(--accent-emerald)" />
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--accent-emerald)' }}>{attendedCount}</p>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Total Trainers</span>
            <Dumbbell size={18} color="var(--accent-purple)" />
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: '#c084fc' }}>{trainers.length}</p>
        </div>
      </div>

      {/* Loading & Error */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading administrative dashboard data...</p>
        </div>
      )}

      {!loading && error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* All Bookings Table */}
      {!loading && !error && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.35rem' }}>All Member Class Bookings</h2>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['all', 'booked', 'attended', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.8rem',
                    textTransform: 'capitalize',
                    background: statusFilter === status ? 'rgba(168, 85, 247, 0.2)' : undefined,
                    borderColor: statusFilter === status ? 'var(--accent-purple)' : undefined,
                    color: statusFilter === status ? '#c084fc' : undefined,
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Trainer</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No bookings matching status filter '{statusFilter}'
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b._id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.memberId?.name || 'Unknown Member'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                          {b.memberId?.email}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.trainerId?.name || 'Assigned Coach'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--accent-teal)' }}>
                          {b.trainerId?.specialization}
                        </div>
                      </td>
                      <td>
                        <div>{b.date}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{b.timeSlot}</div>
                      </td>
                      <td>
                        <span className={`status-badge status-${b.status}`}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={b.status}
                          onChange={(e) => handleUpdateStatus(b._id, e.target.value)}
                          className="form-control"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', width: 'auto', minWidth: '110px' }}
                        >
                          <option value="booked">Booked</option>
                          <option value="attended">Attended</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
