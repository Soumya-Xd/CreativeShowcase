const API_BASE_URL = 'http://localhost:5000/api';

// Auth token management
let authToken: string | null = localStorage.getItem('authToken');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => authToken;

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  register: async (userData: { username: string; email: string; password: string }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: { email: string; password: string }) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },
};

// Artworks API
export const artworksAPI = {
  getAll: async (page = 1, limit = 20) => {
    return apiRequest(`/artworks?page=${page}&limit=${limit}`);
  },

  getById: async (id: string) => {
    return apiRequest(`/artworks/${id}`);
  },

  create: async (formData: FormData) => {
    return apiRequest('/artworks', {
      method: 'POST',
      headers: {
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: formData,
    });
  },

  update: async (id: string, data: { title?: string; description?: string; tags?: string }) => {
    return apiRequest(`/artworks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/artworks/${id}`, {
      method: 'DELETE',
    });
  },

  like: async (id: string) => {
    return apiRequest(`/artworks/${id}/like`, {
      method: 'POST',
    });
  },

  getUserArtworks: async (userId: string) => {
    return apiRequest(`/artworks/user/${userId}`);
  },
};

// Users API
export const usersAPI = {
  getProfile: async (username: string) => {
    return apiRequest(`/users/profile/${username}`);
  },

  follow: async (userId: string) => {
    return apiRequest(`/users/${userId}/follow`, {
      method: 'POST',
    });
  },

  updateProfile: async (data: { username?: string; bio?: string; avatar_url?: string }) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getFollowers: async () => {
    return apiRequest('/users/followers');
  },

  getFollowing: async () => {
    return apiRequest('/users/following');
  },
};

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  artworkCount?: number;
  followersCount?: number;
  followingCount?: number;
  totalLikes?: number;
  isFollowing?: boolean;
  createdAt?: string;
}

export interface Artwork {
  _id: string;
  title: string;
  description?: string;
  image_url: string;
  artist: User;
  likes_count: number;
  is_liked: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}