const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return response.json();
  }
};

export const postsAPI = {
  getAll: async (search = '', page = 1, limit = 10) => {
    const response = await fetch(
      `${API_URL}/posts?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`,
      { headers: getAuthHeaders() }
    );
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  create: async (postData) => {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(postData)
    });
    return response.json();
  },

  update: async (id, postData) => {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(postData)
    });
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getUserPosts: async (userId, page = 1, limit = 10) => {
    const response = await fetch(
      `${API_URL}/posts/user/${userId}?page=${page}&limit=${limit}`,
      { headers: getAuthHeaders() }
    );
    return response.json();
  }
};
