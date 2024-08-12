// import React, { useEffect, useState } from 'react';
// import { fetchTopMovers } from '../services/api';
// import { useRouter } from 'next/router';
// import '../public/styles/styles.css'; // Ensure you have the correct CSS path

// const TopMovers = () => {
//   const [topMovers, setTopMovers] = useState({ top_gainers: [], top_losers: [] });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const getTopMovers = async () => {
//       try {
//         const data = await fetchTopMovers();
//         setTopMovers(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getTopMovers();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await api.post('/management/api/logout/');
//       router.push('/login');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   const handleAllData = () => {
//     router.push('/kpis');
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="container">
//       <h1 className="headline">Stock Monitor</h1>
//       <div className="buttons">
//         <button onClick={handleAllData}>All Data</button>
//         <button onClick={() => router.push('/top-movers')}>Top Movers</button>
//         <button onClick={handleLogout}>Logout</button>
//       </div>
//       <h2>Top Gainers</h2>
//       <table className="table">
//         <thead>
//           <tr>
//             <th>Ticker</th>
//             <th>Change Percentage</th>
//           </tr>
//         </thead>
//         <tbody>
//           {topMovers.top_gainers.map((mover, index) => (
//             <tr key={index}>
//               <td>{mover.ticker}</td>
//               <td>{mover.change_percentage.toFixed(2)}%</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <h2>Top Losers</h2>
//       <table className="table">
//         <thead>
//           <tr>
//             <th>Ticker</th>
//             <th>Change Percentage</th>
//           </tr>
//         </thead>
//         <tbody>
//           {topMovers.top_losers.map((mover, index) => (
//             <tr key={index}>
//               <td>{mover.ticker}</td>
//               <td>{mover.change_percentage.toFixed(2)}%</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TopMovers;

// import React, { useEffect, useState } from 'react';
// import { fetchTopMovers } from '../services/api';
// import '../public/styles/styles.css'; // Import the CSS file

// const TopMovers = () => {
//   const [topMovers, setTopMovers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const getTopMovers = async () => {
//       try {
//         const data = await fetchTopMovers();
//         setTopMovers(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getTopMovers();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="container">
//       <h1>Top Movers</h1>
//       <table className="table">
//         <thead>
//           <tr>
//             <th>Ticker</th>
//             <th>Date</th>
//             <th>Change (%)</th>
//           </tr>
//         </thead>
//         <tbody>
//           {topMovers.map((mover, index) => (
//             <tr key={index}>
//               <td>{mover.ticker}</td>
//               <td>{new Date(mover.date).toLocaleDateString()}</td>
//               <td>{mover.change.toFixed(2) + '%'}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TopMovers;

import React, { useEffect, useState } from 'react';
import { fetchTopMovers, logout } from '../services/api';
import '../public/styles/styles.css'; // Import the CSS file
import { useRouter } from 'next/router';

const TopMovers = () => {
  const [topMovers, setTopMovers] = useState({ top_gainers: [], top_losers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getTopMovers = async () => {
      try {
        const data = await fetchTopMovers();
        setTopMovers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getTopMovers();
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
      <h1>Top Movers</h1>
      <h2>Top Gainers</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Change Percentage</th>
          </tr>
        </thead>
        <tbody>
          {topMovers.top_gainers.map((mover, index) => (
            <tr key={index}>
              <td>{mover.ticker}</td>
              <td>{mover.change_percentage.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Top Losers</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Change Percentage</th>
          </tr>
        </thead>
        <tbody>
          {topMovers.top_losers.map((mover, index) => (
            <tr key={index}>
              <td>{mover.ticker}</td>
              <td>{mover.change_percentage.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopMovers;

