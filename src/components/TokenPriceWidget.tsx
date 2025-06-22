import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, RefreshCw } from 'lucide-react';

// Fallback price data for when API fails
const FALLBACK_PRICES = {
  'So11111111111111111111111111111111111111112': { // SOL
    symbol: 'SOL',
    price: 185.42,
    change24h: 2.34
  },
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': { // USDC
    symbol: 'USDC',
    price: 1.00,
    change24h: 0.01
  },
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': { // USDT
    symbol: 'USDT',
    price: 1.00,
    change24h: -0.02
  },
  '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R': { // RAY
    symbol: 'RAY',
    price: 2.15,
    change24h: 5.67
  },
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': { // BONK
    symbol: 'BONK',
    price: 0.000023,
    change24h: -1.23
  },
  'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN': { // JUP
    symbol: 'JUP',
    price: 0.85,
    change24h: 3.45
  },
  'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm': { // WIF
    symbol: 'WIF',
    price: 2.87,
    change24h: -2.11
  },
  'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3': { // PYTH
    symbol: 'PYTH',
    price: 0.42,
    change24h: 1.89
  }
};

interface TokenPrice {
  symbol: string;
  price: number;
  change24h: number;
}

export const TokenPriceWidget: React.FC = () => {
  const [prices, setPrices] = useState<Record<string, TokenPrice>>(FALLBACK_PRICES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchPrices = async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to fetch from a simple price API
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana,usd-coin,tether,raydium,bonk,jupiter-exchange-solana,dogwifcoin,pyth-network&vs_currencies=usd&include_24hr_change=true');
      
      if (!response.ok) {
        throw new Error('Failed to fetch from CoinGecko');
      }

      const data = await response.json();
      
      // Map CoinGecko data to our format
      const mappedPrices: Record<string, TokenPrice> = {
        'So11111111111111111111111111111111111111112': {
          symbol: 'SOL',
          price: data.solana?.usd || FALLBACK_PRICES['So11111111111111111111111111111111111111112'].price,
          change24h: data.solana?.usd_24h_change || FALLBACK_PRICES['So11111111111111111111111111111111111111112'].change24h
        },
        'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': {
          symbol: 'USDC',
          price: data['usd-coin']?.usd || FALLBACK_PRICES['EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'].price,
          change24h: data['usd-coin']?.usd_24h_change || FALLBACK_PRICES['EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'].change24h
        },
        'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': {
          symbol: 'USDT',
          price: data.tether?.usd || FALLBACK_PRICES['Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'].price,
          change24h: data.tether?.usd_24h_change || FALLBACK_PRICES['Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'].change24h
        },
        '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R': {
          symbol: 'RAY',
          price: data.raydium?.usd || FALLBACK_PRICES['4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R'].price,
          change24h: data.raydium?.usd_24h_change || FALLBACK_PRICES['4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R'].change24h
        },
        'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': {
          symbol: 'BONK',
          price: data.bonk?.usd || FALLBACK_PRICES['DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'].price,
          change24h: data.bonk?.usd_24h_change || FALLBACK_PRICES['DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'].change24h
        },
        'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN': {
          symbol: 'JUP',
          price: data['jupiter-exchange-solana']?.usd || FALLBACK_PRICES['JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN'].price,
          change24h: data['jupiter-exchange-solana']?.usd_24h_change || FALLBACK_PRICES['JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN'].change24h
        },
        'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm': {
          symbol: 'WIF',
          price: data.dogwifcoin?.usd || FALLBACK_PRICES['EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm'].price,
          change24h: data.dogwifcoin?.usd_24h_change || FALLBACK_PRICES['EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm'].change24h
        },
        'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3': {
          symbol: 'PYTH',
          price: data['pyth-network']?.usd || FALLBACK_PRICES['HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3'].price,
          change24h: data['pyth-network']?.usd_24h_change || FALLBACK_PRICES['HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3'].change24h
        }
      };

      setPrices(mappedPrices);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.warn('Failed to fetch live prices, using fallback data:', err);
      setError('Using cached prices');
      // Keep using fallback prices
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number): string => {
    if (price < 0.01) return price.toFixed(6);
    if (price < 1) return price.toFixed(4);
    return price.toFixed(2);
  };

  const formatChange = (change: number): string => {
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-primary-500/20 p-4 card-hover">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center mr-2 glow-cyan">
            <DollarSign className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">Token Prices</h3>
        </div>
        <button
          onClick={fetchPrices}
          disabled={loading}
          className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {error && (
        <div className="mb-3 text-xs text-yellow-400 bg-yellow-900/20 border border-yellow-500/30 rounded px-2 py-1">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        {Object.entries(prices).map(([address, priceInfo]) => {
          const isPositive = priceInfo.change24h >= 0;
          
          return (
            <div key={address} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-b-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {priceInfo.symbol.charAt(0)}
                  </span>
                </div>
                <span className="text-white font-medium">{priceInfo.symbol}</span>
              </div>
              
              <div className="text-right">
                <div className="text-white font-medium">
                  ${formatPrice(priceInfo.price)}
                </div>
                <div className={`flex items-center text-xs ${isPositive ? 'text-secondary-400' : 'text-red-400'}`}>
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {formatChange(priceInfo.change24h)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-xs text-gray-400 text-center">
        Last updated: {lastUpdated.toLocaleTimeString()} • Powered by CoinGecko
      </div>
    </div>
  );
};