// Frontend-only permissions model for admin panel
// This will later be replaced/augmented by real backend-driven permissions.

export const FEATURES = {
  USERS: 'users',
  PLANS: 'plans',
  STAKING: 'staking',
  RANKINGS: 'rankings',
  NOTIFICATIONS: 'notifications',
  SUPPORT: 'support',
  COMMISSIONS: 'commissions',
  REPORTS: 'reports',
};

export const ACCESS = {
  READ: 'read',
  EDIT: 'edit',
};

// Default full-access admin role used for now
export const DEFAULT_ADMIN_PERMISSIONS = [
  { feature: FEATURES.USERS, access: ACCESS.EDIT },
  { feature: FEATURES.PLANS, access: ACCESS.EDIT },
  { feature: FEATURES.STAKING, access: ACCESS.EDIT },
  { feature: FEATURES.RANKINGS, access: ACCESS.EDIT },
  { feature: FEATURES.NOTIFICATIONS, access: ACCESS.EDIT },
  { feature: FEATURES.SUPPORT, access: ACCESS.EDIT },
  { feature: FEATURES.COMMISSIONS, access: ACCESS.EDIT },
  { feature: FEATURES.REPORTS, access: ACCESS.READ },
];

export const hasPermission = (permissions, feature, access) => {
  if (!permissions || !feature || !access) return false;

  // EDIT implies READ for the same feature
  return permissions.some((p) => {
    if (p.feature !== feature) return false;
    if (p.access === ACCESS.EDIT) return true;
    return p.access === access;
  });
};


