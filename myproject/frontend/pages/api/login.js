import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // Import the configured axios instance
import { useRouter } from 'next/router'; // Import useRouter for redirection

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const router = useRouter(); // Initialize router for redirection

  // Fetch CSRF token
  const fetchCsrfToken = async () => {
    try {
      const response = await api.get('/management/api/csrf/');
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    }
  };

  // Call fetchCsrfToken on component mount
  useEffect(() => {
    fetchCsrfToken();
  }, []);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/management/api/login/', { username, password }, {
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });
      
      if (response.data.success) {
        // Redirect to the KPI page on successful login
        router.push('/kpis');
      } else {
        console.error('Login error:', response.data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;


