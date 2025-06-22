import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { TrendingUp, TrendingDown, Copy, Users, DollarSign, Activity, Zap } from 'lucide-react';
import { formatNumber, formatPercentage } from '../utils/format';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { JupiterSwapWidget } from './JupiterSwapWidget';
import { TokenPriceWidget } from './TokenPriceWidget';
import { CopyTradingSection } from './CopyTradingSection';
import { CopyTradeModal } from './CopyTradeModal';
import { OnboardingModal } from './OnboardingModal';
import { useAuth } from '../hooks/useAuth';

export const Dashboard: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const { user, loading: authLoading, showOnboarding, createUserWithUsername, skipOnboarding } = useAuth();
  const [copyTradeModal, setCopyTradeModal] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<'overview' | 'copy-trading'>('overview');

  if (!connected) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 glow-cyan">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400">Connect your Solana wallet to view your trading dashboard</p>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Show onboarding modal for new users
  if (showOnboarding && publicKey) {
    return (
      <OnboardingModal
        walletAddress={publicKey.toString()}
        onComplete={createUserWithUsername}
        onSkip={skipOnboarding}
      />
    );
  }

  // Mock user data
  const userData = {
    totalPnl: 1250.50,
    totalVolume: 45000,
    totalTrades: 127,
    winRate: 68.5,
    followingCount: 12,
    copiedTrades: 34,
    roi: 15.8
  };

  const portfolioData = [
    { date: '2024-01', value: 10000 },
    { date: '2024-02', value: 12500 },
    { date: '2024-03', value: 11800 },
    { date: '2024-04', value: 15200 },
    { date: '2024-05', value: 18900 },
    { date: '2024-06', value: 22300 },
  ];

  const tokenAllocation = [
    { name: 'SOL', value: 35, color: '#06b6d4' },
    { name: 'USDC', value: 25, color: '#14b8a6' },
    { name: 'RAY', value: 20, color: '#22c55e' },
    { name: 'ORCA', value: 12, color: '#4ade80' },
    { name: 'Others', value: 8, color: '#86efac' },
  ];

  const recentTrades = [
    { 
      id: 1, 
      type: 'swap', 
      from: 'SOL', 
      to: 'USDC', 
      amount: 2.5, 
      pnl: 12.5, 
      time: '2 hours ago',
      trader_username: 'You'
    },
    { 
      id: 2, 
      type: 'copy', 
      from: 'USDC', 
      to: 'RAY', 
      amount: 500, 
      pnl: -3.2, 
      time: '5 hours ago', 
      trader_username: 'CryptoKing'
    },
    { 
      id: 3, 
      type: 'swap', 
      from: 'RAY', 
      to: 'SOL', 
      amount: 150, 
      pnl: 8.9, 
      time: '1 day ago',
      trader_username: 'You'
    },
  ];

  const followedTraders = [
    { name: 'CryptoKing', roi: 23.5, followers: 1247, copying: true },
    { name: 'SolanaWhale', roi: 18.2, followers: 892, copying: false },
    { name: 'DeFiMaster', roi: 31.8, followers: 2104, copying: true },
  ];

  const handleSwapComplete = (signature: string, inputToken: string, outputToken: string, inputAmount: number, outputAmount: number) => {
    console.log('Swap completed:', { signature, inputToken, outputToken, inputAmount, outputAmount });
    // Here you would typically update the user's trade history in Supabase
  };

  const handleCopyTrade = (trade: any) => {
    setCopyTradeModal({
      id: trade.id.toString(),
      trader_username: trade.trader_username,
      input_token: trade.from, // Map 'from' to 'input_token'
      output_token: trade.to,   // Map 'to' to 'output_token'
      input_amount: trade.amount,
      output_amount: trade.amount * 1.1, // Mock output amount
      signature: 'mock-signature'
    });
  };

  return (
    <div className="space-y-6 px-2 sm:px-4 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Dashboard</h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-2 sm:gap-0">
          <div className="flex bg-gray-800/50 rounded-lg p-1 border border-primary-500/20">
            <button
              onClick={() => setActiveSection('overview')}
              className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                activeSection === 'overview'
                  ? 'bg-gradient-primary text-white glow-cyan'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection('copy-trading')}
              className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                activeSection === 'copy-trading'
                  ? 'bg-gradient-primary text-white glow-cyan'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Copy Trading
            </button>
          </div>
          <div className="text-xs sm:text-sm text-gray-400">
            Welcome back, {user?.username || `${publicKey?.toString().slice(0, 6)}...${publicKey?.toString().slice(-4)}`}
          </div>
        </div>
      </div>

      {activeSection === 'copy-trading' ? (
        <CopyTradingSection />
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 backdrop-blur-sm rounded-lg p-4 border border-secondary-500/20 card-hover glow-green">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-secondary-400" />
                <span className="text-sm text-gray-400">Total P&L</span>
              </div>
              <div className="text-2xl font-bold text-secondary-400 mt-1">
                +${formatNumber(userData.totalPnl)}
              </div>
              <div className="text-xs text-secondary-300 mt-1">
                {formatPercentage(userData.roi)} ROI
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 backdrop-blur-sm rounded-lg p-4 border border-primary-500/20 card-hover glow-cyan">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-primary-400" />
                <span className="text-sm text-gray-400">Total Volume</span>
              </div>
              <div className="text-2xl font-bold text-white mt-1">
                ${formatNumber(userData.totalVolume)}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {userData.totalTrades} trades
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-teal-900/50 to-cyan-900/50 backdrop-blur-sm rounded-lg p-4 border border-accent-500/20 card-hover glow-accent">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-accent-400" />
                <span className="text-sm text-gray-400">Win Rate</span>
              </div>
              <div className="text-2xl font-bold text-white mt-1">
                {formatPercentage(userData.winRate)}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Last 30 days
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-900/50 to-green-900/50 backdrop-blur-sm rounded-lg p-4 border border-secondary-500/20 card-hover glow-green">
              <div className="flex items-center space-x-2">
                <Copy className="w-5 h-5 text-secondary-400" />
                <span className="text-sm text-gray-400">Copied Trades</span>
              </div>
              <div className="text-2xl font-bold text-white mt-1">
                {userData.copiedTrades}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Following {userData.followingCount}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Jupiter Swap Widget */}
            <div className="lg:col-span-1">
              <JupiterSwapWidget onSwapComplete={handleSwapComplete} />
            </div>

            {/* Token Prices */}
            <div className="lg:col-span-1">
              <TokenPriceWidget />
            </div>

            {/* Portfolio Performance */}
            <div className="lg:col-span-1 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-primary-500/20 p-4 sm:p-6 card-hover">
              <h3 className="text-lg font-semibold text-white mb-4">Portfolio Performance</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={portfolioData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #06b6d4',
                        borderRadius: '8px'
                      }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="url(#gradient)" 
                      strokeWidth={3}
                      dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#22c55e" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Recent Trades */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-primary-500/20 p-4 sm:p-6 card-hover">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Trades</h3>
              <div className="space-y-3">
                {recentTrades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3 border border-accent-500/10">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        trade.type === 'copy' ? 'bg-gradient-primary' : 'bg-gradient-secondary'
                      }`}>
                        {trade.type === 'copy' ? <Copy className="w-4 h-4 text-white" /> : <Activity className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {trade.from} → {trade.to}
                        </div>
                        <div className="text-sm text-gray-400">
                          {trade.type === 'copy' && trade.trader_username !== 'You' && `Copied from ${trade.trader_username} • `}
                          {trade.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex items-center space-x-2">
                      <div>
                        <div className="text-white font-medium">
                          {trade.amount} {trade.from}
                        </div>
                        <div className={`text-sm ${trade.pnl > 0 ? 'text-secondary-400' : 'text-red-400'}`}>
                          {trade.pnl > 0 ? '+' : ''}{trade.pnl}%
                        </div>
                      </div>
                      {trade.type !== 'copy' && (
                        <button
                          onClick={() => handleCopyTrade(trade)}
                          className="text-primary-400 hover:text-primary-300 transition-colors"
                          title="Copy this trade"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Followed Traders */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-primary-500/20 p-4 sm:p-6 card-hover">
              <h3 className="text-lg font-semibold text-white mb-4">Followed Traders</h3>
              <div className="space-y-3">
                {followedTraders.map((trader) => (
                  <div key={trader.name} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3 border border-accent-500/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {trader.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{trader.name}</div>
                        <div className="text-sm text-gray-400">
                          {formatNumber(trader.followers)} followers
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-secondary-400 font-medium">
                        +{formatPercentage(trader.roi)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {trader.copying ? 'Auto-copying' : 'Following'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Copy Trade Modal */}
      {copyTradeModal && (
        <CopyTradeModal
          isOpen={!!copyTradeModal}
          onClose={() => setCopyTradeModal(null)}
          trade={copyTradeModal}
          onCopyComplete={(signature) => {
            console.log('Copy trade completed:', signature);
            setCopyTradeModal(null);
          }}
        />
      )}
    </div>
  );
};