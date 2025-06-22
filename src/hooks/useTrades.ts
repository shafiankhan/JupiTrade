import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Trade {
  id: string;
  trader_id: string;
  input_token: string;
  output_token: string;
  input_amount: number;
  output_amount: number;
  price: number;
  signature: string;
  timestamp: string;
  pnl: number | null;
  created_at: string;
}

export const useTrades = (traderId?: string) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrades();
  }, [traderId]);

  const fetchTrades = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('trades')
        .select('*')
        .order('timestamp', { ascending: false });

      if (traderId) {
        query = query.eq('trader_id', traderId);
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;
      setTrades(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trades');
    } finally {
      setLoading(false);
    }
  };

  return { trades, loading, error, refetch: fetchTrades };
};