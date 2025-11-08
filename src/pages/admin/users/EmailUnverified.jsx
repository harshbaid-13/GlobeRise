import AllUsers from './AllUsers';
import { userService } from '../../../services/userService';

const EmailUnverified = () => {
  return <AllUsers loadUsersFn={userService.getEmailUnverifiedUsers} title="Email Unverified Users" />;
};

export default EmailUnverified;

