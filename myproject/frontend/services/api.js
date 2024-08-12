// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8000', // Your Django backend URL
//   withCredentials: true, // Ensure cookies are included
// });

// const getCsrfToken = async () => {
//   try {
//     const response = await api.get('/management/api/csrf/');
//     return response.data.csrfToken;
//   } catch (error) {
//     console.error('Error fetching CSRF token:', error);
//     throw error;
//   }
// };

// // Add CSRF token to headers for POST requests
// api.interceptors.request.use(async (config) => {
//   if (config.method === 'post') {
//     const csrfToken = await getCsrfToken();
//     if (csrfToken) {
//       config.headers['X-CSRFToken'] = csrfToken;
//     }
//   }
//   return config;
// });

// export const fetchKpis = async () => {
//   try {
//     const response = await api.get('http://localhost:8000/stockapp/kpi/');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching KPIs:', error);
//     throw error;
//   }
// };

// export const fetchTopMovers = async () => {
//   try {
//     const response = await api.get('/stockapp/top-movers/');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching top movers:', error);
//     throw error;
//   }
// };

// export const login = async (username, password) => {
//   try {
//     const response = await api.post('/management/api/login/', {
//       username,
//       password,
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error logging in:', error);
//     throw error;
//   }
// };

// export const logout = async () => {
//   try {
//     await api.post('/management/api/logout/');
//   } catch (error) {
//     console.error('Error logging out:', error);
//     throw error;
//   }
// };

// export default api;
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.49.2:30006', // Your Django backend URL
  withCredentials: true, // Ensure cookies are included
});

const getCsrfToken = async () => {
  try {
    const response = await api.get('/management/api/csrf/');
    return response.data.csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
};

// Add CSRF token to headers for POST requests
api.interceptors.request.use(async (config) => {
  if (config.method === 'post' && !config.headers['X-CSRFToken']) {
    const csrfToken = await getCsrfToken();
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const fetchKpis = async () => {
  try {
    const response = await api.get('/stockapp/kpi/');
    return response.data;
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    throw error;
  }
};

export const fetchTopMovers = async () => {
  try {
    const response = await api.get('/stockapp/top-movers/');
    return response.data;
  } catch (error) {
    console.error('Error fetching top movers:', error);
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const response = await api.post('/management/api/login/', {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const csrfToken = await getCsrfToken();
    await api.post('/management/api/logout/', {}, {
      headers: {
        'X-CSRFToken': csrfToken,
      },
    });
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export default api;
