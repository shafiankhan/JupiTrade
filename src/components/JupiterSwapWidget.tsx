import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, VersionedTransaction } from '@solana/web3.js';
import { WalletSignTransactionError } from '@solana/wallet-adapter-base';
import { ArrowUpDown, Zap, TrendingUp, AlertCircle, Settings } from 'lucide-react';
import { 
  getJupiterQuote, 
  getJupiterSwapTransaction, 
  getTokenPrices,
  getTradableTokens,
  POPULAR_TOKENS,
  formatTokenAmount,
  parseTokenAmount,
  sendTransactionWithRetry,
  type JupiterQuote,
  type TokenInfo 
} from '../lib/jupiter';

interface JupiterSwapWidgetProps {
  onSwapComplete?: (signature: string, inputToken: string, outputToken: string, inputAmount: number, outputAmount: number) => void;
  className?: string;
}

export const JupiterSwapWidget: React.FC<JupiterSwapWidgetProps> = ({ 
  onSwapComplete, 
  className = '' 
}) => {
  const { publicKey, signTransaction, connected } = useWallet();
  const [tradableTokens, setTradableTokens] = useState<string[]>([]);
  const [inputToken, setInputToken] = useState(POPULAR_TOKENS.SOL);
  const [outputToken, setOutputToken] = useState(POPULAR_TOKENS.USDC);
  const [inputAmount, setInputAmount] = useState('');
  const [quote, setQuote] = useState<JupiterQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  const [priorityFee, setPriorityFee] = useState<'auto' | 'low' | 'medium' | 'high'>('auto');

  const connection = new Connection('https://api.mainnet-beta.solana.com');

  useEffect(() => {
    loadTradableTokens();
  }, []);

  useEffect(() => {
    if (inputAmount && parseFloat(inputAmount) > 0 && inputToken !== outputToken) {
      const debounceTimer = setTimeout(() => {
        getQuote();
      }, 500); // Debounce API calls

      return () => clearTimeout(debounceTimer);
    } else {
      setQuote(null);
    }
  }, [inputToken, outputToken, inputAmount, slippage]);

  const loadTradableTokens = async () => {
    try {
      const tokens = await getTradableTokens();
      setTradableTokens(tokens);
    } catch (err) {
      console.error('Failed to load tradable tokens:', err);
      // Fallback to popular tokens
      setTradableTokens(Object.values(POPULAR_TOKENS));
    }
  };

  const getQuote = async () => {
    if (!inputAmount || parseFloat(inputAmount) <= 0) return;

    setLoading(true);
    setError(null);

    try {
      // Assume 9 decimals for most tokens (SOL standard)
      // In production, you'd want to fetch actual decimals from token metadata
      const decimals = inputToken === POPULAR_TOKENS.USDC || inputToken === POPULAR_TOKENS.USDT ? 6 : 9;
      const amount = parseTokenAmount(parseFloat(inputAmount), decimals);
      
      const quoteResponse = await getJupiterQuote(
        inputToken,
        outputToken,
        parseInt(amount),
        Math.floor(slippage * 100) // Convert to basis points
      );
      
      setQuote(quoteResponse);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get quote';
      setError(errorMessage);
      console.error('Quote error:', err);
    } finally {
      setLoading(false);
    }
  };

  const executeSwap = async () => {
    if (!quote || !publicKey || !signTransaction) return;

    setSwapping(true);
    setError(null);

    try {
      // Get priority fee based on user selection
      let prioritizationFeeLamports: number | undefined;
      if (priorityFee !== 'auto') {
        const feeMap = { low: 1000, medium: 5000, high: 10000 };
        prioritizationFeeLamports = feeMap[priorityFee];
      }

      const swapTransaction = await getJupiterSwapTransaction(
        quote,
        publicKey.toString(),
        true, // wrapAndUnwrapSol
        undefined, // feeAccount
        prioritizationFeeLamports
      );

      // Deserialize the transaction
      const transactionBuf = Buffer.from(swapTransaction.swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(transactionBuf);

      // Sign the transaction
      const signedTransaction = await signTransaction(transaction);

      // Send with retry logic
      const signature = await sendTransactionWithRetry(connection, signedTransaction);

      // Calculate amounts for callback
      const inputDecimals = inputToken === POPULAR_TOKENS.USDC || inputToken === POPULAR_TOKENS.USDT ? 6 : 9;
      const outputDecimals = outputToken === POPULAR_TOKENS.USDC || outputToken === POPULAR_TOKENS.USDT ? 6 : 9;
      
      const inputAmountFormatted = formatTokenAmount(quote.inAmount, inputDecimals);
      const outputAmountFormatted = formatTokenAmount(quote.outAmount, outputDecimals);

      onSwapComplete?.(
        signature,
        getTokenSymbol(inputToken),
        getTokenSymbol(outputToken),
        inputAmountFormatted,
        outputAmountFormatted
      );

      // Reset form
      setInputAmount('');
      setQuote(null);

    } catch (err) {
      let errorMessage: string;
      
      // Handle specific wallet rejection error
      if (err instanceof WalletSignTransactionError || 
          (err instanceof Error && err.message.includes('User rejected'))) {
        errorMessage = 'Transaction was cancelled by the user.';
      } else {
        errorMessage = err instanceof Error ? err.message : 'Swap failed';
      }
      
      setError(errorMessage);
      console.error('Swap error:', err);
    } finally {
      setSwapping(false);
    }
  };

  const swapTokens = () => {
    const temp = inputToken;
    setInputToken(outputToken);
    setOutputToken(temp);
  };

  const getTokenSymbol = (address: string): string => {
    const entry = Object.entries(POPULAR_TOKENS).find(([, addr]) => addr === address);
    return entry ? entry[0] : address.slice(0, 6);
  };

  const formatOutputAmount = () => {
    if (!quote) return '0';
    const outputDecimals = outputToken === POPULAR_TOKENS.USDC || outputToken === POPULAR_TOKENS.USDT ? 6 : 9;
    return formatTokenAmount(quote.outAmount, outputDecimals).toFixed(6);
  };

  const getPriceImpact = () => {
    if (!quote) return 0;
    return parseFloat(quote.priceImpactPct);
  };

  const getRouteInfo = () => {
    if (!quote || !quote.routePlan) return 'Direct';
    return `${quote.routePlan.length} hop${quote.routePlan.length > 1 ? 's' : ''}`;
  };

  if (!connected) {
    return (
      <div className={`bg-gray-900/50 backdrop-blur-sm rounded-lg border border-primary-500/20 p-6 card-hover ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 glow-cyan">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Connect Wallet to Swap</h3>
          <p className="text-gray-400">Connect your Solana wallet to start trading with Jupiter</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-900/50 backdrop-blur-sm rounded-lg border border-primary-500/20 p-4 sm:p-6 card-hover ${className}`}>
      <div className="flex items-center justify-between mb-6 pr-2 sm:pr-0">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center mr-2 glow-cyan">
            <Zap className="w-4 h-4 text-white" />
          </div>
          Jupiter Swap
        </h3>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-gray-400 hover:text-white transition-colors pr-2 sm:pr-0"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-accent-500/20">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Slippage Tolerance
              </label>
              <div className="flex space-x-2">
                {[0.1, 0.5, 1.0, 2.0].map((value) => (
                  <button
                    key={value}
                    onClick={() => setSlippage(value)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      slippage === value
                        ? 'bg-gradient-primary text-white glow-cyan'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {value}%
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Priority Fee
              </label>
              <select
                value={priorityFee}
                onChange={(e) => setPriorityFee(e.target.value as any)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="auto">Auto</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Input Token */}
        <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-accent-500/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">From</span>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 sm:py-2 text-white flex-1 text-sm"
            >
              {Object.entries(POPULAR_TOKENS).map(([symbol, address]) => (
                <option key={address} value={address}>{symbol}</option>
              ))}
            </select>
            <input
              type="number"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              placeholder="0.00"
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 sm:py-2 text-white text-right flex-1 text-sm"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swapTokens}
            className="bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors border border-primary-500/20"
          >
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Output Token */}
        <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-accent-500/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">To</span>
            {quote && (
              <span className="text-sm text-gray-400">
                ~{formatOutputAmount()}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={outputToken}
              onChange={(e) => setOutputToken(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 sm:py-2 text-white flex-1 text-sm"
            >
              {Object.entries(POPULAR_TOKENS).map(([symbol, address]) => (
                <option key={address} value={address}>{symbol}</option>
              ))}
            </select>
            <div className="bg-gray-700 rounded-lg px-3 py-3 sm:py-2 text-gray-400 flex-1 text-right text-sm">
              {loading ? 'Loading...' : formatOutputAmount()}
            </div>
          </div>
        </div>

        {/* Quote Details */}
        {quote && (
          <div className="bg-gray-800/30 rounded-lg p-3 space-y-2 border border-accent-500/10">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Price Impact</span>
              <span className={`${getPriceImpact() > 1 ? 'text-red-400' : 'text-secondary-400'}`}>
                {getPriceImpact().toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Route</span>
              <span className="text-white">{getRouteInfo()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Slippage</span>
              <span className="text-white">{slippage}%</span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        )}

        {/* Swap Button */}
        <button
          onClick={executeSwap}
          disabled={!quote || swapping || loading || inputToken === outputToken}
          className="w-full bg-gradient-primary hover:bg-gradient-secondary disabled:from-gray-600 disabled:to-gray-600 text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2 glow-cyan"
        >
          {swapping ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Swapping...</span>
            </>
          ) : loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Getting Quote...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Swap with Jupiter</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-400 text-center">
        Powered by Jupiter Exchange • Best prices across 20+ DEXs
      </div>
    </div>
  );
};