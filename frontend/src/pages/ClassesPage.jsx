import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import TrainerCard from '../components/TrainerCard';
import { Search, Calendar, Clock, CheckCircle, AlertCircle, X, Dumbbell, Sparkles } from 'lucide-react';

/**
 * ClassesPage Component
 * Fulfills TASK 1, 2, 4, 5:
 * - GET /api/v1/trainers with useEffect, loading, error, and trainers state
 * - Renders TrainerCard for each trainer
 * - Client-side specialization search filter without additional API requests
 * - Booking form with meaningful state submitting POST /api/v1/bookings
 */
export const ClassesPage = () => {
  // --- Task 4 State Requirements ---
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Task 4 Client-Side Specialization Search State ---
  const [searchSpecialization, setSearchSpecialization] = useState('');

  // --- Task 2 & 5 Booking Form State ---
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTimeSlot, setBookingTimeSlot] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Available class time slots
  const timeSlots = [
    '06:30 AM - 07:30 AM (Early Bird Conditioning)',
    '08:00 AM - 09:00 AM (Morning Flow & Mobility)',
    '10:00 AM - 11:00 AM (Peak Performance Strength)',
    '01:00 PM - 02:00 PM (Mid-Day Power Express)',
    '05:00 PM - 06:00 PM (Evening Hypertrophy)',
    '06:30 PM - 07:30 PM (Sunset HIIT Circuit)',
    '08:00 PM - 09:00 PM (Night Core & Flexibility)',
  ];

  // Fetch trainers from API on component mount
  useEffect(() => {
    let isMounted = true;

    const fetchTrainers = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.getTrainers();
        if (isMounted) {
          if (res.success && Array.isArray(res.data)) {
            setTrainers(res.data);
          } else {
            setTrainers([]);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load fitness trainers. Please check backend connection.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTrainers();

    return () => {
      isMounted = false;
    };
  }, []);

  // --- Task 4: Client-side specialization search on already fetched data ---
  // NOTE: This search filtering operates purely in-memory on `trainers` without making new API calls!
  const filteredTrainers = trainers.filter((trainer) => {
    if (!searchSpecialization.trim()) return true;
    const query = searchSpecialization.toLowerCase().trim();
    const specMatches = trainer.specialization?.toLowerCase().includes(query);
    const nameMatches = trainer.name?.toLowerCase().includes(query);
    return specMatches || nameMatches;
  });

  // Open booking modal for a specific trainer
  const handleOpenBooking = (trainer) => {
    setSelectedTrainer(trainer);
    setBookingDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]); // Tomorrow's date default
    setBookingTimeSlot(timeSlots[0]);
    setBookingError('');
    setBookingSuccess('');
    setIsModalOpen(true);
  };

  // Submit booking form -> POST /api/v1/bookings
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTrainer || !bookingDate || !bookingTimeSlot) {
      setBookingError('Please fill in all required booking fields.');
      return;
    }

    try {
      setBookingSubmitting(true);
      setBookingError('');
      setBookingSuccess('');

      const response = await api.createBooking({
        trainerId: selectedTrainer._id,
        date: bookingDate,
        timeSlot: bookingTimeSlot,
        notes: bookingNotes,
      });

      if (response.success) {
        setBookingSuccess(`Class successfully booked with ${selectedTrainer.name} on ${bookingDate}!`);
        setTimeout(() => {
          setIsModalOpen(false);
          setBookingSuccess('');
          setBookingNotes('');
        }, 1800);
      }
    } catch (err) {
      setBookingError(err.message || 'Failed to complete booking. Please try again.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero / Header Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-full)', marginBottom: '0.75rem' }}>
          <Sparkles size={15} color="var(--accent-emerald)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-emerald)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Expert Fitness Mentors
          </span>
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Gym Classes & Certified Trainers
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '680px' }}>
          Explore our certified trainers, filter by fitness specialization, and book your personalized training sessions with instant confirmation.
        </p>
      </div>

      {/* Specialization Search Filter Bar (TASK 4 Client-side requirement) */}
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.25rem 1.75rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem' }}>
        <div className="search-container">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by specialization (e.g. Yoga, HIIT, Strength)..."
            value={searchSpecialization}
            onChange={(e) => setSearchSpecialization(e.target.value)}
            id="specialization-search-input"
          />
        </div>

        {/* Quick Filter Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.825rem', color: 'var(--text-dim)', fontWeight: 600 }}>Quick Filter:</span>
          {['All', 'Strength', 'Yoga', 'HIIT', 'Pilates', 'Bodybuilding'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSearchSpecialization(tag === 'All' ? '' : tag)}
              className="btn btn-secondary"
              style={{
                padding: '0.3rem 0.75rem',
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor:
                  (tag === 'All' && !searchSpecialization) ||
                  searchSpecialization.toLowerCase() === tag.toLowerCase()
                    ? 'rgba(16, 185, 129, 0.2)'
                    : undefined,
                borderColor:
                  (tag === 'All' && !searchSpecialization) ||
                  searchSpecialization.toLowerCase() === tag.toLowerCase()
                    ? 'var(--accent-emerald)'
                    : undefined,
                color:
                  (tag === 'All' && !searchSpecialization) ||
                  searchSpecialization.toLowerCase() === tag.toLowerCase()
                    ? '#34d399'
                    : undefined,
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Fetching certified fitness trainers from FitZone database...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <div>
            <strong>Error Loading Trainers:</strong> {error}
          </div>
        </div>
      )}

      {/* Trainers Grid Display (TASK 1 & TASK 4) */}
      {!loading && !error && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Showing {filteredTrainers.length} of {trainers.length} trainers
              {searchSpecialization && ` for specialization "${searchSpecialization}"`}
            </span>
          </div>

          {filteredTrainers.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <Dumbbell size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
              <h3>No Trainers Found</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                No trainers matched the specialization "{searchSpecialization}". Try a different keyword or reset filters.
              </p>
              <button
                onClick={() => setSearchSpecialization('')}
                className="btn btn-secondary"
                style={{ marginTop: '1.25rem' }}
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            <div className="trainers-grid">
              {filteredTrainers.map((trainer) => (
                <TrainerCard
                  key={trainer._id}
                  name={trainer.name}
                  specialization={trainer.specialization}
                  available={trainer.available}
                  experienceYears={trainer.experienceYears}
                  bio={trainer.bio}
                  avatar={trainer.avatar}
                  onBook={() => handleOpenBooking(trainer)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Booking Form Modal (TASK 2 & 5) */}
      {isModalOpen && selectedTrainer && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={22} color="var(--accent-emerald)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem' }}>Book Fitness Session</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>
                    Trainer: {selectedTrainer.name} ({selectedTrainer.specialization})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-secondary"
                style={{ padding: '0.4rem', borderRadius: '50%' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Alerts */}
            {bookingError && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <span>{bookingError}</span>
              </div>
            )}

            {bookingSuccess && (
              <div className="alert alert-success">
                <CheckCircle size={18} />
                <span>{bookingSuccess}</span>
              </div>
            )}

            {/* Booking Form */}
            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="booking-date">
                  Select Class Date <span style={{ color: 'var(--accent-rose)' }}>*</span>
                </label>
                <input
                  id="booking-date"
                  type="date"
                  className="form-control"
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="booking-time-slot">
                  Select Time Slot <span style={{ color: 'var(--accent-rose)' }}>*</span>
                </label>
                <select
                  id="booking-time-slot"
                  className="form-control"
                  value={bookingTimeSlot}
                  onChange={(e) => setBookingTimeSlot(e.target.value)}
                  required
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="booking-notes">
                  Workout Goals / Health Notes (Optional)
                </label>
                <textarea
                  id="booking-notes"
                  className="form-control"
                  rows="3"
                  placeholder="e.g. Focus on shoulder rehabilitation, first time barbell training..."
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  disabled={bookingSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                  disabled={bookingSubmitting}
                >
                  {bookingSubmitting ? 'Confirming Booking...' : 'Confirm & Reserve Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesPage;
