// Jupiter Exchange API integration - Updated for latest API structure
const JUPITER_API_BASE = 'https://lite-api.jup.ag'; // Using free tier endpoint
const JUPITER_PRICE_API = 'https://lite-api.jup.ag/price/v2';
const JUPITER_TOKEN_API = 'https://lite-api.jup.ag/tokens/v1';

export interface JupiterQuote {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee?: {
    amount: string;
    feeBps: number;
  };
  priceImpactPct: string;
  routePlan: Array<{
    swapInfo: {
      ammKey: string;
      label: string;
      inputMint: string;
      outputMint: string;
      inAmount: string;
      outAmount: string;
      feeAmount: string;
      feeMint: string;
    };
    percent: number;
  }>;
  contextSlot: number;
  timeTaken: number;
}

export interface JupiterSwapTransaction {
  swapTransaction: string;
  lastValidBlockHeight: number;
  prioritizationFeeLamports: number;
}

export interface TokenPrice {
  id: string;
  mintSymbol: string;
  vsToken: string;
  vsTokenSymbol: string;
  price: number;
  extraInfo?: {
    quotedPrice?: {
      buyPrice: number;
      buyPriceImpactPct: number;
      sellPrice: number;
      sellPriceImpactPct: number;
    };
  };
}

export interface TokenInfo {
  address: string;
  chainId: number;
  decimals: number;
  name: string;
  symbol: string;
  logoURI?: string;
  tags?: string[];
  extensions?: {
    coingeckoId?: string;
  };
}

