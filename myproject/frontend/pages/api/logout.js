// // // pages/api/logout.js
// // import { serialize } from 'cookie';

// // export default function handler(req, res) {
// //   if (req.method === 'POST') {
// //     // Clear the authentication token
// //     res.setHeader('Set-Cookie', serialize('userToken', '', { maxAge: -1, path: '/' }));
    
// //     // Respond with a success message
// //     res.status(200).json({ message: 'Logged out successfully' });
// //   } else {
// //     res.setHeader('Allow', ['POST']);
// //     res.status(405).end(`Method ${req.method} Not Allowed`);
// //   }
// // }

// import axios from 'axios';
// import { useRouter } from 'next/router';

// const logout = async () => {
//   try {
//     // Perform the logout request to the Django backend
//     await axios.post('http://127.0.0.1:8000/management/api/logout/', {}, {
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     });

//     // Redirect to the login page
//     const router = useRouter();
//     router.push('/login');
//   } catch (error) {
//     console.error('Logout error:', error);
//     // Optionally handle the error
//   }
// };

// export default logout;

import axios from 'axios';

const apiUrl = 'http://192.168.49.2:30006/management/api'; // Adjust as needed

export const logoutUser = async () => {
  try {
      const response = await axios.post(`${apiUrl}/logout/`); // Match the path in Django URLs
      // Clear user data from local storage
      localStorage.removeItem('user');
      return response.data;
  } catch (error) {
      console.error('Error logging out user:', error);
      throw error;
  }
};
