import { useState } from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Alert from '../../../components/common/Alert';
import { adminRoleService } from '../../../services/adminRoleService';
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

const allFeatures = Object.values(FEATURES);

const CreateAdmin = () => {
  const [email, setEmail] = useState('');
  const [roleName, setRoleName] = useState('Admin');
  const [permissions, setPermissions] = useState(
    allFeatures.map((feature) => ({ feature, access: ACCESS.EDIT }))
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handlePermissionChange = (feature, access) => {
    setPermissions((prev) => {
      const idx = prev.findIndex((p) => p.feature === feature);
      if (idx === -1) {
        return [...prev, { feature, access }];
      }
      const updated = [...prev];
      updated[idx] = { ...updated[idx], access };
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await adminRoleService.createAdmin({
        email,
        roleName,
        permissions,
      });
      setSuccess('Admin created locally. Backend wiring pending.');
      setEmail('');
      setRoleName('Admin');
    } catch (err) {
      setError(err.message || 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PermissionGuard feature={FEATURES.USERS} access={ACCESS.EDIT} fallback={<div className="p-6 text-[var(--text-primary)]">You do not have permission to manage admins.</div>}>
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Create Admin</h1>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <Alert type="error" message={error} />}
            {success && <Alert type="success" message={success} />}

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Role Name
              </label>
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                placeholder="Admin / Support Admin / Read-only Admin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                Feature Permissions
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allFeatures.map((feature) => {
                  const current = permissions.find((p) => p.feature === feature) || {
                    feature,
                    access: ACCESS.READ,
                  };
                  return (
                    <div
                      key={feature}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)]"
                    >
                      <span className="text-sm text-[var(--text-primary)]">
                        {featureLabels[feature] || feature}
                      </span>
                      <div className="flex gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => handlePermissionChange(feature, ACCESS.READ)}
                          className={`px-2 py-1 rounded border ${
                            current.access === ACCESS.READ
                              ? 'bg-[#00ADB5] text-white border-[#00ADB5]'
                              : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-color)]'
                          }`}
                        >
                          Read
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePermissionChange(feature, ACCESS.EDIT)}
                          className={`px-2 py-1 rounded border ${
                            current.access === ACCESS.EDIT
                              ? 'bg-[#00ADB5] text-white border-[#00ADB5]'
                              : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-color)]'
                          }`}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" variant="primary" disabled={loading} className="px-8">
                {loading ? 'Creating...' : 'Create Admin'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PermissionGuard>
  );
};

export default CreateAdmin;


