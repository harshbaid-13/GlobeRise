import AllUsers from './AllUsers';
import { userService } from '../../../services/userService';

const BannedUsers = () => {
  return <AllUsers loadUsersFn={userService.getBannedUsers} title="Banned Users" />;
};

export default BannedUsers;

