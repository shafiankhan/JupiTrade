import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { TrendingUp, Users, BarChart3, Copy } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'leaderboard', label: 'Leaderboard', icon: TrendingUp },
    { id: 'traders', label: 'Traders', icon: Users },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'copy-trading', label: 'Copy Trading', icon: Copy },
  ];

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-primary-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center glow-cyan">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">JupiTrade</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-primary text-white glow-cyan'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <WalletMultiButton className="!bg-gradient-primary hover:!bg-gradient-secondary !transition-all !duration-200 !glow-cyan" />
          </div>
        </div>
      </div>
    </nav>
  );
};