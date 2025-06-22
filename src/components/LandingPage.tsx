import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { TrendingUp, Zap, Users, Shield, BarChart3, Copy, ArrowRight, Star, CheckCircle } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: Zap,
      title: 'Jupiter-Powered Trading',
      description: 'Best execution across 20+ DEXs with optimal routing and minimal slippage',
      color: 'from-primary-500 to-accent-500'
    },
    {
      icon: Copy,
      title: 'Social Copy Trading',
      description: 'Follow and automatically copy trades from successful traders in real-time',
      color: 'from-secondary-500 to-primary-500'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Track performance, analyze strategies, and optimize your trading approach',
      color: 'from-accent-500 to-secondary-500'
    },
    {
      icon: Shield,
      title: 'Secure & Transparent',
      description: 'Non-custodial trading with full transparency and security built-in',
      color: 'from-primary-600 to-accent-600'
    }
  ];

  const stats = [
    { label: 'Total Volume', value: '$2.5M+', icon: TrendingUp },
    { label: 'Active Traders', value: '1,200+', icon: Users },
    { label: 'Success Rate', value: '78%', icon: Star },
    { label: 'Avg ROI', value: '+156%', icon: BarChart3 }
  ];

  const testimonials = [
    {
      name: 'CryptoKing',
      role: 'Top Trader',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'JupiTrade has revolutionized how I share my strategies. The copy trading feature is seamless!',
      roi: '+245%'
    },
    {
      name: 'DeFiMaster',
      role: 'Strategy Expert',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'The Jupiter integration provides the best execution I\'ve seen. Highly recommended!',
      roi: '+189%'
    },
    {
      name: 'SolanaWhale',
      role: 'Institutional Trader',
      avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'Professional-grade tools with social features. Perfect for scaling trading strategies.',
      roi: '+312%'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center glow-cyan">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">JupiTrade</span>
            </div>
            <WalletMultiButton className="!bg-gradient-primary hover:!bg-gradient-secondary !transition-all !duration-200 !glow-cyan" />
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Trade Smarter with{' '}
                <span className="gradient-text">JupiTrade</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-4 leading-relaxed">
                The premier social trading platform for Solana
              </p>
              <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
                <p className="text-yellow-300 font-medium text-lg">
                  ⚠️ <strong>Warning:</strong> JupiTrade may cause excessive profits. 
                  Prolonged use may lead to financial happiness.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <button
                onClick={onGetStarted}
                className="bg-gradient-primary hover:bg-gradient-secondary text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 glow-cyan flex items-center space-x-2 text-lg"
              >
                <span>Start Trading</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-gray-800/50 hover:bg-gray-700/50 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 border border-primary-500/20">
                View Leaderboard
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-primary-500/20 card-hover">
                    <Icon className="w-8 h-8 text-primary-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Powered by <span className="gradient-text">Jupiter Exchange</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of social trading with cutting-edge technology and community-driven insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-primary-500/20 card-hover group">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by <span className="gradient-text">Top Traders</span>
            </h2>
            <p className="text-xl text-gray-300">
              See what successful traders are saying about JupiTrade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-primary-500/20 card-hover">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="bg-gradient-to-r from-secondary-500 to-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {testimonial.roi} ROI
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary-900/20 to-secondary-900/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to <span className="gradient-text">Maximize Your Profits?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of traders who are already earning with JupiTrade's social trading platform
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
            <button
              onClick={onGetStarted}
              className="bg-gradient-primary hover:bg-gradient-secondary text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 glow-cyan flex items-center space-x-2 text-lg"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-center space-x-6 text-gray-400">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-secondary-400" />
              <span>No fees to start</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-secondary-400" />
              <span>Non-custodial</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-secondary-400" />
              <span>Instant setup</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-gray-900/80 backdrop-blur-sm border-t border-primary-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">JupiTrade</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p className="mb-2">Powered by Jupiter Exchange • Built on Solana</p>
              <p className="text-sm">© 2024 JupiTrade. Trade responsibly.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};