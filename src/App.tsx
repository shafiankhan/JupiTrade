import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletProviderComponent } from './components/WalletProvider';
import { LandingPage } from './components/LandingPage';
import { Navbar } from './components/Navbar';
import { Leaderboard } from './components/Leaderboard';
import { TradersGrid } from './components/TradersGrid';
import { Dashboard } from './components/Dashboard';
import { CopyTradingHub } from './components/CopyTradingHub';

function App() {
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLanding, setShowLanding] = useState(true);

  // Show landing page if not connected and user hasn't clicked get started
  if (!connected && showLanding) {
    return (
      <WalletProviderComponent>
        <LandingPage onGetStarted={() => setShowLanding(false)} />
      </WalletProviderComponent>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'leaderboard':
        return <Leaderboard />;
      case 'traders':
        return <TradersGrid />;
      case 'dashboard':
        return <Dashboard />;
      case 'copy-trading':
        return <CopyTradingHub />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <WalletProviderComponent>
      <div className="min-h-screen bg-gradient-dark">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>
      </div>
    </WalletProviderComponent>
  );
}

export default App;