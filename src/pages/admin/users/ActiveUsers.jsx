import { useState, useEffect } from 'react';
import { userService } from '../../../services/userService';
import AllUsers from './AllUsers';

const ActiveUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getActiveUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  return <AllUsers />;
};

export default ActiveUsers;

