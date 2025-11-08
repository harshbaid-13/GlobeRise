import AllUsers from './AllUsers';
import { userService } from '../../../services/userService';

const KYCPending = () => {
  return <AllUsers loadUsersFn={userService.getKYCPendingUsers} title="KYC Pending Users" />;
};

export default KYCPending;

