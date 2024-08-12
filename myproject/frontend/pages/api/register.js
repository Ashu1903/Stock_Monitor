// pages/api/register.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Fetch CSRF token
      const csrfResponse = await axios.get('/api/csrf-token');
      const csrfToken = csrfResponse.data.csrfToken;

      // Registration request
      const response = await axios.post('http://192.168.49.2:30006/management/api/register/', req.body, {
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json'
        }
      });

      res.status(200).json(response.data);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: 'Registration failed' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
