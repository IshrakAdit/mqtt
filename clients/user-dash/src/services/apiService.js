// Base URL from env or fallback
const USER_API_BASE_URL =
  import.meta.env.VITE_USER_API_BASE_URL || "http://localhost:8082/user/v1";

// Generic API call helper
const apiCall = async (endpoint, options = {}) => {
  const url = `${USER_API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// User API based on UserControllerV1
export const authAPI = {
  // Test endpoint
  testService: async () => {
    return await apiCall("/test");
  },

  // Get user by ID
  getUserById: async (id) => {
    return await apiCall(`/id/${id}`);
  },

  // Get all users
  getAllUsers: async () => {
    return await apiCall("/all");
  },

  // Register user
  register: async (username) => {
    return await apiCall("/register", {
      method: "POST",
      body: JSON.stringify({ username }),
    });
  },

  // Login user
  login: async (username) => {
    return await apiCall("/login", {
      method: "POST",
      body: JSON.stringify({ username }),
    });
  },

  // Delete user
  deleteUser: async (id) => {
    return await apiCall(`/${id}`, {
      method: "DELETE",
    });
  },
};
