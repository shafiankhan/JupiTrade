import React, { useState } from 'react';
import { Search, Filter, UserPlus, TrendingUp, TrendingDown, UserCheck } from 'lucide-react';
import { useTraders } from '../hooks/useTraders';
import { useFollows } from '../hooks/useFollows';
import { useAuth } from '../hooks/useAuth';
import { TraderProfile } from './TraderProfile';
import { formatNumber, formatPercentage } from '../utils/format';

export const TradersGrid: React.FC = () => {
  const { traders, loading, error } = useTraders();
  const { user } = useAuth();
  const { followTrader, unfollowTrader, isFollowing } = useFollows(user?.id);
  const [selectedTrader, setSelectedTrader] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('roi');
  const [followingLoading, setFollowingLoading] = useState<string | null>(null);

  const handleQuickFollow = async (e: React.MouseEvent, traderId: string) => {
    e.stopPropagation();
    if (!user) return;

    setFollowingLoading(traderId);
    try {
      if (isFollowing(traderId)) {
        await unfollowTrader(user.id, traderId);
      } else {
        await followTrader(user.id, traderId);
      }
    } catch (err) {
      console.error('Follow error:', err);
    } finally {
      setFollowingLoading(null);
    }
  };

  const filteredTraders = traders
    .filter(trader => 
      trader.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trader.wallet_address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'roi':
          return b.roi - a.roi;
        case 'volume':
          return b.total_volume - a.total_volume;
        case 'followers':
          return b.followers_count - a.followers_count;
        case 'win_rate':
          return b.win_rate - a.win_rate;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-red-200">
        Error loading traders: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Discover Traders</h1>
        <div className="text-xs sm:text-sm text-gray-400">
          {filteredTraders.length} traders found
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search traders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="pl-10 pr-8 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 appearance-none text-sm"
          >
            <option value="roi">Sort by ROI</option>
            <option value="volume">Sort by Volume</option>
            <option value="followers">Sort by Followers</option>
            <option value="win_rate">Sort by Win Rate</option>
          </select>
        </div>
      </div>

      {/* Traders Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredTraders.map((trader) => (
          <div
            key={trader.id}
            className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 p-4 sm:p-6 hover:border-purple-500/50 transition-all duration-200 cursor-pointer"
            onClick={() => setSelectedTrader(trader)}
          >
            <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                {trader.avatar_url ? (
                  <img src={trader.avatar_url} alt={trader.username} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-lg">
                    {trader.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-white">{trader.username}</h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  {trader.wallet_address.slice(0, 6)}...{trader.wallet_address.slice(-4)}
                </p>
              </div>
              {user && user.id !== trader.id && (
                <button 
                  onClick={(e) => handleQuickFollow(e, trader.id)}
                  disabled={followingLoading === trader.id}
                  className={`transition-colors p-2 rounded-lg text-xs sm:text-base ${
                    isFollowing(trader.id)
                      ? 'text-green-400 hover:text-green-300'
                      : 'text-purple-400 hover:text-purple-300'
                  }`}
                >
                  {followingLoading === trader.id ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                  ) : isFollowing(trader.id) ? (
                    <UserCheck className="w-5 h-5" />
                  ) : (
                    <UserPlus className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>

            {trader.bio && (
              <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{trader.bio}</p>
            )}

            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
              <div className="text-center">
                <div className={`text-lg font-bold ${trader.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {trader.roi >= 0 ? <TrendingUp className="w-4 h-4 inline mr-1" /> : <TrendingDown className="w-4 h-4 inline mr-1" />}
                  {formatPercentage(trader.roi)}
                </div>
                <div className="text-xs text-gray-400">ROI</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">{formatPercentage(trader.win_rate)}</div>
                <div className="text-xs text-gray-400">Win Rate</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-white">${formatNumber(trader.total_volume)}</div>
                <div className="text-xs text-gray-400">Volume</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">{formatNumber(trader.followers_count)}</div>
                <div className="text-xs text-gray-400">Followers</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm text-gray-400 gap-1 sm:gap-0">
              <span>{formatNumber(trader.total_trades)} trades</span>
              <span>Joined {new Date(trader.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedTrader && (
        <TraderProfile
          trader={selectedTrader}
          onClose={() => setSelectedTrader(null)}
        />
      )}
    </div>
  );
};