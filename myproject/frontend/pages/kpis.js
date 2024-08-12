

import React, { useEffect, useState } from 'react';
import { fetchKpis, logout } from '../services/api';
import '../public/styles/styles.css'; // Import the CSS file
import { useRouter } from 'next/router';

const Kpis = () => {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getKpis = async () => {
      try {
        const data = await fetchKpis();
        setKpis(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getKpis();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <div className="button-container">
        <button className="nav-button" onClick={() => router.push('/kpis')}>All Data</button>
        <button className="nav-button" onClick={() => router.push('/top-movers')}>Top Movers</button>
      </div>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <h1>All Stock Data</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Date</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Volume</th>
            <th>Daily Closing Price</th>
            <th>Price Change (24h)</th>
            <th>Price Change (7d)</th>
            <th>Price Change (30d)</th>
          </tr>
        </thead>
        <tbody>
          {kpis.map((kpi, index) => (
            <tr key={index}>
              <td>{kpi.ticker}</td>
              <td>{new Date(kpi.date).toLocaleDateString()}</td>
              <td>{kpi.open.toFixed(2)}</td>
              <td>{kpi.high.toFixed(2)}</td>
              <td>{kpi.low.toFixed(2)}</td>
              <td>{kpi.volume.toLocaleString()}</td>
              <td>{kpi.daily_closing_price.toFixed(2)}</td>
              <td>{kpi.price_change_24h ? kpi.price_change_24h.toFixed(2) + '%' : 'N/A'}</td>
              <td>{kpi.price_change_7d ? kpi.price_change_7d.toFixed(2) + '%' : 'N/A'}</td>
              <td>{kpi.price_change_30d ? kpi.price_change_30d.toFixed(2) + '%' : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Kpis;

