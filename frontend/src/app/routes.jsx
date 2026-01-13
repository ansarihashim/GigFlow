import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import GigList from '../pages/gigs/GigList.jsx';
import GigDetails from '../pages/gigs/GigDetails.jsx';
import GigBids from '../pages/bids/GigBids.jsx';
import { useAuth } from '../store/AuthProvider.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/gigs"
        element={(
          <ProtectedRoute>
            <GigList />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/gigs/:id"
        element={(
          <ProtectedRoute>
            <GigDetails />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/gigs/:id/bids"
        element={(
          <ProtectedRoute>
            <GigBids />
          </ProtectedRoute>
        )}
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
