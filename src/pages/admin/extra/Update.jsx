import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';

const Update = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Update</h1>
      <Card>
        <div className="space-y-4">
          <p className="text-gray-600">System update information.</p>
          <p className="text-sm text-gray-500">Current Version: MLMLAB V3.1</p>
          <Button variant="primary">Check for Updates</Button>
        </div>
      </Card>
    </div>
  );
};

export default Update;

