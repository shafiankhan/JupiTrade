import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      traders: {
        Row: {
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
        };
        Insert: {
          id?: string;
          wallet_address: string;
          username: string;
          avatar_url?: string | null;
          bio?: string | null;
          total_volume?: number;
          total_trades?: number;
          win_rate?: number;
          roi?: number;
          followers_count?: number;
          following_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wallet_address?: string;
          username?: string;
          avatar_url?: string | null;
          bio?: string | null;
          total_volume?: number;
          total_trades?: number;
          win_rate?: number;
          roi?: number;
          followers_count?: number;
          following_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      trades: {
        Row: {
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
        };
        Insert: {
          id?: string;
          trader_id: string;
          input_token: string;
          output_token: string;
          input_amount: number;
          output_amount: number;
          price: number;
          signature: string;
          timestamp: string;
          pnl?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          trader_id?: string;
          input_token?: string;
          output_token?: string;
          input_amount?: number;
          output_amount?: number;
          price?: number;
          signature?: string;
          timestamp?: string;
          pnl?: number | null;
          created_at?: string;
        };
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          auto_copy: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          auto_copy?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          follower_id?: string;
          following_id?: string;
          auto_copy?: boolean;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          trader_id: string;
          commenter_id: string;
          content: string;
          likes_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          trader_id: string;
          commenter_id: string;
          content: string;
          likes_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          trader_id?: string;
          commenter_id?: string;
          content?: string;
          likes_count?: number;
          created_at?: string;
        };
      };
    };
  };
};