import React, { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../services/api'; // Import the configured axios instance

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter(); // Hook for redirection

  // Fetch CSRF token on component mount
  React.useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await api.get('/management/api/csrf/');
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/management/api/login/', { username, password }, {
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });
      // Redirect to /kpis on successful login
      router.push('/kpis');
    } catch (error) {
      setErrorMessage('Invalid login credentials');
      console.error('Login error:', error);
    }
  };

  return (
    <div>
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
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
};

export default Login;

