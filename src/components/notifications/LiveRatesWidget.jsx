import { useState, useEffect } from 'react';
import { rateService } from '../../services/rateService';
import { FaSync, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import Loading from '../common/Loading';

const LiveRatesWidget = () => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRates = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      const data = await rateService.getLiveRates();
      setRates(data);
    } catch (error) {
      console.error('Error fetching rates:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRates();
    // Refresh every 5 minutes
    const interval = setInterval(() => fetchRates(), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-[#393E46] rounded-lg border border-[#4b5563] p-4">
        <Loading />
      </div>
    );
  }

  if (!rates) return null;

  const RateCard = ({ symbol, price, change24h }) => {
    const isPositive = change24h >= 0;
    const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
    const ChangeIcon = isPositive ? FaArrowUp : FaArrowDown;

    return (
      <div className="bg-[#222831] rounded-lg p-4 border border-[#4b5563]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm font-medium">{symbol}</span>
          <button
            onClick={() => fetchRates(true)}
            disabled={refreshing}
            className="text-gray-400 hover:text-[#00ADB5] transition-colors disabled:opacity-50"
          >
            <FaSync className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="text-white text-xl font-bold mb-1">
          ${parseFloat(price).toFixed(4)}
        </div>
        <div className={`flex items-center gap-1 text-xs ${changeColor}`}>
          <ChangeIcon className="w-3 h-3" />
          <span>{Math.abs(change24h).toFixed(2)}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#393E46] rounded-lg border border-[#4b5563] p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Live Rates</h3>
        <span className="text-xs text-gray-400">Updates every 5 min</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <RateCard symbol="USDT" price={rates.usdt.price} change24h={rates.usdt.change24h} />
        <RateCard symbol="GRT" price={rates.grt.price} change24h={rates.grt.change24h} />
        <RateCard symbol="FLUFFY" price={rates.fluffy.price} change24h={rates.fluffy.change24h} />
      </div>
    </div>
  );
};

export default LiveRatesWidget;

