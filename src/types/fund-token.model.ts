// const tokenInfo = {
//   name: "$CAP",
//   description: "$CAP is a token that is used to reward the community for their contributions to the project.",
//   rating: 1.747,
//   stats: [
//     { label: "Liquidity", value: "$6,135.00" },
//     { label: "24H Volume", value: "$1,234.56" },
//     { label: "APR", value: "100%" }
//   ],
//   assets: [
//     { name: "BTC", percentage: 78.85, color: "#1E88E5", fill: "#1E88E5" },
//     { name: "SOL", percentage: 9.33, color: "#43A047", fill: "#43A047" },
//     { name: "DOGE", percentage: 5.47, color: "#7CB342", fill: "#7CB342" },
//     { name: "ETH", percentage: 1.98, color: "#546E7A", fill: "#546E7A" },
//     { name: "POPCNT", percentage: 1.24, color: "#EC407A", fill: "#EC407A" },
//     { name: "BOME", percentage: 0.43, color: "#FB8C00", fill: "#FB8C00" },
//   ],
//   metrics: [
//     { label: "ROI", value: "+128.00", isPercentage: true, isPositive: true },
//     { label: "PnL", value: "+673,219.94", isPositive: true },
//     { label: "Market Cap", value: "$50,053.00" },
//     { label: "LP Value", value: "$53.00" },
//     { label: "LP Balance", value: "0" },
//     { label: "Your Holdings", value: "0" },
//     { label: "Your Market Value", value: "0" },
//   ],
//   treasuryAddress: "0xf2bE870e0512f3C79613271de77383e8371dEb75",
//   tokenAddress: "0xe31c372a7af875b3b5e0f3713b17ef51556da667",
// };
export interface FundTokenData {
  name: string;
  description: string;
  rating: number;
  stats: { label: string; value: string }[];
  assets: { name: string; percentage: number; color: string; fill: string }[];
  metrics: {
    label: string;
    value: string;
    isPercentage?: boolean;
    isPositive?: boolean;
  }[];
  treasuryAddress: string;
  tokenAddress: string;
  tokenImage: string;
  tokenSymbol: string;
  tokenDecimals: number;
  tokenTotalSupply: string;
  poolAddress: string;
  updatedAt: string;
  createdAt: string;
}

export enum FundTokenDataError {
  TOKEN_NAME_REQUIRED = "Token name is required",
  FUND_TOKEN_DATA_NOT_FOUND = "Fund token data not found",
  UNKNOWN_ERROR = "Unknown error",
}
