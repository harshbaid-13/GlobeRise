import AllUsers from './AllUsers';
import { userService } from '../../../services/userService';

const KYCUnverified = () => {
  return <AllUsers loadUsersFn={userService.getKYCUnverifiedUsers} title="KYC Unverified Users" />;
};

export default KYCUnverified;

