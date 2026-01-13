import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { DEFAULT_ADMIN_PERMISSIONS, hasPermission } from '../utils/permissions';

// Simple frontend-only permission hook.
// For now:
// - Clients have no admin feature permissions
// - Admins use DEFAULT_ADMIN_PERMISSIONS, overridable via user.permissions if present

export const usePermissions = () => {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    if (!user) return [];
    if (user.role !== 'admin') return [];

    // Allow mocking/storing custom permissions on the user object later
    if (Array.isArray(user.permissions) && user.permissions.length > 0) {
      return user.permissions;
    }

    return DEFAULT_ADMIN_PERMISSIONS;
  }, [user]);

  const can = (feature, access) => hasPermission(permissions, feature, access);

  return {
    permissions,
    can,
  };
};


