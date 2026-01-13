import { useEffect, useState } from 'react';
import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import { adminRoleService } from '../../../services/adminRoleService';
import Loading from '../../../components/common/Loading';
import { FEATURES, ACCESS } from '../../../utils/permissions';
import PermissionGuard from '../../../components/auth/PermissionGuard';

const featureLabels = {
  [FEATURES.USERS]: 'Users',
  [FEATURES.PLANS]: 'Plans',
  [FEATURES.STAKING]: 'Staking',
  [FEATURES.RANKINGS]: 'Rankings',
  [FEATURES.NOTIFICATIONS]: 'Notifications',
  [FEATURES.SUPPORT]: 'Support',
  [FEATURES.COMMISSIONS]: 'Commissions',
  [FEATURES.REPORTS]: 'Reports',
};

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const data = await adminRoleService.getAllAdmins();
      setAdmins(data);
    } catch (error) {
      console.error('Error loading admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'roleName' },
    {
      header: 'Permissions',
      accessor: 'permissions',
      render: (value) => {
        if (!Array.isArray(value) || value.length === 0) return '—';
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((p, idx) => (
              <span
                key={`${p.feature}-${p.access}-${idx}`}
                className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700"
              >
                {featureLabels[p.feature] || p.feature} ({p.access === ACCESS.EDIT ? 'Edit' : 'Read'})
              </span>
            ))}
          </div>
        );
      },
    },
    {
      header: 'Created',
      accessor: 'createdAt',
      render: (value) => (value ? new Date(value).toLocaleString() : '—'),
    },
  ];

  if (loading) return <Loading size="lg" />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Manage Admins</h1>
        <PermissionGuard feature={FEATURES.USERS} access={ACCESS.EDIT}>
          <Button
            variant="primary"
            onClick={() => (window.location.href = '/admin/admins/create')}
          >
            Create Admin
          </Button>
        </PermissionGuard>
      </div>
      <Card>
        <Table columns={columns} data={admins} />
      </Card>
    </div>
  );
};

export default ManageAdmins;


