const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

/**
 * Custom API client wrapper around standard fetch
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('fitzone_token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

// API methods
export const api = {
  // Auth
  login: (credentials) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getMe: () => apiRequest('/auth/me'),

  // Trainers
  getTrainers: () => apiRequest('/trainers'),

  // Bookings
  createBooking: (bookingData) =>
    apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),
  getMyBookings: () => apiRequest('/bookings/my'),
  updateBookingStatus: (id, status) =>
    apiRequest(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  getAllBookings: () => apiRequest('/bookings/all'),
};

export default api;
