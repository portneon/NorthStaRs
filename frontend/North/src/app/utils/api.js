const API_BASE_URL = 'http://localhost:3005';


// LEADERBOARD API

export async function getLeaderboard() {
  const res = await fetch(`${API_BASE_URL}/leaderboard`, {
    cache: 'no-store',
  });

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
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/user/profile/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user profile');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const getUserModules = async (userId) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/user/${userId}/modules`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {

      return [
        { title: "Advanced Algorithms", subTitle: "Module_04", progress: 75 },
        { title: "System Design", subTitle: "Module_02", progress: 30 },
        { title: "React Patterns", subTitle: "Module_09", progress: 12 },
        { title: "Data Structures", subTitle: "Module_01", progress: 100 }
      ];
    }

    const data = await response.json();
    return data.modules;
  } catch (error) {
    console.error('Failed to fetch modules:', error);
    // Return default modules on error
    return [
      { title: "Advanced Algorithms", subTitle: "Module_04", progress: 75 },
      { title: "System Design", subTitle: "Module_02", progress: 30 }
    ];
  }
};

export const getUserStats = async (userId) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/user/stats/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user stats');
    }

    return response.json();
  } catch (error) {
    // Return mock data on error
    return {
      totalHours: 42.5,
      activeModules: 3,
      globalRank: 842,
      streak: 14,
      xpGoal: 87,
    };
  }
};

export const getUserAchievements = async (userId) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/achievement/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user achievements');
    }

    return response.json();
  } catch (error) {
    return [];
  }
};


// CODE PROBLEMS API

export const getProblems = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/code/problems`);
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
    const response = await fetch(`${API_BASE_URL}/code/problems/${problemId}`);
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
