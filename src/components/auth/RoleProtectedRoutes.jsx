import { useAuth } from '../../hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';
const RoleProtectedRoute = ({ requiredRole, redirectPath = '/' }) => {
  const { user, loading, hasRole } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return hasRole(requiredRole) ? <Outlet /> : <Navigate to={redirectPath} replace />;
};
export default RoleProtectedRoute;