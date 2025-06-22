import React, { useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface JupiterTerminalProps {
  className?: string;
  onSwapComplete?: (signature: string) => void;
}

export const JupiterTerminal: React.FC<JupiterTerminalProps> = ({ 
  className = '',
  onSwapComplete 
}) => {
  const { publicKey, connected } = useWallet();
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!connected || !publicKey || !terminalRef.current) return;

    // Load Jupiter Terminal script
    const script = document.createElement('script');
    script.src = 'https://terminal.jup.ag/main-v2.js';
    script.onload = () => {
      if (window.Jupiter) {
        window.Jupiter.init({
          displayMode: 'integrated',
          integratedTargetId: 'jupiter-terminal',
          endpoint: 'https://api.mainnet-beta.solana.com',
          platformFeeAndAccounts: undefined,
          strictTokenList: true,
          defaultExplorer: 'SolanaFM',
          formProps: {
            fixedInputMint: false,
            fixedOutputMint: false,
            swapMode: 'ExactIn',
            initialAmount: '',
            initialInputMint: 'So11111111111111111111111111111111111111112', // SOL
            initialOutputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
          },
          onSuccess: ({ txid }: { txid: string }) => {
            console.log('Swap successful:', txid);
            onSwapComplete?.(txid);
          },
          onSwapError: ({ error }: { error: any }) => {
            console.error('Swap error:', error);
          },
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [connected, publicKey, onSwapComplete]);

  if (!connected) {
    return (
      <div className={`bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 p-6 ${className}`}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Connect Wallet</h3>
          <p className="text-gray-400">Connect your wallet to access Jupiter Terminal</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 overflow-hidden ${className}`}>
      <div 
        id="jupiter-terminal" 
        ref={terminalRef}
        className="min-h-[500px]"
      />
    </div>
  );
};

// Extend window type for Jupiter Terminal
declare global {
  interface Window {
    Jupiter: {
      init: (config: any) => void;
    };
  }
}