import AllUsers from './AllUsers';
import { userService } from '../../../services/userService';

const MobileUnverified = () => {
  return <AllUsers loadUsersFn={userService.getMobileUnverifiedUsers} title="Mobile Unverified Users" />;
};

export default MobileUnverified;

