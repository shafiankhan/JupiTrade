import React, { FC, ReactNode } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

interface Props {
  children: ReactNode;
}

export const WalletProviderComponent: FC<Props> = ({ children }) => {
  // Use mainnet for production, devnet for development
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    [network]
  );

  // Handle wallet errors gracefully
  const onError = (error: any) => {
    // Check if the error is a user rejection (common and expected behavior)
    if (
      error?.message?.includes('User rejected') ||
      error?.message?.includes('user rejected') ||
      error?.message?.includes('rejected the request') ||
      error?.code === 4001 || // Standard error code for user rejection
      error?.name === 'WalletConnectionError'
    ) {
      // Log as info rather than error since this is expected user behavior
      console.info('Wallet connection declined by user');
      return;
    }
    
    // For other errors, log them as actual errors
    console.error('Wallet error:', error);
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect onError={onError}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};