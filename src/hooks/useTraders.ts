import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Trader {
  id: string;
  wallet_address: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  total_volume: number;
  total_trades: number;
  win_rate: number;
  roi: number;
  followers_count: number;
  following_count: number;
  created_at: string;
  updated_at: string;
}

export const useTraders = () => {
  const [traders, setTraders] = useState<Trader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTraders();
  }, []);

  const fetchTraders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('traders')
        .select('*')
        .order('roi', { ascending: false })
        .limit(100);

      if (error) throw error;
      setTraders(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch traders');
    } finally {
      setLoading(false);
    }
  };

  return { traders, loading, error, refetch: fetchTraders };
};