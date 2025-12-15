import { useState, useEffect } from 'react';
import { ruleService } from '../../services/ruleService';
import { FaBook, FaSearch, FaInfoCircle } from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';

const RULE_CATEGORIES = [
  { key: 'ALL', label: 'All Categories' },
  { key: 'INVESTMENT', label: 'Investment' },
  { key: 'REWARDS', label: 'Rewards' },
  { key: 'WITHDRAWAL', label: 'Withdrawal' },
  { key: 'RANKING', label: 'Ranking' },
  { key: 'REFERRAL', label: 'Referral' },
  { key: 'GENERAL', label: 'General' }
];

const Rules = () => {
  const [rules, setRules] = useState([]);
  const [filteredRules, setFilteredRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRule, setExpandedRule] = useState(null);

  useEffect(() => {
    loadRules();
  }, [selectedCategory]);

  useEffect(() => {
    filterRules();
  }, [rules, searchQuery, selectedCategory]);

  const loadRules = async () => {
    try {
      setLoading(true);
      setError('');
      const category = selectedCategory !== 'ALL' ? selectedCategory : undefined;
      const data = await ruleService.getActiveRules(category);
      setRules(data || []);
    } catch (err) {
      console.error('Error loading rules:', err);
      setError(err.response?.data?.message || 'Failed to load rules');
    } finally {
      setLoading(false);
    }
  };

  const filterRules = () => {
    let filtered = [...rules];

    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(rule => rule.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(rule =>
        rule.title.toLowerCase().includes(query) ||
        rule.content.toLowerCase().includes(query)
      );
    }

    setFilteredRules(filtered);
  };

  const getCategoryColor = (category) => {
    const colors = {
      INVESTMENT: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      REWARDS: 'bg-green-500/20 text-green-400 border-green-500/30',
      WITHDRAWAL: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      RANKING: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      REFERRAL: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      GENERAL: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return colors[category] || colors.GENERAL;
  };

  if (loading) return <Loading />;

  const groupedRules = filteredRules.reduce((acc, rule) => {
    if (!acc[rule.category]) {
      acc[rule.category] = [];
    }
    acc[rule.category].push(rule);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
          <FaBook className="text-blue-500" />
          Rules & Guidelines
        </h1>
      </div>

      {error && <Alert type="error" message={error} />}

      {/* Search and Filter */}
      <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)] p-6 transition-colors duration-200">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-tertiary)]" />
              <input
                type="text"
                placeholder="Search rules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] transition-colors duration-200"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] transition-colors duration-200"
            >
              {RULE_CATEGORIES.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Rules Display */}
      {filteredRules.length === 0 ? (
        <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)] p-12 text-center transition-colors duration-200">
          <FaBook className="mx-auto text-5xl text-[var(--text-muted)] mb-4" />
          <p className="text-[var(--text-tertiary)] text-lg">No rules found</p>
          <p className="text-[var(--text-muted)] text-sm mt-2">
            {searchQuery ? 'Try adjusting your search query' : 'No rules available in this category'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(groupedRules).map((category) => (
            <div key={category} className="bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)] p-6 transition-colors duration-200">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getCategoryColor(category)}`}>
                  {RULE_CATEGORIES.find(c => c.key === category)?.label || category}
                </span>
                <span className="text-[var(--text-tertiary)] text-sm">
                  ({groupedRules[category].length} {groupedRules[category].length === 1 ? 'rule' : 'rules'})
                </span>
              </h2>

              <div className="space-y-4">
                {groupedRules[category].map((rule) => (
                  <div
                    key={rule.id}
                    className="bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)] p-4 hover:border-[#00ADB5] transition-colors"
                  >
                    <button
                      onClick={() => setExpandedRule(expandedRule === rule.id ? null : rule.id)}
                      className="w-full text-left flex items-center justify-between"
                    >
                      <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                        <FaInfoCircle className="text-blue-400" />
                        {rule.title}
                      </h3>
                      <span className="text-[var(--text-tertiary)] text-sm">
                        {expandedRule === rule.id ? '▼' : '▶'}
                      </span>
                    </button>

                    {expandedRule === rule.id && (
                      <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                        <div className="prose prose-invert max-w-none">
                          <div className="text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                            {rule.content}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Rules;
