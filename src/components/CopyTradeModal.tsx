import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletSignTransactionError } from '@solana/wallet-adapter-base';
import { Copy, AlertTriangle, TrendingUp, X, Zap } from 'lucide-react';
import { getJupiterQuote, getJupiterSwapTransaction, sendTransactionWithRetry, type JupiterQuote } from '../lib/jupiter';
import { Connection, VersionedTransaction } from '@solana/web3.js';

// Popular Solana tokens with their mint addresses and metadata
const POPULAR_TOKENS = [
  {
    symbol: 'SOL',
    address: 'So11111111111111111111111111111111111111112',
    decimals: 9,
    name: 'Solana'
  },
  {
    symbol: 'USDC',
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    decimals: 6,
    name: 'USD Coin'
  },
  {
    symbol: 'USDT',
    address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    decimals: 6,
    name: 'Tether USD'
  },
  {
    symbol: 'RAY',
    address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    decimals: 6,
    name: 'Raydium'
  },
  {
    symbol: 'BONK',
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    decimals: 5,
    name: 'Bonk'
  },
  {
    symbol: 'JUP',
    address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    decimals: 6,
    name: 'Jupiter'
  },
  {
    symbol: 'WIF',
    address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
    decimals: 6,
    name: 'dogwifhat'
  },
  {
    symbol: 'PYTH',
    address: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3',
    decimals: 6,
    name: 'Pyth Network'
  }
];

interface CopyTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trade: {
    id: string;
    trader_username: string;
    input_token: string;
    output_token: string;
    input_amount: number;
    output_amount: number;
    signature: string;
  };
  onCopyComplete?: (signature: string) => void;
}

export const CopyTradeModal: React.FC<CopyTradeModalProps> = ({
  isOpen,
  onClose,
  trade,
  onCopyComplete
}) => {
  const { publicKey, signTransaction, connected } = useWallet();
  const [copyAmount, setCopyAmount] = useState('');
  const [quote, setQuote] = useState<JupiterQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slippage, setSlippage] = useState(1.0); // Higher slippage for copy trades

  const connection = new Connection('https://api.mainnet-beta.solana.com');

  // Helper function to get token info by symbol
  const getTokenBySymbol = (symbol: string) => {
    return POPULAR_TOKENS.find(token => token.symbol === symbol);
  };

  // Helper function to get decimals for a token symbol
  const getDecimalsForSymbol = (symbol: string): number => {
    const token = getTokenBySymbol(symbol);
    return token?.decimals || 9; // Default to 9 decimals if token not found
  };

  useEffect(() => {
    if (copyAmount && parseFloat(copyAmount) > 0) {
      const debounceTimer = setTimeout(() => {
        getQuoteForCopy();
      }, 500);
      return () => clearTimeout(debounceTimer);
    } else {
      setQuote(null);
    }
  }, [copyAmount, trade, slippage]);

  const getQuoteForCopy = async () => {
    if (!copyAmount || parseFloat(copyAmount) <= 0) return;

    setLoading(true);
    setError(null);

    try {
      // Find token mint addresses from POPULAR_TOKENS
      const inputToken = getTokenBySymbol(trade.input_token);
      const outputToken = getTokenBySymbol(trade.output_token);

      if (!inputToken || !outputToken) {
        throw new Error(`Token ${trade.input_token} or ${trade.output_token} not supported for copying`);
      }

      // Determine decimals based on token
      const inputDecimals = inputToken.decimals;
      const amount = Math.floor(parseFloat(copyAmount) * Math.pow(10, inputDecimals));
      
      const quoteResponse = await getJupiterQuote(
        inputToken.address, 
        outputToken.address, 
        amount, 
        Math.floor(slippage * 100) // Convert to basis points
      );
      
      setQuote(quoteResponse);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get quote';
      setError(errorMessage);
      console.error('Copy trade quote error:', err);
    } finally {
      setLoading(false);
    }
  };

  const executeCopyTrade = async () => {
    if (!quote || !publicKey || !signTransaction) return;

    setCopying(true);
    setError(null);

    try {
      const swapTransaction = await getJupiterSwapTransaction(
        quote,
        publicKey.toString(),
        true, // wrapAndUnwrapSol
        undefined, // feeAccount
        5000 // Medium priority fee for copy trades
      );

      const transactionBuf = Buffer.from(swapTransaction.swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(transactionBuf);

      const signedTransaction = await signTransaction(transaction);
      const signature = await sendTransactionWithRetry(connection, signedTransaction);

      onCopyComplete?.(signature);
      onClose();
    } catch (err) {
      // Handle wallet rejection gracefully
      if (err instanceof WalletSignTransactionError && err.message.includes('User rejected the request')) {
        setError('Transaction was cancelled by the user.');
        console.warn('User rejected the transaction signing');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Copy trade failed';
        setError(errorMessage);
        console.error('Copy trade execution error:', err);
      }
    } finally {
      setCopying(false);
    }
  };

  const formatOutputAmount = () => {
    if (!quote) return '0';
    const outputDecimals = getDecimalsForSymbol(trade.output_token);
    const amount = parseFloat(quote.outAmount) / Math.pow(10, outputDecimals);
    return amount.toFixed(6);
  };

  const getPriceImpact = () => {
    if (!quote) return 0;
    return parseFloat(quote.priceImpactPct);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg border border-gray-800 max-w-md w-full">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Copy className="w-5 h-5 mr-2 text-purple-500" />
              Copy Trade
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Original Trade Info */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Original Trade by {trade.trader_username}</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-white font-medium">
              {trade.input_amount} {trade.input_token} → {trade.output_amount} {trade.output_token}
            </div>
          </div>

          {/* Copy Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Amount to Copy ({trade.input_token})
            </label>
            <input
              type="number"
              value={copyAmount}
              onChange={(e) => setCopyAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Slippage Setting */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Slippage Tolerance
            </label>
            <div className="flex space-x-2">
              {[0.5, 1.0, 2.0, 3.0].map((value) => (
                <button
                  key={value}
                  onClick={() => setSlippage(value)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    slippage === value
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {value}%
                </button>
              ))}
            </div>
          </div>

          {/* Quote Preview */}
          {quote && (
            <div className="bg-gray-800/30 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">You'll receive approximately</span>
                <span className="text-white font-medium">
                  {formatOutputAmount()} {trade.output_token}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Price Impact</span>
                <span className={`${getPriceImpact() > 2 ? 'text-red-400' : 'text-green-400'}`}>
                  {getPriceImpact().toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Route</span>
                <span className="text-white">
                  {quote.routePlan?.length || 1} hop{(quote.routePlan?.length || 1) > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-yellow-400 text-sm">
              <p className="font-medium mb-1">Copy Trade Warning</p>
              <p>Market conditions may have changed since the original trade. The execution price may differ from the original trade due to slippage and market movement.</p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={executeCopyTrade}
              disabled={!quote || copying || loading || !connected}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium py-2 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {copying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Copying...</span>
                </>
              ) : loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Getting Quote...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Copy Trade</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};