import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  auto_copy: boolean;
  created_at: string;
}

export const useFollows = (userId?: string) => {
  const [follows, setFollows] = useState<Follow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchFollows();
    }
  }, [userId]);

  const fetchFollows = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', userId);

      if (error) throw error;
      setFollows(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch follows');
    } finally {
      setLoading(false);
    }
  };

  const followTrader = async (followerId: string, followingId: string, autoCopy: boolean = false) => {
    try {
      const { data, error } = await supabase
        .from('follows')
        .insert([{
          follower_id: followerId,
          following_id: followingId,
          auto_copy: autoCopy
        }])
        .select()
        .single();

      if (error) throw error;
      setFollows(prev => [...prev, data]);
      
      // Update follower count
      await supabase.rpc('increment_followers_count', { trader_id: followingId });
      
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to follow trader');
    }
  };

  const unfollowTrader = async (followerId: string, followingId: string) => {
    try {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', followingId);

      if (error) throw error;
      setFollows(prev => prev.filter(f => f.following_id !== followingId));
      
      // Update follower count
      await supabase.rpc('decrement_followers_count', { trader_id: followingId });
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to unfollow trader');
    }
  };

  const toggleAutoCopy = async (followerId: string, followingId: string, autoCopy: boolean) => {
    try {
      const { error } = await supabase
        .from('follows')
        .update({ auto_copy: autoCopy })
        .eq('follower_id', followerId)
        .eq('following_id', followingId);

      if (error) throw error;
      setFollows(prev => prev.map(f => 
        f.following_id === followingId ? { ...f, auto_copy: autoCopy } : f
      ));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update auto-copy');
    }
  };

  const isFollowing = (followingId: string) => {
    return follows.some(f => f.following_id === followingId);
  };

  const getAutoCopyStatus = (followingId: string) => {
    const follow = follows.find(f => f.following_id === followingId);
    return follow?.auto_copy || false;
  };

  return {
    follows,
    loading,
    error,
    followTrader,
    unfollowTrader,
    toggleAutoCopy,
    isFollowing,
    getAutoCopyStatus,
    refetch: fetchFollows
  };
};