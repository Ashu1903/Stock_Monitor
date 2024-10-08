// pages/api/csrf-token.js
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get('http://192.168.49.2:30006/management/api/csrf/');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: 'Failed to fetch CSRF token' });
  }
}


