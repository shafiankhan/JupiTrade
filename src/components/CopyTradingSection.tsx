import React, { useState } from 'react';
import { Copy, Users, TrendingUp, Zap, Settings, AlertTriangle } from 'lucide-react';
import { CopyTradeModal } from './CopyTradeModal';

interface CopyTradingSectionProps {
  className?: string;
}

export const CopyTradingSection: React.FC<CopyTradingSectionProps> = ({ className = '' }) => {
  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  const [autoCopyEnabled, setAutoCopyEnabled] = useState(false);
  const [copyAmount, setCopyAmount] = useState('');
  const [selectedTrader, setSelectedTrader] = useState('all');

  // Mock recent copyable trades
  const recentTrades = [
    {
      id: '1',
      trader_username: 'CryptoKing',
      trader_roi: 156.8,
      input_token: 'SOL',
      output_token: 'USDC',
      input_amount: 25.5,
      output_amount: 5840.25,
      signature: 'mock-signature-1',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      pnl: 12.5,
      followers_copying: 23
    },
    {
      id: '2',
      trader_username: 'DeFiMaster',
      trader_roi: 189.3,
      input_token: 'USDC',
      output_token: 'RAY',
      input_amount: 2000,
      output_amount: 952.38,
      signature: 'mock-signature-2',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      pnl: 8.9,
      followers_copying: 45
    },
    {
      id: '3',
      trader_username: 'SolanaWhale',
      trader_roi: 234.1,
      input_token: 'RAY',
      output_token: 'JUP',
      input_amount: 500,
      output_amount: 1250,
      signature: 'mock-signature-3',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      pnl: 15.2,
      followers_copying: 67
    },
    {
      id: '4',
      trader_username: 'TokenHunter',
      trader_roi: 145.7,
      input_token: 'BONK',
      output_token: 'SOL',
      input_amount: 1000000,
      output_amount: 2.1,
      signature: 'mock-signature-4',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      pnl: -2.3,
      followers_copying: 12
    }
  ];

  const topTraders = [
    { username: 'CryptoKing', roi: 156.8, followers: 1247 },
    { username: 'DeFiMaster', roi: 189.3, followers: 892 },
    { username: 'SolanaWhale', roi: 234.1, followers: 2104 },
    { username: 'TokenHunter', roi: 145.7, followers: 567 }
  ];

  const handleCopyTrade = (trade: any) => {
    setSelectedTrade(trade);
  };

  const formatTimeAgo = (timestamp: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return `${diffMinutes}m ago`;
    }
  };

  const filteredTrades = selectedTrader === 'all' 
    ? recentTrades 
    : recentTrades.filter(trade => trade.trader_username === selectedTrader);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Copy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Copy Trading</h2>
            <p className="text-gray-400">Follow and copy successful traders automatically</p>
          </div>
        </div>
        <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>

      {/* Auto Copy Settings */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Auto Copy Settings</h3>
            <p className="text-sm text-gray-400">Configure automatic trade copying</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoCopyEnabled}
              onChange={(e) => setAutoCopyEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {autoCopyEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Default Copy Amount (SOL)
              </label>
              <input
                type="number"
                value={copyAmount}
                onChange={(e) => setCopyAmount(e.target.value)}
                placeholder="1.0"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Copy From Trader
              </label>
              <select
                value={selectedTrader}
                onChange={(e) => setSelectedTrader(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Followed Traders</option>
                {topTraders.map(trader => (
                  <option key={trader.username} value={trader.username}>
                    {trader.username} (+{trader.roi.toFixed(1)}% ROI)
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {autoCopyEnabled && (
          <div className="mt-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-yellow-400 text-sm">
              <p className="font-medium mb-1">Auto Copy Warning</p>
              <p>Auto copying will execute trades automatically. Ensure you have sufficient balance and understand the risks involved.</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Copyable Trades */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Copyable Trades</h3>
          <div className="text-sm text-gray-400">
            {filteredTrades.length} trades available
          </div>
        </div>

        <div className="space-y-3">
          {filteredTrades.map((trade) => (
            <div key={trade.id} className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800/70 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {trade.trader_username.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{trade.trader_username}</span>
                      <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">
                        +{trade.trader_roi}% ROI
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {trade.input_amount} {trade.input_token} → {trade.output_amount} {trade.output_token}
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span>{formatTimeAgo(trade.timestamp)}</span>
                      <span className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{trade.followers_copying} copying</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className={`text-sm font-medium ${trade.pnl && trade.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {trade.pnl && trade.pnl > 0 ? '+' : ''}{trade.pnl}%
                    </div>
                    <div className="text-xs text-gray-400">P&L</div>
                  </div>
                  <button
                    onClick={() => handleCopyTrade(trade)}
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Traders to Follow */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top Traders to Follow</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topTraders.map((trader) => (
            <div key={trader.username} className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {trader.username.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="text-white font-medium">{trader.username}</div>
                  <div className="text-sm text-gray-400">{trader.followers} followers</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{trader.roi}%
                </div>
                <div className="text-xs text-gray-400">ROI</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Copy Trade Modal */}
      {selectedTrade && (
        <CopyTradeModal
          isOpen={!!selectedTrade}
          onClose={() => setSelectedTrade(null)}
          trade={selectedTrade}
          onCopyComplete={(signature) => {
            console.log('Copy trade completed:', signature);
            setSelectedTrade(null);
          }}
        />
      )}
    </div>
  );
};