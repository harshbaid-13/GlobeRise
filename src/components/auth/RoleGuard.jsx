import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import { usePermissions } from '../../hooks/usePermissions';

const RoleGuard = ({ children, allowedRoles = [], requiredFeature, requiredAccess }) => {
  const { user, loading } = useAuth();
  const { can } = usePermissions();
  
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

  // Optional feature-level permission check
  if (requiredFeature && requiredAccess && !can(requiredFeature, requiredAccess)) {
    // For now, just redirect to the main dashboard for that role
    if (user.role === 'admin') {
      return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
    }
    return <Navigate to={ROUTES.CLIENT_DASHBOARD} replace />;
  }
  
  return children;
};

export default RoleGuard;

