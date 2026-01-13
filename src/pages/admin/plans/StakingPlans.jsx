import { useEffect, useState } from 'react';
import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import Alert from '../../../components/common/Alert';
import { delay } from '../../../utils/helpers';
import Loading from '../../../components/common/Loading';
import PermissionGuard from '../../../components/auth/PermissionGuard';
import { FEATURES, ACCESS } from '../../../utils/permissions';

const LOCAL_KEY = 'staking_plans_config';

const defaultTiers = [
  { id: '1', tier: 1, durationMonths: 3, monthlyRate: 1.25, active: true },
  { id: '2', tier: 2, durationMonths: 6, monthlyRate: 1.75, active: true },
  { id: '3', tier: 3, durationMonths: 12, monthlyRate: 2.25, active: true },
  { id: '4', tier: 4, durationMonths: 18, monthlyRate: 4.0, active: true },
  { id: '5', tier: 5, durationMonths: 24, monthlyRate: 4.75, active: true },
];

const loadLocal = () => {
  const raw = localStorage.getItem(LOCAL_KEY);
  if (!raw) return defaultTiers;
  try {
    const parsed = JSON.parse(raw);
    return parsed.length ? parsed : defaultTiers;
  } catch {
    return defaultTiers;
  }
};

const saveLocal = (tiers) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(tiers));
};

const StakingPlans = () => {
  const [loading, setLoading] = useState(true);
  const [tiers, setTiers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    tier: '',
    durationMonths: '',
    monthlyRate: '',
    active: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const init = async () => {
      await delay(200);
      const existing = loadLocal();
      setTiers(existing);
      setLoading(false);
    };
    init();
  }, []);

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      tier: row.tier,
      durationMonths: row.durationMonths,
      monthlyRate: row.monthlyRate,
      active: row.active,
    });
    setError('');
    setSuccess('');
  };

  const openAdd = () => {
    setEditing(null);
    setForm({
      tier: tiers.length + 1,
      durationMonths: 3,
      monthlyRate: 1.0,
      active: true,
    });
    setError('');
    setSuccess('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const next = [...tiers];
      if (editing) {
        const idx = next.findIndex((t) => t.id === editing.id);
        if (idx !== -1) {
          next[idx] = {
            ...next[idx],
            tier: Number(form.tier),
            durationMonths: Number(form.durationMonths),
            monthlyRate: Number(form.monthlyRate),
            active: !!form.active,
          };
        }
      } else {
        next.push({
          id: String(Date.now()),
          tier: Number(form.tier),
          durationMonths: Number(form.durationMonths),
          monthlyRate: Number(form.monthlyRate),
          active: !!form.active,
        });
      }
      setTiers(next);
      saveLocal(next);
      setSuccess('Staking plan saved locally. Backend integration pending.');
      setTimeout(() => setEditing(null), 700);
    } catch (e) {
      setError('Failed to save staking plan');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (row) => {
    const next = tiers.map((t) =>
      t.id === row.id ? { ...t, active: !t.active } : t
    );
    setTiers(next);
    saveLocal(next);
  };

  const columns = [
    { header: 'Tier', accessor: 'tier' },
    { header: 'Duration (months)', accessor: 'durationMonths' },
    { header: 'Monthly Rate (%)', accessor: 'monthlyRate' },
    {
      header: 'Status',
      accessor: 'active',
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            value ? 'bg-[#10b981] text-white' : 'bg-gray-500 text-white'
          }`}
        >
          {value ? 'Active' : 'Disabled'}
        </span>
      ),
    },
    {
      header: 'Action',
      accessor: 'id',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => openEdit(row)}
            className="px-3 py-1.5 text-xs"
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant={row.active ? 'danger' : 'success'}
            onClick={() => toggleActive(row)}
            className="px-3 py-1.5 text-xs"
          >
            {row.active ? 'Disable' : 'Enable'}
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <Loading size="lg" />;

  return (
    <PermissionGuard feature={FEATURES.STAKING} access={ACCESS.EDIT}>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Staking Plans</h1>
          <Button variant="primary" onClick={openAdd}>
            Add Staking Plan
          </Button>
        </div>
        <Card>
          <Table columns={columns} data={tiers} />
        </Card>

        <Modal
          isOpen={!!editing || form.tier !== ''}
          onClose={() => {
            setEditing(null);
            setForm({ tier: '', durationMonths: '', monthlyRate: '', active: true });
          }}
          title={editing ? 'Edit Staking Plan' : 'Add Staking Plan'}
          variant="light"
          size="md"
        >
          <form onSubmit={handleSave} className="space-y-4">
            {error && <Alert type="error" message={error} />}
            {success && <Alert type="success" message={success} />}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tier
              </label>
              <input
                type="number"
                value={form.tier}
                onChange={(e) => setForm((f) => ({ ...f, tier: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (months)
              </label>
              <input
                type="number"
                value={form.durationMonths}
                onChange={(e) =>
                  setForm((f) => ({ ...f, durationMonths: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.monthlyRate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, monthlyRate: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm((f) => ({ ...f, active: e.target.checked }))
                }
                id="staking-active"
              />
              <label htmlFor="staking-active" className="text-sm text-gray-700">
                Active
              </label>
            </div>

            <p className="text-xs text-gray-500">
              Note: These plans control only the frontend configuration for now. Blockchain and
              backend logic remain unchanged until integrated.
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

export default StakingPlans;


