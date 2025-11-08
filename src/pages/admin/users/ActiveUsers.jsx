import AllUsers from './AllUsers';
import { userService } from '../../../services/userService';

const ActiveUsers = () => {
  return <AllUsers loadUsersFn={userService.getActiveUsers} title="Active Users" />;
};

export default ActiveUsers;

