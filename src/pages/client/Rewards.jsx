import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { transactionService } from "../../services/transactionService";
import { walletService } from "../../services/walletService";
import Table from "../../components/common/Table";
import StatsCard from "../../components/common/StatsCard";
import { formatCurrency } from "../../utils/formatters";
import {
  FaCoins,
  FaChartLine,
  FaGift,
  FaCrown,
  FaDollarSign,
  FaTrophy,
  FaRocket,
  FaSpinner,
} from "react-icons/fa";
import Loading from "../../components/common/Loading";
import Alert from "../../components/common/Alert";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";

const Rewards = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || 'roi';
  const [activeTab, setActiveTab] = useState(tabFromUrl); // 'roi', 'levelIncome', 'bonuses', 'royalties'
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [transferring, setTransferring] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [earnings, setEarnings] = useState(null);
  const [rewardBalance, setRewardBalance] = useState(0);
  const [transactions, setTransactions] = useState({
    roi: [],
    levelIncome: [],
    bonuses: [],
    royalties: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') || 'roi';
    setActiveTab(tabFromUrl);
  }, [searchParams]);

  useEffect(() => {
    if (activeTab) {
      loadTabData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [earningsData, balances] = await Promise.all([
        transactionService.getEarnings(),
        walletService.getBalances(),
      ]);
      setEarnings(earningsData);
      setRewardBalance(balances.reward || 0);
    } catch (err) {
      console.error("Error loading earnings:", err);
      setError(err.response?.data?.message || "Failed to load earnings data");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    navigate(`?tab=${tab}`);
  };

  const loadTabData = async () => {
    try {
      setTabLoading(true);
      let type = "";
      if (activeTab === "roi") type = "ROI";
      else if (activeTab === "levelIncome") type = "COMMISSION";
      else if (activeTab === "bonuses") type = "RANK_BONUS";
      else if (activeTab === "royalties") type = "ROYALTY";

      if (type) {
        const data = await transactionService.getTransactions({
          type,
          limit: 100,
        });
        // Handle both possible response structures
        const transactionsList = Array.isArray(data)
          ? data
          : data?.transactions || [];
        console.log(`Loaded ${activeTab} transactions:`, {
          type,
          rawData: data,
          dataStructure: Array.isArray(data) ? "array" : "object",
          transactionsCount: transactionsList.length,
          transactions: transactionsList,
        });
        setTransactions((prev) => ({
          ...prev,
          [activeTab]: transactionsList,
        }));
      }
    } catch (err) {
      console.error(`Error loading ${activeTab} data:`, err);
      setError(
        `Failed to load ${activeTab} transactions: ${err.response?.data?.message || err.message
        }`
      );
    } finally {
      setTabLoading(false);
    }
  };

  const handleTransferToDeposit = () => {
    if (rewardBalance <= 0) {
      setError("No rewards balance to transfer");
      return;
    }
    setShowTransferModal(true);
    setError("");
    setSuccess("");
  };

  const handleConfirmTransfer = async () => {
    const amountNum = parseFloat(transferAmount);

    if (!amountNum || amountNum <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (amountNum > rewardBalance) {
      setError("Insufficient rewards balance");
      return;
    }

    try {
      setTransferring(true);
      setError("");
      setSuccess("");

      await walletService.transfer("REWARD", "DEPOSIT", amountNum);
      setSuccess(
        `Successfully transferred ${formatCurrency(
          amountNum
        )} RISE to Deposit Wallet!`
      );
      setShowTransferModal(false);
      setTransferAmount("");
      await fetchData(); // Refresh balances
    } catch (err) {
      setError(err.response?.data?.message || "Failed to transfer funds");
    } finally {
      setTransferring(false);
    }
  };

  if (loading) return <Loading />;

  const breakdown = earnings?.breakdown || {};
  const totalROI = parseFloat(breakdown.ROI?.total || 0);
  const totalCommission = parseFloat(breakdown.COMMISSION?.total || 0);
  const totalRankBonus = parseFloat(breakdown.RANK_BONUS?.total || 0);
  const totalRoyalty = parseFloat(breakdown.ROYALTY?.total || 0);
  const totalEarnings =
    totalROI + totalCommission + totalRankBonus + totalRoyalty;

  const columns = [
    {
      header: "Date",
      accessor: "createdAt",
      render: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
    },
    {
      header: "Amount",
      accessor: "amount",
      render: (value) => formatCurrency(parseFloat(value || 0)),
    },
    {
      header: "Description",
      accessor: "description",
      render: (value) => value || "N/A",
    },
    {
      header: "Status",
      accessor: "status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium border ${value === "COMPLETED"
            ? "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30"
            : value === "PENDING"
              ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30"
              : "bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30"
            }`}
        >
          {value || "N/A"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Rewards</h1>
      </div>

      {error && <Alert type="error" message={error} />}

      {/* Total Earnings Overview */}
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-[var(--text-tertiary)] text-sm mb-1">Total Earnings</p>
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-2">
              {formatCurrency(totalEarnings)}
            </h2>
            <p className="text-[var(--text-tertiary)] text-sm">
              Available in Rewards Wallet:{" "}
              <span className="text-green-400 font-semibold">
                {formatCurrency(rewardBalance)} RISE
              </span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleTransferToDeposit}
              disabled={transferring || rewardBalance <= 0}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {transferring ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Transferring...
                </>
              ) : (
                <>
                  <FaRocket />
                  Transfer to Deposit Wallet
                </>
              )}
            </button>
            <FaDollarSign className="text-5xl text-green-400 opacity-50" />
          </div>
        </div>
      </div>

      {/* Earnings Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="ROI Earnings"
          value={formatCurrency(totalROI)}
          icon={FaChartLine}
          color="blue"
        />
        <StatsCard
          title="Level Income"
          value={formatCurrency(totalCommission)}
          icon={FaCoins}
          color="green"
        />
        <StatsCard
          title="Bonuses"
          value={formatCurrency(totalRankBonus)}
          icon={FaGift}
          color="yellow"
        />
        <StatsCard
          title="Royalties"
          value={formatCurrency(totalRoyalty)}
          icon={FaCrown}
          color="purple"
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-[var(--border-color)]">
        <button
          onClick={() => handleTabChange("roi")}
          className={`px-6 py-3 font-semibold transition-colors ${activeTab === "roi"
            ? "text-[#00ADB5] border-b-2 border-[#00ADB5]"
            : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            }`}
        >
          <FaChartLine className="inline mr-2" />
          ROI
        </button>
        <button
          onClick={() => handleTabChange("levelIncome")}
          className={`px-6 py-3 font-semibold transition-colors ${activeTab === "levelIncome"
            ? "text-[#00ADB5] border-b-2 border-[#00ADB5]"
            : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            }`}
        >
          <FaCoins className="inline mr-2" />
          Level Income
        </button>
        <button
          onClick={() => handleTabChange("bonuses")}
          className={`px-6 py-3 font-semibold transition-colors ${activeTab === "bonuses"
            ? "text-[#00ADB5] border-b-2 border-[#00ADB5]"
            : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            }`}
        >
          <FaGift className="inline mr-2" />
          Bonuses
        </button>
        <button
          onClick={() => handleTabChange("royalties")}
          className={`px-6 py-3 font-semibold transition-colors ${activeTab === "royalties"
            ? "text-[#00ADB5] border-b-2 border-[#00ADB5]"
            : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            }`}
        >
          <FaCrown className="inline mr-2" />
          Royalties
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)] p-6 transition-colors duration-200">
        {activeTab === "roi" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <FaChartLine className="text-blue-500" />
                ROI Earnings
              </h2>
              <span className="text-[var(--text-tertiary)] text-sm">
                Total: {formatCurrency(totalROI)}
              </span>
            </div>
            {transactions.roi && transactions.roi.length > 0 ? (
              <Table columns={columns} data={transactions.roi} />
            ) : (
              <div className="text-center py-8 text-[var(--text-tertiary)]">
                <p>No ROI earnings yet</p>
              </div>
            )}
          </>
        )}

        {!tabLoading && activeTab === "levelIncome" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <FaCoins className="text-green-500" />
                Level Income (Commissions)
              </h2>
              <span className="text-[var(--text-tertiary)] text-sm">
                Total: {formatCurrency(totalCommission)}
              </span>
            </div>
            {transactions.levelIncome && transactions.levelIncome.length > 0 ? (
              <Table columns={columns} data={transactions.levelIncome} />
            ) : (
              <div className="text-center py-8 text-[var(--text-tertiary)]">
                <p>No level income yet</p>
              </div>
            )}
          </>
        )}

        {!tabLoading && activeTab === "bonuses" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <FaGift className="text-yellow-500" />
                Rank Bonuses
              </h2>
              <span className="text-[var(--text-tertiary)] text-sm">
                Total: {formatCurrency(totalRankBonus)}
              </span>
            </div>
            {transactions.bonuses && transactions.bonuses.length > 0 ? (
              <Table columns={columns} data={transactions.bonuses} />
            ) : (
              <div className="text-center py-8 text-[var(--text-tertiary)]">
                <FaTrophy className="mx-auto text-5xl text-[var(--text-muted)] mb-4" />
                <p>No rank bonuses yet</p>
                <p className="text-sm mt-2">
                  Achieve higher ranks to earn bonuses!
                </p>
              </div>
            )}
          </>
        )}

        {!tabLoading && activeTab === "royalties" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <FaCrown className="text-purple-500" />
                Royalties
              </h2>
              <span className="text-[var(--text-tertiary)] text-sm">
                Total: {formatCurrency(totalRoyalty)}
              </span>
            </div>
            {transactions.royalties && transactions.royalties.length > 0 ? (
              <Table columns={columns} data={transactions.royalties} />
            ) : (
              <div className="text-center py-8 text-[var(--text-tertiary)]">
                <FaCrown className="mx-auto text-5xl text-[var(--text-muted)] mb-4" />
                <p>No royalties yet</p>
                <p className="text-sm mt-2">
                  Earn royalties based on your rank and team performance
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Transfer Modal */}
      <Modal
        isOpen={showTransferModal}
        onClose={() => {
          setShowTransferModal(false);
          setTransferAmount("");
          setError("");
        }}
        title="Transfer to Deposit Wallet"
      >
        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-sm text-blue-400 mb-2">Available Balance:</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {formatCurrency(rewardBalance)} RISE
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Transfer Amount (RISE)
            </label>
            <input
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="Enter amount to transfer"
              className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              min="0.01"
              step="0.01"
              max={rewardBalance}
              disabled={transferring}
            />
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              Maximum: {formatCurrency(rewardBalance)} RISE
            </p>
          </div>

          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}

          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowTransferModal(false);
                setTransferAmount("");
                setError("");
              }}
              disabled={transferring}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmTransfer}
              disabled={
                transferring ||
                !transferAmount ||
                parseFloat(transferAmount) <= 0
              }
            >
              {transferring ? (
                <>
                  <FaSpinner className="animate-spin inline mr-2" />
                  Transferring...
                </>
              ) : (
                "Confirm Transfer"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Rewards;
