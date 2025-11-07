import { useState, useEffect } from 'react';
import { pinService } from '../../../services/pinService';
import AllPins from './AllPins';

const UserPins = () => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPins();
  }, []);

  const loadPins = async () => {
    try {
      const data = await pinService.getUserPins();
      setPins(data);
    } catch (error) {
      console.error('Error loading pins:', error);
    } finally {
      setLoading(false);
    }
  };

  return <AllPins />;
};

export default UserPins;

