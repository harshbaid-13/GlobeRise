import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

const RoleGuard = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return null;
  }
  
  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect based on role
    if (user?.role === 'admin') {
      return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
    }
    return <Navigate to={ROUTES.CLIENT_DASHBOARD} replace />;
  }
  
  return children;
};

export default RoleGuard;

