import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';

/**
 * Frontend-only permission guard.
 * 
 * Usage:
 * <PermissionGuard feature={FEATURES.USERS} access={ACCESS.EDIT}>
 *   <Button>Ban User</Button>
 * </PermissionGuard>
 */
const PermissionGuard = ({ feature, access, fallback = null, children }) => {
  const { can } = usePermissions();

  if (!feature || !access) {
    return children;
  }

  if (!can(feature, access)) {
    return fallback;
  }

  return <>{children}</>;
};

export default PermissionGuard;


