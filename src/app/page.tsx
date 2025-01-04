"use client";
// components
import { AssetsSection } from "@/components/Assets/AssetsSection";
import { CommentsSection } from "@/components/Comments/CommentsSection";
import { PerformanceSection } from "@/components/Performance/PerformanceSection";
import ChartPrice from "@/components/TokenDetail/ChartPrice";
import { TokenDetailSection } from "@/components/TokenDetail/TokenDetailSection";

// types
import { FundTokenData, FundTokenDataError } from "@/types";

// react query
import { useQuery } from "@tanstack/react-query";

const getFundTokenData = async (tokenName: string): Promise<FundTokenData> => {
  try {
    const response = await fetch(`/api/fund-token-data?tokenName=${tokenName}`);
    if (!response.ok) {
      throw new Error("Fund token data not found");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching fund token data:", error);
    if (
      error instanceof Error &&
      error.message === "Fund token data not found"
    ) {
      throw new Error(FundTokenDataError.FUND_TOKEN_DATA_NOT_FOUND);
    }
    throw new Error(FundTokenDataError.UNKNOWN_ERROR);
  }
};

export default function Home() {
  const tokenName = "CAP";

  const {
    data: tokenInfo,
    // error,
    // isLoading,
  } = useQuery({
    queryKey: ["fund-token-data", tokenName],
    queryFn: () => getFundTokenData(tokenName as string),
    enabled: !!tokenName,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {tokenInfo && (
        <div className="max-w-6xl mx-auto space-y-4">
          <TokenDetailSection
            name={tokenInfo.name}
            description={tokenInfo.description}
            rating={tokenInfo.rating}
            stats={tokenInfo.stats}
            tokenAddress={tokenInfo.tokenAddress}
            poolAddress={tokenInfo.poolAddress}
          />
          <PerformanceSection
            metrics={tokenInfo.metrics}
            tokenAddress={tokenInfo.tokenAddress}
            poolAddress={tokenInfo.poolAddress}
          />
          <AssetsSection
            assets={tokenInfo.assets}
            treasuryAddress={tokenInfo.treasuryAddress}
          />
          <ChartPrice tokenAddress={tokenInfo.tokenAddress} />
          <CommentsSection />
        </div>
      )}
    </div>
  );
}
