import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Copy, Users, TrendingUp, Zap, Settings, AlertTriangle, Play, Pause, Activity, DollarSign } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useFollows } from '../hooks/useFollows';
import { useTrades } from '../hooks/useTrades';
import { CopyTradeModal } from './CopyTradeModal';
import { formatNumber, formatPercentage, formatDate } from '../utils/format';

interface LiveTrade {
  id: string;
  trader_id: string;
  trader_username: string;
  trader_avatar?: string;
  input_token: string;
  output_token: string;
  input_amount: number;
  output_amount: number;
  signature: string;
  timestamp: Date;
  pnl?: number;
  followers_copying: number;
  trade_type: 'buy' | 'sell';
}

export const CopyTradingHub: React.FC = () => {
  const { connected } = useWallet();
  const { user } = useAuth();
  const { follows } = useFollows(user?.id);
  const { trades: allTrades } = useTrades();
  
  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  const [autoCopyEnabled, setAutoCopyEnabled] = useState(false);
  const [copyAmount, setCopyAmount] = useState('');
  const [selectedTrader, setSelectedTrader] = useState('all');
  const [liveTrading, setLiveTrading] = useState(true);
  const [liveTrades, setLiveTrades] = useState<LiveTrade[]>([]);
  const [copiedTrades, setCopiedTrades] = useState<string[]>([]);

  // Mock live trades data - in production this would come from real-time subscriptions
  useEffect(() => {
    if (!liveTrading) return;

    const generateLiveTrade = (): LiveTrade => {
      const traders = [
        { id: '1', username: 'CryptoKing', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150' },
        { id: '2', username: 'DeFiMaster', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150' },
        { id: '3', username: 'SolanaWhale', avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150' },
        { id: '4', username: 'TokenHunter', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150' }
      ];

      const tokens = ['SOL', 'USDC', 'RAY', 'JUP', 'BONK', 'ORCA', 'WIF', 'PYTH'];
      const trader = traders[Math.floor(Math.random() * traders.length)];
      const inputToken = tokens[Math.floor(Math.random() * tokens.length)];
      let outputToken = tokens[Math.floor(Math.random() * tokens.length)];
      while (outputToken === inputToken) {
        outputToken = tokens[Math.floor(Math.random() * tokens.length)];
      }

      const inputAmount = Math.random() * 1000 + 10;
      const outputAmount = inputAmount * (0.8 + Math.random() * 0.4);
      const tradeType = Math.random() > 0.5 ? 'buy' : 'sell';

      return {
        id: `live-${Date.now()}-${Math.random()}`,
        trader_id: trader.id,
        trader_username: trader.username,
        trader_avatar: trader.avatar,
        input_token: inputToken,
        output_token: outputToken,
        input_amount: inputAmount,
        output_amount: outputAmount,
        signature: `live-sig-${Date.now()}`,
        timestamp: new Date(),
        pnl: (Math.random() - 0.5) * 20,
        followers_copying: Math.floor(Math.random() * 50) + 5,
        trade_type: tradeType
      };
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance to generate a new trade
        const newTrade = generateLiveTrade();
        setLiveTrades(prev => [newTrade, ...prev.slice(0, 19)]); // Keep last 20 trades
      }
    }, 3000 + Math.random() * 7000); // Random interval between 3-10 seconds

    return () => clearInterval(interval);
  }, [liveTrading]);

  const handleCopyTrade = (trade: LiveTrade) => {
    setSelectedTrade({
      id: trade.id,
      trader_username: trade.trader_username,
      input_token: trade.input_token,
      output_token: trade.output_token,
      input_amount: trade.input_amount,
      output_amount: trade.output_amount,
      signature: trade.signature
    });
  };

  const handleAutoCopy = async (trade: LiveTrade) => {
    if (!user || copiedTrades.includes(trade.id)) return;

    // Simulate auto-copy execution
    setCopiedTrades(prev => [...prev, trade.id]);
    
    // In production, this would execute the actual copy trade
    console.log(`Auto-copying trade from ${trade.trader_username}: ${trade.input_amount} ${trade.input_token} → ${trade.output_token}`);
  };

  const formatTimeAgo = (timestamp: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffSeconds < 60) {
      return `${diffSeconds}s ago`;
    } else {
      return `${diffMinutes}m ago`;
    }
  };

  const followedTraderIds = follows.map(f => f.following_id);
  const filteredTrades = selectedTrader === 'all' 
    ? liveTrades 
    : liveTrades.filter(trade => trade.trader_id === selectedTrader);

  if (!connected) {
    return (
      <div className="flex items-center justify-center min-h-96 px-2">
        <div className="text-center w-full max-w-xs">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Copy className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400 text-sm">Connect your Solana wallet to access copy trading features</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Copy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Copy Trading Hub</h1>
            <p className="text-gray-400 text-sm sm:text-base">Real-time trade copying from top performers</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
          <button
            onClick={() => setLiveTrading(!liveTrading)}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm w-full sm:w-auto ${
              liveTrading 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            {liveTrading ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{liveTrading ? 'Live' : 'Paused'}</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm w-full sm:w-auto">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 backdrop-blur-sm rounded-lg p-4 border border-green-500/20">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-400">Live Trades</span>
          </div>
          <div className="text-2xl font-bold text-green-400 mt-1">
            {liveTrades.length}
          </div>
          <div className="text-xs text-green-300 mt-1">
            Last 10 minutes
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
          <div className="flex items-center space-x-2">
            <Copy className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-400">Copied Today</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {copiedTrades.length}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Auto + Manual
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-400">Following</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {follows.length}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Active traders
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 backdrop-blur-sm rounded-lg p-4 border border-amber-500/20">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-gray-400">Success Rate</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            73.2%
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Last 30 days
          </div>
        </div>
      </div>

      {/* Auto Copy Settings */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2 sm:gap-0">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white">Auto Copy Settings</h3>
            <p className="text-xs sm:text-sm text-gray-400">Configure automatic trade copying for followed traders</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer mt-2 sm:mt-0">
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
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
                  <option value="1">CryptoKing</option>
                  <option value="2">DeFiMaster</option>
                  <option value="3">SolanaWhale</option>
                  <option value="4">TokenHunter</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Trade Types
                </label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500">
                  <option value="both">Both Buy & Sell</option>
                  <option value="buy">Buy Only</option>
                  <option value="sell">Sell Only</option>
                </select>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 flex items-start space-x-2 text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-yellow-400">
                <p className="font-medium mb-1">Auto Copy Warning</p>
                <p className="text-sm">Auto copying will execute trades automatically when followed traders make moves. Ensure you have sufficient balance and understand the risks involved.</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Live Trade Feed */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2 sm:gap-0">
          <h3 className="text-base sm:text-lg font-semibold text-white flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${liveTrading ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
            Live Trade Feed
          </h3>
          <div className="text-xs sm:text-sm text-gray-400">
            {filteredTrades.length} trades • {liveTrading ? 'Live' : 'Paused'}
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredTrades.map((trade) => {
            const isAutoCopied = copiedTrades.includes(trade.id);
            const shouldAutoCopy = autoCopyEnabled && followedTraderIds.includes(trade.trader_id);

            // Auto-copy logic
            if (shouldAutoCopy && !isAutoCopied) {
              handleAutoCopy(trade);
            }

            return (
              <div key={trade.id} className={`bg-gray-800/50 rounded-lg p-3 sm:p-4 hover:bg-gray-800/70 transition-colors border-l-4 ${
                trade.trade_type === 'buy' ? 'border-green-400' : 'border-red-400'
              }`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                  <div className="flex items-center space-x-3 sm:space-x-4 w-full">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                      {trade.trader_avatar ? (
                        <img src={trade.trader_avatar} alt={trade.trader_username} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-medium text-sm">
                          {trade.trader_username.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">{trade.trader_username}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          trade.trade_type === 'buy' 
                            ? 'bg-green-900/30 text-green-400' 
                            : 'bg-red-900/30 text-red-400'
                        }`}>
                          {trade.trade_type.toUpperCase()}
                        </span>
                        {isAutoCopied && (
                          <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-1 rounded">
                            AUTO-COPIED
                          </span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400">
                        {trade.input_amount.toFixed(2)} {trade.input_token} → {trade.output_amount.toFixed(2)} {trade.output_token}
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-4 text-xs text-gray-500 mt-1">
                        <span>{formatTimeAgo(trade.timestamp)}</span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{trade.followers_copying} copying</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 sm:space-x-3 mt-2 sm:mt-0">
                    <div className="text-right">
                      {trade.pnl && (
                        <div className={`text-sm font-medium ${trade.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {trade.pnl > 0 ? '+' : ''}{trade.pnl.toFixed(1)}%
                        </div>
                      )}
                      <div className="text-xs text-gray-400">P&L</div>
                    </div>
                    {!isAutoCopied && (
                      <button
                        onClick={() => handleCopyTrade(trade)}
                        className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 sm:px-4 rounded-lg transition-colors text-xs sm:text-sm"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Copy</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredTrades.length === 0 && (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                {liveTrading ? 'Waiting for live trades...' : 'Live trading is paused'}
              </p>
            </div>
          )}
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