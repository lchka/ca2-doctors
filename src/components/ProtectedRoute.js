import { Outlet, Navigate } from 'react-router-dom'; // Import necessary components from react-router-dom
import { useAuth } from '../utils/useAuth'; // Import a custom hook for authentication

// A component to protect certain routes and restrict access to authenticated users
const ProtectedRoute = () => {
  const { token } = useAuth(); // Destructure the token from the useAuth hook

  // If no token is found (user is not authenticated), redirect them to the login page with a message
  if (!token) {
    return (
      <Navigate
        to="/" // Redirect to the home or login page
        state={{ msg: 'Unauthorised user! Please login to access that page' }} // Pass a state message explaining the redirection
      />
    );
  }

  // If the user is authenticated, render the child components via Outlet
  return <Outlet />;
};

export default ProtectedRoute; // Export the ProtectedRoute component for use in the app