// Helper function to validate Solana mint addresses
function isValidSolanaMintAddress(address: string): boolean {
  if (!address || typeof address !== 'string') {
    return false;
  }
  
  // Solana addresses are base58 encoded and typically 32-44 characters long
  // They should only contain base58 characters: 123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}

// Get quote for a swap using the new API structure
export async function getJupiterQuote(
  inputMint: string,
  outputMint: string,
  amount: number,
  slippageBps: number = 50
): Promise<JupiterQuote> {
  // Validate mint addresses before making API call
  if (!isValidSolanaMintAddress(inputMint)) {
    throw new Error(`Invalid input mint address: "${inputMint}". Must be a valid Solana mint address (32-44 character base58 string).`);
  }
  
  if (!isValidSolanaMintAddress(outputMint)) {
    throw new Error(`Invalid output mint address: "${outputMint}". Must be a valid Solana mint address (32-44 character base58 string).`);
  }
  
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  const params = new URLSearchParams({
    inputMint,
    outputMint,
    amount: amount.toString(),
    slippageBps: slippageBps.toString(),
    onlyDirectRoutes: 'false',
    asLegacyTransaction: 'false'
  });

  try {
    const response = await fetch(`${JUPITER_API_BASE}/swap/v1/quote?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jupiter quote failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to Jupiter API. Please check your internet connection or try again later.');
    }
    throw error;
  }
}

// Get swap transaction using the new API structure
export async function getJupiterSwapTransaction(
  quote: JupiterQuote,
  userPublicKey: string,
  wrapAndUnwrapSol: boolean = true,
  feeAccount?: string,
  prioritizationFeeLamports?: number
): Promise<JupiterSwapTransaction> {
  // Validate user public key
  if (!isValidSolanaMintAddress(userPublicKey)) {
    throw new Error(`Invalid user public key: "${userPublicKey}". Must be a valid Solana address.`);
  }

  const requestBody: any = {
    quoteResponse: quote,
    userPublicKey,
    wrapAndUnwrapSol,
    ...(feeAccount && { feeAccount })
  };

  // Only include one of computeUnitPriceMicroLamports or prioritizationFeeLamports
  // They are mutually exclusive according to Jupiter API
  if (prioritizationFeeLamports) {
    requestBody.prioritizationFeeLamports = prioritizationFeeLamports;
  } else {
    requestBody.computeUnitPriceMicroLamports = 'auto';
  }

  try {
    const response = await fetch(`${JUPITER_API_BASE}/swap/v1/swap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jupiter swap transaction failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to Jupiter API. Please check your internet connection or try again later.');
    }
    throw error;
  }
}

// Get token prices using the new API structure
export async function getTokenPrices(tokenIds: string[]): Promise<Record<string, TokenPrice>> {
  // Validate token IDs
  const invalidTokens = tokenIds.filter(id => !isValidSolanaMintAddress(id));
  if (invalidTokens.length > 0) {
    throw new Error(`Invalid token addresses: ${invalidTokens.join(', ')}. All token IDs must be valid Solana mint addresses.`);
  }

  const params = new URLSearchParams({
    ids: tokenIds.join(','),
    vsToken: 'USDC'
  });

  try {
    const response = await fetch(`${JUPITER_PRICE_API}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jupiter price fetch failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.data || {};
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to Jupiter API. Please check your internet connection or try again later.');
    }
    throw error;
  }
}

// Get token information using the new API structure
export async function getTokenInfo(mint: string): Promise<TokenInfo> {
  // Validate mint address
  if (!isValidSolanaMintAddress(mint)) {
    throw new Error(`Invalid mint address: "${mint}". Must be a valid Solana mint address.`);
  }

  try {
    const response = await fetch(`${JUPITER_TOKEN_API}/token/${mint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jupiter token info fetch failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to Jupiter API. Please check your internet connection or try again later.');
    }
    throw error;
  }
}

// Get tradable tokens using the new API structure
export async function getTradableTokens(): Promise<string[]> {
  try {
    const response = await fetch(`${JUPITER_TOKEN_API}/mints/tradable`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jupiter tradable tokens fetch failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      // Provide fallback with popular tokens when API is unavailable
      console.warn('Jupiter API unavailable, using fallback token list');
      return Object.values(POPULAR_TOKENS);
    }
    throw error;
  }
}

// Get tokens by tag using the new API structure
export async function getTokensByTag(tag: string): Promise<TokenInfo[]> {
  try {
    const response = await fetch(`${JUPITER_TOKEN_API}/tagged/${tag}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jupiter tokens by tag fetch failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to Jupiter API. Please check your internet connection or try again later.');
    }
    throw error;
  }
}

// Popular token addresses on Solana (verified mints)
export const POPULAR_TOKENS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  JUP: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
  RAY: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
  ORCA: 'orcaEKTdK7LKz57vaAYr9QeNkY11McCe8BenwNYB',
  BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  WIF: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
  PYTH: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8V9yYac6Y7kGCPn',
  JITO: 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn'
};

// Helper function to format token amount
export function formatTokenAmount(amount: string | number, decimals: number): number {
  const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;
  return amountNum / Math.pow(10, decimals);
}

// Helper function to parse token amount for API
export function parseTokenAmount(amount: number, decimals: number): string {
  return Math.floor(amount * Math.pow(10, decimals)).toString();
}

// Helper function to get program ID to label mapping
export async function getProgramIdToLabel(): Promise<Record<string, string>> {
  try {
    const response = await fetch(`${JUPITER_API_BASE}/swap/v1/program-id-to-label`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jupiter program ID to label fetch failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to Jupiter API. Please check your internet connection or try again later.');
    }
    throw error;
  }
}

// Priority fee estimation helper
export async function estimatePriorityFee(
  connection: any,
  accounts: string[]
): Promise<number> {
  try {
    // This is a simplified priority fee estimation
    // In production, you might want to use more sophisticated methods
    const recentPriorityFees = await connection.getRecentPrioritizationFees({
      lockedWritableAccounts: accounts,
    });
    
    if (recentPriorityFees.length === 0) {
      return 1000; // Default fallback
    }
    
    // Use median priority fee
    const fees = recentPriorityFees.map((fee: any) => fee.prioritizationFee);
    fees.sort((a: number, b: number) => a - b);
    const median = fees[Math.floor(fees.length / 2)];
    
    return Math.max(median, 1000); // Minimum 1000 micro-lamports
  } catch (error) {
    console.warn('Failed to estimate priority fee:', error);
    return 1000; // Fallback
  }
}

// Transaction sending helper with retry logic
export async function sendTransactionWithRetry(
  connection: any,
  transaction: any,
  maxRetries: number = 3
): Promise<string> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const signature = await connection.sendRawTransaction(transaction.serialize(), {
        skipPreflight: false,
        maxRetries: 0, // We handle retries ourselves
        preflightCommitment: 'confirmed'
      });
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
      }
      
      return signature;
    } catch (error) {
      lastError = error as Error;
      console.warn(`Transaction attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  throw lastError || new Error('Transaction failed after all retries');
}