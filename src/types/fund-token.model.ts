export interface FundTokenData {
  name: string;
  description: string;
  stats: { label: string; value: string }[];
  assets: { name: string; percentage: number; color: string; fill: string }[];
  metrics: {
    label: string;
    value: string;
    isPercentage?: boolean;
    isPositive?: boolean;
  }[];
  treasuryAddress: string;
  totalNetWorth: number;
  tokenAddress: string;
  tokenImage: string;
  tokenSymbol: string;
  tokenDecimals: number;
  tokenTotalSupply: number;
  poolAddress: string;
  updatedAt: string;
  createdAt: string;
}

export enum FundTokenDataError {
  TOKEN_NAME_REQUIRED = "Token name is required",
  TOKEN_ADDRESS_REQUIRED = "Token address is required",
  FUND_TOKEN_DATA_NOT_FOUND = "Fund token data not found",
  UNKNOWN_ERROR = "Unknown error",
}
