import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  wallet_address: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  total_volume: number;
  total_trades: number;
  win_rate: number;
  roi: number;
  followers_count: number;
  following_count: number;
  created_at: string;
  updated_at: string;
}

export const useAuth = () => {
  const { publicKey, connected } = useWallet();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (connected && publicKey) {
      checkOrCreateUser();
    } else {
      setUser(null);
      setShowOnboarding(false);
    }
  }, [connected, publicKey]);

  const checkOrCreateUser = async () => {
    if (!publicKey) return;

    setLoading(true);
    try {
      const walletAddress = publicKey.toString();
      
      // Check if trader exists in traders table
      const { data: existingTraders, error } = await supabase
        .from('traders')
        .select('*')
        .eq('wallet_address', walletAddress);

      if (error) {
        throw error;
      }

      // Check if any traders were found
      if (!existingTraders || existingTraders.length === 0) {
        // Show onboarding for new users
        setShowOnboarding(true);
      } else {
        // Use the existing trader
        setUser(existingTraders[0]);
      }
    } catch (err) {
      console.error('Error checking user:', err);
    } finally {
      setLoading(false);
    }
  };

  const createUserWithUsername = async (username: string) => {
    if (!publicKey) return;

    try {
      const walletAddress = publicKey.toString();
      
      const newTrader = {
        wallet_address: walletAddress,
        username: username,
        avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${walletAddress}`,
        bio: null,
        total_volume: 0,
        total_trades: 0,
        win_rate: 0,
        roi: 0,
        followers_count: 0,
        following_count: 0,
      };

      const { data: createdTrader, error: createError } = await supabase
        .from('traders')
        .insert([newTrader])
        .select();

      if (createError) throw createError;
      
      if (createdTrader && createdTrader.length > 0) {
        setUser(createdTrader[0]);
        setShowOnboarding(false);
      }
    } catch (err) {
      console.error('Error creating user:', err);
      throw err;
    }
  };

  const skipOnboarding = async () => {
    if (!publicKey) return;

    try {
      const walletAddress = publicKey.toString();
      const defaultUsername = `Trader_${walletAddress.slice(0, 6)}`;
      
      await createUserWithUsername(defaultUsername);
    } catch (err) {
      console.error('Error skipping onboarding:', err);
    }
  };

  return { 
    user, 
    loading, 
    showOnboarding,
    createUserWithUsername,
    skipOnboarding,
    checkOrCreateUser 
  };
};