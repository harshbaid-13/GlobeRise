import AllUsers from './AllUsers';
import { userService } from '../../../services/userService';
import PermissionGuard from '../../../components/auth/PermissionGuard';
import { FEATURES, ACCESS } from '../../../utils/permissions';

// Wrapper that reuses AllUsers with a custom loader to show users with no investments
const UninvestedUsers = () => {
  const loadUninvestedUsers = async () => {
    const all = await userService.getAllUsers();
    return all.filter((u) => (u.totalInvest || 0) === 0 && (u.totalDeposited || 0) === 0);
  };

  return (
    <PermissionGuard feature={FEATURES.USERS} access={ACCESS.READ}>
      <AllUsers loadUsersFn={loadUninvestedUsers} title="Un-Invested Users" />
    </PermissionGuard>
  );
};

export default UninvestedUsers;


