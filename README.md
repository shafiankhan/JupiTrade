# JupiTrade - Social Trading Platform
# ⚠️ Warning: JupiTrade may cause excessive profits. Prolonged use may lead to financial happiness.

A comprehensive social trading platform for Solana that allows users to follow top traders and automatically copy their trades using Jupiter Exchange APIs.

## 🚀 Jupiter Exchange Integration

### Latest API Implementation
This platform uses Jupiter's latest API structure with the new endpoints:
- **Swap API**: `https://lite-api.jup.ag/swap/v1/` (Free tier)
- **Price API**: `https://lite-api.jup.ag/price/v2/`
- **Token API**: `https://lite-api.jup.ag/tokens/v1/`

### Jupiter Features Integrated
- **Real-time Swap Quotes**: Get the best swap routes across all Solana DEXs
- **Jupiter Terminal**: Embedded Jupiter Terminal for seamless trading
- **Token Price Feed**: Live token prices powered by Jupiter Price API
- **Copy Trading**: Execute copy trades using Jupiter's swap infrastructure
- **Multi-DEX Routing**: Access to 20+ DEXs through Jupiter's aggregation
- **Priority Fee Management**: Configurable priority fees for transaction optimization
- **Slippage Protection**: Advanced slippage tolerance settings

- ![image](https://github.com/user-attachments/assets/bf319344-e4a7-46ce-a6e2-1cb8173d0112)

# connecting wallet........
![image](https://github.com/user-attachments/assets/b61c0cfe-5d17-47c1-b9ff-2efdf8759ba4)

# Dashboard
![image](https://github.com/user-attachments/assets/e7fdf71d-2481-46b5-9ad4-756944b70c33)

# CopyTrading Hub
![image](https://github.com/user-attachments/assets/dfa43262-8d27-46bf-915c-47a984c7f396)

### Enhanced Trading Features
- **Smart Swap Widget**: Custom Jupiter-powered swap interface with settings
- **Price Impact Analysis**: Real-time price impact calculations
- **Route Optimization**: Automatic best route selection with multi-hop support
- **Transaction Retry Logic**: Built-in retry mechanism for failed transactions
- **Priority Fee Estimation**: Dynamic priority fee calculation
- **Transaction Confirmation**: Built-in transaction status tracking

## Features

- **Wallet Integration**: Connect with multiple Solana wallets (Phantom, Solflare, Torus, Ledger)
- **Trader Leaderboard**: View top traders ranked by ROI, win rate, and trading volume
- **Trader Profiles**: Detailed profiles with trade history, performance metrics, and social features
- **Copy Trading**: Automatically copy trades from followed traders with wallet confirmation
- **Jupiter Integration**: Powered by Jupiter Exchange for optimal swap execution
- **Social Features**: Follow traders, comment on profiles, and like trades
- **Personal Dashboard**: Track your performance, copied trades, and followed traders
- **Real-time Updates**: Live updates for trades and social interactions
- **Token Prices**: Real-time token price tracking
- **Responsive Design**: Optimized for desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Wallet**: Solana Wallet Adapter
- **Trading**: Jupiter Exchange APIs (Latest v1 endpoints)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

## Jupiter APIs Used

### 1. Swap API (`https://lite-api.jup.ag/swap/v1/`)
- **Quote Endpoint**: Get swap quotes with optimal routing
- **Swap Endpoint**: Get serialized transactions for execution
- **Swap Instructions**: Get individual instructions for custom transactions
- **Program ID Mapping**: Get DEX program ID to label mappings

### 2. Price API (`https://lite-api.jup.ag/price/v2/`)
- Real-time token prices
- Price change tracking
- USDC-denominated pricing
- Historical price data support

### 3. Token API (`https://lite-api.jup.ag/tokens/v1/`)
- **Token Info**: Get detailed token metadata
- **Tradable Tokens**: Get list of all tradable token mints
- **Tagged Tokens**: Get tokens by specific tags
- Token logos and verification status

### 4. Jupiter Terminal (`https://terminal.jup.ag`)
- Embedded trading interface
- Complete swap functionality
- Customizable UI integration

## Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Solana wallet for testing

## Getting Started

1. **Clone and install dependencies:**

```bash
git clone <repository-url>
cd solana-social-trading-platform
npm install
```

2. **Set up Supabase:**

   - Create a new Supabase project
   - Copy the project URL and anon key
   - Set up the database schema (see Database Setup section)

3. **Configure environment variables:**

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. **Start the development server:**

```bash
npm run dev
```

## Jupiter Integration Guide

### 1. Swap Widget Integration

```typescript
import { JupiterSwapWidget } from './components/JupiterSwapWidget';

<JupiterSwapWidget 
  onSwapComplete={(signature, inputToken, outputToken, inputAmount, outputAmount) => {
    // Handle successful swap
    console.log('Swap completed:', signature);
  }}
/>
```

### 2. Copy Trading Implementation

```typescript
import { CopyTradeModal } from './components/CopyTradeModal';

// Copy a trader's transaction
<CopyTradeModal
  trade={selectedTrade}
  onCopyComplete={(signature) => {
    // Handle successful copy trade
  }}
/>
```

### 3. Token Price Tracking

```typescript
import { TokenPriceWidget } from './components/TokenPriceWidget';

// Display real-time token prices
<TokenPriceWidget />
```

### 4. Jupiter Terminal Embedding

```typescript
import { JupiterTerminal } from './components/JupiterTerminal';

// Embed full Jupiter Terminal
<JupiterTerminal 
  onSwapComplete={(signature) => {
    // Handle swap completion
  }}
/>
```

## Database Setup

The database schema includes tables for traders, trades, follows, and comments. Run the migration file to set up the complete schema with sample data.

## Key Components

### Jupiter Integration Components
- `JupiterSwapWidget`: Custom swap interface using Jupiter APIs
- `JupiterTerminal`: Embedded Jupiter Terminal
- `CopyTradeModal`: Copy trading functionality with Jupiter execution
- `TokenPriceWidget`: Real-time price display

### Core Platform Components
- `Dashboard`: Enhanced with Jupiter trading features
- `Leaderboard`: Trader rankings and performance
- `TradersGrid`: Trader discovery and profiles
- `TraderProfile`: Detailed trader information

## Jupiter API Features

### Quote API Integration
- Multi-DEX route optimization
- Real-time price impact calculation
- Configurable slippage tolerance
- Fee estimation and breakdown
- Route plan visualization

### Price API Integration
- Real-time token pricing
- Price change tracking
- Multiple base currency support
- Historical price data access

### Swap Execution
- Versioned transaction support
- Priority fee optimization
- Transaction confirmation tracking
- Error handling and retry logic
- Compute unit optimization

### Advanced Features
- **Priority Fee Management**: Auto, low, medium, high settings
- **Slippage Protection**: Configurable tolerance levels
- **Route Optimization**: Multi-hop routing across 20+ DEXs
- **Transaction Retry**: Built-in retry logic with exponential backoff
- **Error Handling**: Comprehensive error messages and recovery

## Development Notes

- All Jupiter API calls use the latest v1 endpoints on `lite-api.jup.ag`
- No API key required for free tier usage
- Token amounts are properly formatted for different decimals
- Wallet integration supports all major Solana wallets
- Real-time price updates every 30 seconds
- Copy trading includes safety warnings and confirmations
- Responsive design works across all device sizes
- Priority fee estimation for optimal transaction landing

## Jupiter Resources Used

- **Dev Docs**: https://dev.jup.ag
- **Jupiter Terminal**: https://terminal.jup.ag
- **Unified Wallet Kit**: https://unified.jup.ag
- **API Portal**: https://portal.jup.ag
- **Price API**: https://lite-api.jup.ag/price/v2
- **Swap API**: https://lite-api.jup.ag/swap/v1
- **Token API**: https://lite-api.jup.ag/tokens/v1

## API Migration Notes

This implementation uses the latest Jupiter API structure:
- Migrated from `quote-api.jup.ag` to `lite-api.jup.ag`
- Updated all endpoints to v1/v2 versions
- Implemented proper error handling for new API responses
- Added support for new features like priority fee management
- Optimized for the free tier usage without API keys

## Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to your preferred platform (Vercel, Netlify, etc.)

3. Set up environment variables in your deployment platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, create an issue in the GitHub repository or contact the development team.

---

**Powered by Jupiter Exchange** - The #1 liquidity aggregator on Solana

**Perfect for Jupiter Hackathon** - Showcasing real-world DeFi use cases with Jupiter's powerful API suite
