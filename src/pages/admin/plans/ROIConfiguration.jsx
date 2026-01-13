import { useState } from 'react';
import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import Alert from '../../../components/common/Alert';
import Loading from '../../../components/common/Loading';
import PermissionGuard from '../../../components/auth/PermissionGuard';
import { FEATURES, ACCESS } from '../../../utils/permissions';

const LEVEL_COMMISSION_KEY = 'level_commission_config';

// Default level commission structure based on the image
const defaultLevelCommission = [
  { level: 1, directReferrals: 1, incomeOnROI: 10 },
  { level: 2, directReferrals: 2, incomeOnROI: 5 },
  { level: 3, directReferrals: 3, incomeOnROI: 4 },
  { level: 4, directReferrals: 4, incomeOnROI: 4 },
  { level: 5, directReferrals: 5, incomeOnROI: 3 },
  { level: 6, directReferrals: 6, incomeOnROI: 3 },
  { level: 7, directReferrals: 7, incomeOnROI: 3 },
  { level: 8, directReferrals: 8, incomeOnROI: 2 },
  { level: 9, directReferrals: 9, incomeOnROI: 2 },
  { level: 10, directReferrals: 10, incomeOnROI: 2 },
  { level: 11, directReferrals: 11, incomeOnROI: 2 },
  { level: 12, directReferrals: 12, incomeOnROI: 1 },
  { level: 13, directReferrals: 13, incomeOnROI: 1 },
  { level: 14, directReferrals: 14, incomeOnROI: 1 },
  { level: 15, directReferrals: 15, incomeOnROI: 1 },
  { level: 16, directReferrals: 16, incomeOnROI: 1 },
];

const getLevelCommissionConfig = () => {
  const raw = localStorage.getItem(LEVEL_COMMISSION_KEY);
  if (!raw) return defaultLevelCommission;
  try {
    return JSON.parse(raw);
  } catch {
    return defaultLevelCommission;
  }
};

const saveLevelCommissionConfig = (cfg) => {
  localStorage.setItem(LEVEL_COMMISSION_KEY, JSON.stringify(cfg));
};

const ROIConfiguration = () => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [levelCommission, setLevelCommission] = useState(getLevelCommissionConfig());
  const [editingLevel, setEditingLevel] = useState(null);
  const [levelForm, setLevelForm] = useState({ directReferrals: '', incomeOnROI: '' });

  const openEditLevel = (level) => {
    const levelData = levelCommission.find(l => l.level === level);
    if (levelData) {
      setEditingLevel(level);
      setLevelForm({
        directReferrals: levelData.directReferrals,
        incomeOnROI: levelData.incomeOnROI,
      });
      setError('');
      setSuccess('');
    }
  };

  const handleSaveLevel = async (e) => {
    e.preventDefault();
    if (!editingLevel) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const updated = levelCommission.map(l =>
        l.level === editingLevel
          ? {
              ...l,
              directReferrals: Number(levelForm.directReferrals) || l.directReferrals,
              incomeOnROI: Number(levelForm.incomeOnROI) || l.incomeOnROI,
            }
          : l
      );
      setLevelCommission(updated);
      saveLevelCommissionConfig(updated);
      setSuccess('Level commission configuration saved locally. Backend integration pending.');
      setTimeout(() => {
        setEditingLevel(null);
      }, 800);
    } catch (e) {
      setError('Failed to save level configuration');
    } finally {
      setSaving(false);
    }
  };

  const levelColumns = [
    { header: 'Serial', accessor: 'level' },
    { header: 'Level', accessor: 'level', render: (value) => `Level ${value}` },
    { header: 'Direct Referrals', accessor: 'directReferrals' },
    {
      header: 'Income on ROI (%)',
      accessor: 'incomeOnROI',
      render: (value) => `${value}%`,
    },
    {
      header: 'Action',
      accessor: 'level',
      render: (level) => (
        <Button
          size="sm"
          variant="primary"
          onClick={() => openEditLevel(level)}
          className="text-sm px-3 py-1.5"
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <PermissionGuard feature={FEATURES.PLANS} access={ACCESS.EDIT}>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">ROI Configuration - Level Commission Structure</h1>
        </div>

        <Card>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Level Commission Structure</h2>
          <Table columns={levelColumns} data={levelCommission} />
        </Card>

        {/* Level Commission Edit Modal */}
        <Modal
          isOpen={!!editingLevel}
          onClose={() => setEditingLevel(null)}
          title={editingLevel ? `Edit Level ${editingLevel} Commission` : 'Edit Level Commission'}
          variant="light"
          size="md"
        >
          <form onSubmit={handleSaveLevel} className="space-y-4">
            {error && <Alert type="error" message={error} />}
            {success && <Alert type="success" message={success} />}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Direct Referrals Required
              </label>
              <input
                type="number"
                min="1"
                value={levelForm.directReferrals}
                onChange={(e) => setLevelForm((f) => ({ ...f, directReferrals: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Number of direct referrals required to earn from this level
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Income on ROI (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={levelForm.incomeOnROI}
                onChange={(e) => setLevelForm((f) => ({ ...f, incomeOnROI: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Percentage of ROI that will be paid as commission for this level
              </p>
            </div>

            <p className="text-xs text-gray-500">
              Note: These values are currently stored in the browser only and will apply to level
              commissions once backend integration is completed.
            </p>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" disabled={saving} className="px-6">
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </PermissionGuard>
  );
};

export default ROIConfiguration;


