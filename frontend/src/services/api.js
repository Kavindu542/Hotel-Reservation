const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to get headers with auth token
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// API response handler
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  
  return data;
};

// Auth API calls
export const authAPI = {
  // User registration
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // User login
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  // Get user profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },
};

// Hotels API calls
export const hotelsAPI = {
  // Get all hotels with pagination and filters
  getHotels: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    if (params.city) queryParams.append('city', params.city);
    if (params.min_price) queryParams.append('min_price', params.min_price);
    if (params.max_price) queryParams.append('max_price', params.max_price);
    if (params.rating) queryParams.append('rating', params.rating);
    
    const url = `${API_BASE_URL}/hotels${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(false),
    });
    return handleResponse(response);
  },

  // Get hotel by ID
  getHotelById: async (hotelId) => {
    const response = await fetch(`${API_BASE_URL}/hotels/${hotelId}`, {
      method: 'GET',
      headers: getHeaders(false),
    });
    return handleResponse(response);
  },

  // Search hotels
  searchHotels: async (query) => {
    const response = await fetch(`${API_BASE_URL}/hotels/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: getHeaders(false),
    });
    return handleResponse(response);
  },

  // Check hotel availability
  checkAvailability: async (hotelId, checkIn, checkOut) => {
    const response = await fetch(
      `${API_BASE_URL}/hotels/${hotelId}/availability?check_in=${checkIn}&check_out=${checkOut}`,
      {
        method: 'GET',
        headers: getHeaders(false),
      }
    );
    return handleResponse(response);
  },

  // Admin: create hotel
  createHotel: async (hotelData) => {
    const response = await fetch(`${API_BASE_URL}/hotels`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(hotelData),
    });
    return handleResponse(response);
  },

  // Admin: update hotel
  updateHotel: async (hotelId, updateData) => {
    const response = await fetch(`${API_BASE_URL}/hotels/${hotelId}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(updateData),
    });
    return handleResponse(response);
  },

  // Admin: delete hotel
  deleteHotel: async (hotelId) => {
    const response = await fetch(`${API_BASE_URL}/hotels/${hotelId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },
};

// Bookings API calls
export const bookingsAPI = {
  // Create new booking
  createBooking: async (bookingData) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(bookingData),
    });
    return handleResponse(response);
  },

  // Get user bookings
  getUserBookings: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    if (params.status) queryParams.append('status', params.status);
    
    const url = `${API_BASE_URL}/bookings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  // Get booking by ID
  getBookingById: async (bookingId) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  // Update booking
  updateBooking: async (bookingId, updateData) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(updateData),
    });
    return handleResponse(response);
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },
};

// Health check API
export const healthAPI = {
  checkHealth: async () => {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: getHeaders(false),
    });
    return handleResponse(response);
  },
};

export default {
  auth: authAPI,
  hotels: hotelsAPI,
  bookings: bookingsAPI,
  health: healthAPI,
};

