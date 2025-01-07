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
import { useParams, useSearchParams } from "next/navigation";

const getFundTokenData = async (
  tokenName: string,
  tokenAddress: string
): Promise<FundTokenData> => {
  try {
    const response = await fetch(
      `/api/fund-token-data?tokenName=${tokenName}&tokenAddress=${tokenAddress}`
    );
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

const getStats = async (tokenAddress: string) => {
  const stats = await fetch(`/api/stats?tokenAddress=${tokenAddress}`);
  const data = await stats.json();
  return data;
};

export default function TokenPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const tokenName = params.tokenName as string;
  const tokenAddress = searchParams.get("token");

  const {
    data: tokenInfo,
    // error,
    // isLoading,
  } = useQuery({
    queryKey: ["fund-token-data", tokenName],
    queryFn: () =>
      getFundTokenData(tokenName as string, tokenAddress as string),
    enabled: !!tokenName,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["stats", tokenAddress],
    queryFn: () => getStats(tokenAddress as string),
    enabled: !!tokenAddress,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {tokenInfo && stats && (
        <div className="max-w-6xl mx-auto space-y-4">
          <TokenDetailSection
            name={tokenInfo.name}
            description={tokenInfo.description}
            stats={stats}
            tokenAddress={tokenInfo.tokenAddress}
            poolAddress={tokenInfo.poolAddress}
            imageURL={tokenInfo.tokenImage}
          />
          <PerformanceSection
            metrics={tokenInfo.metrics}
            tokenAddress={tokenInfo.tokenAddress}
            poolAddress={tokenInfo.poolAddress}
          />
          <AssetsSection
            assets={tokenInfo.assets}
            treasuryAddress={tokenInfo.treasuryAddress}
            totalNetWorth={tokenInfo.totalNetWorth}
          />
          <ChartPrice tokenAddress={tokenInfo.tokenAddress} />
          <CommentsSection tokenAddress={tokenInfo.tokenAddress} />
        </div>
      )}
    </div>
  );
}
