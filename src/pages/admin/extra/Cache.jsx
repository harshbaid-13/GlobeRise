import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';

const Cache = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Cache</h1>
      <Card>
        <div className="space-y-4">
          <p className="text-gray-600">Manage application cache.</p>
          <Button variant="primary">Clear Cache</Button>
        </div>
      </Card>
    </div>
  );
};

export default Cache;

