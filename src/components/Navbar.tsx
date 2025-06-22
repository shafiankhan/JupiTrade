import React, { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { TrendingUp, Users, BarChart3, Copy, Menu, X } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const tabs = [
    { id: 'leaderboard', label: 'Leaderboard', icon: TrendingUp },
    { id: 'traders', label: 'Traders', icon: Users },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'copy-trading', label: 'Copy Trading', icon: Copy },
  ];

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-primary-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex flex-wrap items-center justify-between h-16 gap-y-2">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center glow-cyan">
              {/* Changed from <TrendingUp ... /> to "JT" */}
              <span className="text-white font-bold text-lg">JT</span>
            </div>
            <span className="text-base sm:text-lg md:text-xl font-bold gradient-text">JupiTrade</span>
          </div>
          {/* Desktop Tabs */}
          <div className="hidden md:flex items-center space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 text-xs sm:text-sm md:text-base ${
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
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 focus:outline-none"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <WalletMultiButton className="!bg-gradient-primary hover:!bg-gradient-secondary !transition-all !duration-200 !glow-cyan text-xs sm:text-sm md:text-base px-2 py-1 sm:px-4 sm:py-2 rounded-lg" />
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 border-b border-primary-500/20 px-2 pb-4 animate-fade-in">
          <div className="flex flex-col space-y-1 sm:space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 w-full text-left text-xs sm:text-sm ${
                    activeTab === tab.id
                      ? 'bg-gradient-primary text-white glow-cyan'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};