import React from 'react';
import { Trophy, TrendingUp, TrendingDown, Users, DollarSign } from 'lucide-react';
import { useTraders } from '../hooks/useTraders';
import { formatNumber, formatPercentage } from '../utils/format';

export const Leaderboard: React.FC = () => {
  const { traders, loading, error } = useTraders();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-red-200">
        Error loading leaderboard: {error}
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Trophy className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Trophy className="w-5 h-5 text-amber-600" />;
    return <span className="text-gray-400 font-medium">#{rank}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold gradient-text">Top Traders</h1>
        <div className="text-sm text-gray-400">
          Updated in real-time
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-primary-900/50 to-accent-900/50 backdrop-blur-sm rounded-lg p-4 border border-primary-500/20 card-hover">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-secondary-400" />
            <span className="text-sm text-gray-400">Total Volume</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            ${formatNumber(traders.reduce((sum, trader) => sum + trader.total_volume, 0))}
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-secondary-900/50 to-primary-900/50 backdrop-blur-sm rounded-lg p-4 border border-secondary-500/20 card-hover">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary-400" />
            <span className="text-sm text-gray-400">Active Traders</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {traders.length}
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-accent-900/50 to-secondary-900/50 backdrop-blur-sm rounded-lg p-4 border border-accent-500/20 card-hover">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-accent-400" />
            <span className="text-sm text-gray-400">Avg ROI</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {formatPercentage(traders.reduce((sum, trader) => sum + trader.roi, 0) / traders.length || 0)}
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-primary-900/50 to-secondary-900/50 backdrop-blur-sm rounded-lg p-4 border border-primary-500/20 card-hover">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary-400" />
            <span className="text-sm text-gray-400">Total Trades</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {formatNumber(traders.reduce((sum, trader) => sum + trader.total_trades, 0))}
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-primary-500/20 overflow-hidden card-hover">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Trader
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  ROI
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Win Rate
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Volume
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Trades
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Followers
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {traders.map((trader, index) => (
                <tr key={trader.id} className="hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRankIcon(index + 1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center overflow-hidden">
                        {trader.avatar_url ? (
                          <img src={trader.avatar_url} alt={trader.username} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-medium">
                            {trader.username.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{trader.username}</div>
                        <div className="text-xs text-gray-400">
                          {trader.wallet_address.slice(0, 6)}...{trader.wallet_address.slice(-4)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center space-x-1 ${trader.roi >= 0 ? 'text-secondary-400' : 'text-red-400'}`}>
                      {trader.roi >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="font-medium">{formatPercentage(trader.roi)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-white font-medium">{formatPercentage(trader.win_rate)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-white font-medium">${formatNumber(trader.total_volume)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-white font-medium">{formatNumber(trader.total_trades)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-white font-medium">{formatNumber(trader.followers_count)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};