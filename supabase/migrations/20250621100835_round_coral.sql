/*
  # Create Social Trading Platform Schema

  1. New Tables
    - `traders` - User profiles with trading statistics
    - `trades` - Individual trade records
    - `follows` - Follow relationships between traders
    - `comments` - Comments on trader profiles

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Allow public read access to trader and trade data

  3. Performance
    - Add indexes for frequently queried columns
    - Optimize for leaderboard and profile queries
*/

-- Create traders table
CREATE TABLE IF NOT EXISTS traders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  username text NOT NULL,
  avatar_url text,
  bio text,
  total_volume decimal DEFAULT 0,
  total_trades integer DEFAULT 0,
  win_rate decimal DEFAULT 0,
  roi decimal DEFAULT 0,
  followers_count integer DEFAULT 0,
  following_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trades table
CREATE TABLE IF NOT EXISTS trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trader_id uuid REFERENCES traders(id) ON DELETE CASCADE,
  input_token text NOT NULL,
  output_token text NOT NULL,
  input_amount decimal NOT NULL,
  output_amount decimal NOT NULL,
  price decimal NOT NULL,
  signature text UNIQUE NOT NULL,
  timestamp timestamptz NOT NULL,
  pnl decimal,
  created_at timestamptz DEFAULT now()
);

-- Create follows table
CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid REFERENCES traders(id) ON DELETE CASCADE,
  following_id uuid REFERENCES traders(id) ON DELETE CASCADE,
  auto_copy boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trader_id uuid REFERENCES traders(id) ON DELETE CASCADE,
  commenter_id uuid REFERENCES traders(id) ON DELETE CASCADE,
  content text NOT NULL,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS traders_roi_idx ON traders(roi DESC);
CREATE INDEX IF NOT EXISTS traders_wallet_address_idx ON traders(wallet_address);
CREATE INDEX IF NOT EXISTS trades_trader_id_idx ON trades(trader_id);
CREATE INDEX IF NOT EXISTS trades_timestamp_idx ON trades(timestamp DESC);
CREATE INDEX IF NOT EXISTS follows_follower_id_idx ON follows(follower_id);
CREATE INDEX IF NOT EXISTS follows_following_id_idx ON follows(following_id);
CREATE INDEX IF NOT EXISTS comments_trader_id_idx ON comments(trader_id);

-- Enable RLS on all tables
ALTER TABLE traders ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for traders table
CREATE POLICY "Anyone can read traders"
  ON traders
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own trader profile"
  ON traders
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own trader profile"
  ON traders
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for trades table
CREATE POLICY "Anyone can read trades"
  ON trades
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own trades"
  ON trades
  FOR INSERT
  WITH CHECK (auth.uid() = trader_id);

-- Create RLS policies for follows table
CREATE POLICY "Users can manage their own follows"
  ON follows
  FOR ALL
  USING (auth.uid() = follower_id);

CREATE POLICY "Anyone can read follows"
  ON follows
  FOR SELECT
  USING (true);

-- Create RLS policies for comments table
CREATE POLICY "Anyone can read comments"
  ON comments
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert comments"
  ON comments
  FOR INSERT
  WITH CHECK (auth.uid() = commenter_id);

CREATE POLICY "Users can update their own comments"
  ON comments
  FOR UPDATE
  USING (auth.uid() = commenter_id);

