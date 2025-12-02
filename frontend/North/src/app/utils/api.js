const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

const handleUnauthorized = () => {
  // Clear local auth state on 401
  try {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-change'));
  } catch (e) {
    // ignore (server-side or restricted env)
  }
};

export async function fetchWithAuth(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const resp = await fetch(url, { ...options, headers, credentials: 'include' });

  if (resp.status === 401) {
    handleUnauthorized();
    const payload = await resp.json().catch(() => ({}));
    const err = new Error(payload.message || 'UNAUTHORIZED');
    err.code = 'UNAUTHORIZED';
    throw err;
  }

  return resp;
}


// LEADERBOARD API

export async function getLeaderboard() {
  const res = await fetchWithAuth('/leaderboard', { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch leaderboard');
  }

  return res.json();
}

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }


    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new Event('auth-change'));
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new Event('auth-change'));
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  // Dispatch custom event for same-tab updates
  window.dispatchEvent(new Event('auth-change'));
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};


export const getUserProfile = async (userId) => {
  try {
    const response = await fetchWithAuth(`/user/profile/${userId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch user profile');
    return data;
  } catch (error) {
    throw error;
  }
};

export const getUserModules = async (userId) => {
  try {
    const response = await fetchWithAuth(`/user/${userId}/modules`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.modules;
  } catch (error) {
    console.error('Failed to fetch modules:', error);
    return [];
  }
};

export const getUserStats = async (userId) => {
  try {
    const response = await fetchWithAuth(`/user/stats/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user stats');
    return response.json();
  } catch (error) {
    console.error('Failed to fetch user stats:', error);
    throw error;
  }
};

export const getUserAchievements = async (userId) => {
  try {
    const response = await fetchWithAuth(`/achievement/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user achievements');
    return response.json();
  } catch (error) {
    return [];
  }
};


// CODE PROBLEMS API

export const getProblems = async () => {
  try {
    const response = await fetchWithAuth('/code/problems');
    const data = await response.json();

    if (data.success) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch problems:', error);
    return [];
  }
};

export const getProblemById = async (problemId) => {
  try {
    const response = await fetchWithAuth(`/code/problems/${problemId}`);
    const data = await response.json();

    if (data.success) {
      return data.data;
    }
    throw new Error('Problem not found');
  } catch (error) {
    throw error;
  }
};


export const getQuizzes = async () => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/quiz`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch (error) {
    return [];
  }
};
