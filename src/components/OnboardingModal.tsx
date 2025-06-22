import React, { useState } from 'react';
import { User, Zap, TrendingUp, Users } from 'lucide-react';

interface OnboardingModalProps {
  walletAddress: string;
  onComplete: (username: string) => void;
  onSkip: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  walletAddress,
  onComplete,
  onSkip
}) => {
  const [username, setUsername] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (username.trim()) {
        setLoading(true);
        onComplete(username.trim());
      }
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  const generateSuggestions = () => {
    const prefixes = ['Trader', 'Crypto', 'Sol', 'DeFi', 'Whale'];
    const suffixes = ['Master', 'Pro', 'King', 'Ninja', 'Wizard'];
    const numbers = Math.floor(Math.random() * 999) + 1;
    
    return [
      `${prefixes[Math.floor(Math.random() * prefixes.length)]}${numbers}`,
      `${suffixes[Math.floor(Math.random() * suffixes.length)]}${walletAddress.slice(-3)}`,
      `Sol${suffixes[Math.floor(Math.random() * suffixes.length)]}`
    ];
  };

  const suggestions = generateSuggestions();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg border border-gray-800 max-w-lg w-full">
        {step === 1 ? (
          // Welcome Step
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-4">
              Welcome to SolTrade!
            </h1>
            
            <p className="text-gray-300 mb-8 leading-relaxed">
              The premier social trading platform for Solana. Follow top traders, 
              copy their strategies, and build your portfolio with Jupiter's powerful APIs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <h3 className="text-white font-medium mb-1">Smart Trading</h3>
                <p className="text-gray-400 text-sm">Jupiter-powered swaps with optimal routing</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <h3 className="text-white font-medium mb-1">Social Features</h3>
                <p className="text-gray-400 text-sm">Follow and copy successful traders</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <h3 className="text-white font-medium mb-1">Analytics</h3>
                <p className="text-gray-400 text-sm">Track performance and optimize strategies</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSkip}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors"
              >
                Skip Setup
              </button>
              <button
                onClick={handleContinue}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-6 rounded-lg transition-all duration-200"
              >
                Get Started
              </button>
            </div>
          </div>
        ) : (
          // Username Step
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Choose Your Username</h2>
              <p className="text-gray-400">
                This is how other traders will see you on the platform
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  maxLength={30}
                  autoFocus
                />
                <p className="text-xs text-gray-400 mt-1">
                  {username.length}/30 characters • Letters, numbers, and underscores only
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setUsername(suggestion)}
                      className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-md text-sm transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                <p className="text-blue-300 text-sm">
                  💡 <strong>Tip:</strong> Choose a memorable username that represents your trading style. 
                  You can always change it later in your profile settings.
                </p>
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
              <button
                onClick={handleSkip}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors"
              >
                Use Default
              </button>
              <button
                onClick={handleContinue}
                disabled={!username.trim() || loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating Profile...</span>
                  </>
                ) : (
                  <span>Complete Setup</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};