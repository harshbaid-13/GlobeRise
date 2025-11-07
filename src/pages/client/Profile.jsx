import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
      <Card>
        <div className="space-y-4">
          <Input label="Username" defaultValue={user?.username} disabled />
          <Input label="Email" defaultValue={user?.email} disabled />
          <Input label="Name" defaultValue={user?.name} />
          <Button variant="primary">Update Profile</Button>
        </div>
      </Card>
    </div>
  );
};

export default Profile;