-- Insert sample traders data
INSERT INTO traders (id, wallet_address, username, avatar_url, bio, total_volume, total_trades, win_rate, roi, followers_count, following_count) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', 'CryptoWhale', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150', 'Professional trader with 5+ years experience in DeFi', 2500000.50, 1250, 78.5, 245.8, 15420, 89),
  ('550e8400-e29b-41d4-a716-446655440002', 'DQvG4H8wS5w9HBqzqC8L4nQK7HqBZswts7C4s2t2pLrx', 'SolanaKing', 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150', 'Solana ecosystem specialist. Focus on high-growth tokens.', 1800000.25, 890, 82.1, 189.3, 12350, 156),
  ('550e8400-e29b-41d4-a716-446655440003', 'FvwEAhmxKfeiG8SnEvq1qgT6gS5rE2Rrekkjp1TKvYJB', 'DeFiMaster', 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150', 'Yield farming and liquidity mining expert', 3200000.75, 2100, 75.2, 312.4, 18900, 234),
  ('550e8400-e29b-41d4-a716-446655440004', '8WzgtGFDLWi8cTTf2HBjqC8L4nQK7HqBZswts7C4s2t2', 'TokenHunter', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150', 'Early stage token investor and swing trader', 950000.30, 567, 71.8, 156.7, 8750, 67),
  ('550e8400-e29b-41d4-a716-446655440005', 'BpLkjHgFdSaQwErTyUiOpAsDfGhJkLzXcVbNmQwErTyU', 'ScalpMaster', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150', 'High-frequency scalping specialist', 1200000.80, 3450, 68.9, 98.5, 6890, 45),
  ('550e8400-e29b-41d4-a716-446655440006', 'CxMnBvGtRsEwQaZxCvBnMkLpOiUyTrEwQaZxCvBnMkLp', 'HODLQueen', 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150', 'Long-term investor with focus on blue-chip tokens', 4500000.20, 234, 89.7, 567.8, 25600, 12),
  ('550e8400-e29b-41d4-a716-446655440007', 'DfGhJkLmNpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWx', 'ArbitrageBot', 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=150', 'Automated arbitrage trading across DEXs', 890000.45, 1890, 85.3, 134.2, 4560, 23),
  ('550e8400-e29b-41d4-a716-446655440008', 'EfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUv', 'MemeTrader', 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150', 'Meme coin specialist with insider knowledge', 650000.15, 789, 62.4, 89.6, 11200, 178);

-- Insert sample trades data
INSERT INTO trades (trader_id, input_token, output_token, input_amount, output_amount, price, signature, timestamp, pnl) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'SOL', 'USDC', 100.0, 2150.0, 21.50, '5KJp89wErTyUiOpAsDfGhJkLzXcVbNmQwErTyUiOpAsDfGhJkLzXcVbNmQwErTyUiOpAs1', now() - interval '2 hours', 125.50),
  ('550e8400-e29b-41d4-a716-446655440001', 'USDC', 'RAY', 1000.0, 500.0, 2.00, '5KJp89wErTyUiOpAsDfGhJkLzXcVbNmQwErTyUiOpAsDfGhJkLzXcVbNmQwErTyUiOpAs2', now() - interval '4 hours', 89.25),
  ('550e8400-e29b-41d4-a716-446655440002', 'SOL', 'BONK', 50.0, 1000000.0, 0.00005, '5KJp89wErTyUiOpAsDfGhJkLzXcVbNmQwErTyUiOpAsDfGhJkLzXcVbNmQwErTyUiOpAs3', now() - interval '1 hour', 234.75),
  ('550e8400-e29b-41d4-a716-446655440003', 'USDC', 'JUP', 2000.0, 2500.0, 0.80, '5KJp89wErTyUiOpAsDfGhJkLzXcVbNmQwErTyUiOpAsDfGhJkLzXcVbNmQwErTyUiOpAs4', now() - interval '6 hours', 456.80),
  ('550e8400-e29b-41d4-a716-446655440004', 'SOL', 'ORCA', 25.0, 125.0, 5.00, '5KJp89wErTyUiOpAsDfGhJkLzXcVbNmQwErTyUiOpAsDfGhJkLzXcVbNmQwErTyUiOpAs5', now() - interval '3 hours', 67.30);

-- Insert sample follows data
INSERT INTO follows (follower_id, following_id, auto_copy) VALUES
  ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', true),
  ('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', false),
  ('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', true),
  ('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', false),
  ('550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440001', true);

-- Insert sample comments data
INSERT INTO comments (trader_id, commenter_id, content, likes_count) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'Great trade on SOL! Following your strategy.', 15),
  ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'Your BONK call was amazing! 🚀', 23),
  ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440006', 'DeFi master indeed! Learning a lot from your trades.', 8),
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440007', 'When are you planning to exit this position?', 5);