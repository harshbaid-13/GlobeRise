import AllUsers from './AllUsers';
import { userService } from '../../../services/userService';

const PaidUsers = () => {
  return <AllUsers loadUsersFn={userService.getPaidUsers} title="Paid Users" />;
};

export default PaidUsers;

