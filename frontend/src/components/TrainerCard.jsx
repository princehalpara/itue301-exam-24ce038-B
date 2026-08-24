import React from 'react';
import { Award, Calendar, CheckCircle2, XCircle } from 'lucide-react';

/**
 * TrainerCard Component
 * Fulfills TASK 1 requirements:
 * - Accepts `name`, `specialization`, `available` as props
 * - Displays availability strictly as "Available" / "Fully Booked"
 */
export const TrainerCard = ({
  name,
  specialization,
  available,
  experienceYears,
  bio,
  avatar,
  onBook,
}) => {
  return (
    <div className="trainer-card">
      <div>
        {/* Header */}
        <div className="trainer-header">
          {avatar ? (
            <img src={avatar} alt={name} className="trainer-avatar" />
          ) : (
            <div className="trainer-avatar-placeholder">
              {name ? name.charAt(0).toUpperCase() : 'T'}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h3 className="trainer-name">{name}</h3>
            <span className="trainer-spec">{specialization}</span>
          </div>
        </div>

        {/* Details */}
        <div className="trainer-body">
          {bio && <p className="trainer-bio">{bio}</p>}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem' }}>
            {experienceYears && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Award size={14} color="var(--accent-teal)" />
                {experienceYears} yrs experience
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Availability & Action */}
      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Availability Badge */}
        <span className={`availability-badge ${available ? 'available' : 'booked'}`}>
          <span className="availability-dot"></span>
          {available ? (
            <>
              <CheckCircle2 size={13} style={{ display: 'none' }} />
              Available
            </>
          ) : (
            <>
              <XCircle size={13} style={{ display: 'none' }} />
              Fully Booked
            </>
          )}
        </span>

        {/* Book Button */}
        {onBook && (
          <button
            onClick={onBook}
            disabled={!available}
            className="btn btn-primary"
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem' }}
          >
            <Calendar size={14} />
            <span>Book Class</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TrainerCard;
