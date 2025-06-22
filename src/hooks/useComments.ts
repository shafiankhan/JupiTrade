import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Comment {
  id: string;
  trader_id: string;
  commenter_id: string;
  content: string;
  likes_count: number;
  created_at: string;
  commenter?: {
    username: string;
    avatar_url?: string;
  };
}

export const useComments = (traderId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (traderId) {
      fetchComments();
    }
  }, [traderId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          commenter:traders!commenter_id(username, avatar_url)
        `)
        .eq('trader_id', traderId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string, commenterId: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          trader_id: traderId,
          commenter_id: commenterId,
          content
        }])
        .select(`
          *,
          commenter:traders!commenter_id(username, avatar_url)
        `)
        .maybeSingle();

      if (error) throw error;
      
      // If data is null (commenter not found or not accessible), refetch all comments
      if (!data) {
        await fetchComments();
        return null;
      }
      
      setComments(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add comment');
    }
  };

  const likeComment = async (commentId: string) => {
    try {
      // First get the current comment to get the current likes_count
      const currentComment = comments.find(c => c.id === commentId);
      if (!currentComment) throw new Error('Comment not found');

      const { error } = await supabase
        .from('comments')
        .update({ likes_count: currentComment.likes_count + 1 })
        .eq('id', commentId);

      if (error) throw error;
      
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes_count: comment.likes_count + 1 }
          : comment
      ));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to like comment');
    }
  };

  return { comments, loading, error, addComment, likeComment, refetch: fetchComments };
};