// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import '../public/styles/styles.css'; // Import the CSS file
// import { useRouter } from 'next/router';
// import api from '../services/api';

// const MyApp = ({ Component, pageProps }) => {
//   const [user, setUser] = useState(null); // Manage user state
//   const router = useRouter();

//   useEffect(() => {
//     // Check if the user is authenticated
//     const checkAuth = async () => {
//       try {
//         const res = await api.get('/management/api/csrf/');
//         if (res.status === 200) {
//           const data = res.data;
//           // Adjust according to your API response
//           setUser(data.user || null);
//         } else {
//           setUser(null);
//         }
//       } catch (error) {
//         console.error('Error checking authentication:', error);
//         setUser(null);
//       }
//     };
//     checkAuth();
//   }, []);

//   const handleLogout = async () => {
//     await api.post('/management/api/logout/');
//     setUser(null);
//     router.push('/login');
//   };

//   return (
//     <>
//       <header className="header">
//         <h1>Stock Monitor</h1>
//         <div className="button-container">
//           {user ? (
//             <>
//               <button className="nav-button" onClick={handleLogout}>Logout</button>
//             </>
//           ) : (
//             <>
//               <Link href="/login">
//                 Login
//               </Link>
//               <Link href="/register">
//                 Register
//               </Link>
//             </>
//           )}
//         </div>
//       </header>
//       <div className="container">
//         <Component {...pageProps} />
//       </div>
//     </>
//   );
// };

// export default MyApp;

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import '../public/styles/styles.css'; // Import the CSS file
import { useRouter } from 'next/router';
import api from '../services/api';

const MyApp = ({ Component, pageProps }) => {
  const [user, setUser] = useState(null); // Manage user state
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = async () => {
      try {
        const res = await api.get('/management/api/csrf/');
        if (res.status === 200) {
          const data = res.data;
          // Adjust according to your API response
          setUser(data.user || null);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await api.post('/management/api/logout/');
    setUser(null);
    router.push('/login');
  };

  return (
    <>
      <header className="header">
        <h1>Stock Monitor</h1>
        <div className="button-container">
          {user ? (
            <>
              <button className="nav-button" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login">
                Login
              </Link>
              <Link href="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </header>
      <div className="container">
        <Component {...pageProps} />
      </div>
    </>
  );
};

export default MyApp;
