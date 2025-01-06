import React, { useEffect, useMemo } from "react";
import { MetricItem } from "./MetricItem";
import { useAccount, useReadContracts } from "wagmi";
import { erc20Abi, formatUnits } from "viem";
import { useQuery } from "@tanstack/react-query";

interface Metric {
  label: string;
  value: string;
  isPercentage?: boolean;
  isPositive?: boolean;
}

interface PerformanceSectionProps {
  metrics: Metric[];
  tokenAddress: string;
  poolAddress: string;
}

const getPrices = async (poolAddress: string) => {
  try {
    const price = await fetch(`/api/prices?poolAddress=${poolAddress}`);
    const data = await price.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export function PerformanceSection({
  metrics,
  tokenAddress,
  poolAddress,
}: PerformanceSectionProps) {
  /* Token Balance */
  const { address } = useAccount();
  const tokenBalance = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address!],
      },
      {
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "symbol",
      },
    ],
  });

  const tokenBalanceFormatted = useMemo(() => {
    if (!tokenBalance.data || tokenBalance.data.length < 2) return 0;
    return formatUnits(tokenBalance.data[0], tokenBalance.data[1]) || 0;
  }, [tokenBalance.data]);

  const { data: priceToken } = useQuery({
    queryKey: ["priceToken", tokenAddress],
    queryFn: () => getPrices(poolAddress),
    enabled: !!poolAddress,
    refetchInterval: 0,
  });

  useEffect(() => {
    if (tokenBalance.data) {
      metrics[1].value = tokenBalanceFormatted.toString();
    }
  }, [tokenBalance, tokenBalanceFormatted, metrics]);

  useEffect(() => {
    if (priceToken) {
      console.log(priceToken);
      // metrics[4].value = (
      //   parseFloat(tokenBalanceFormatted.toString()) *
      //   parseFloat(priceToken?.price.toString())
      // ).toString();
    }
  }, [tokenBalanceFormatted, priceToken, metrics]);

  return (
    <section className="space-y-4 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold">Performance</h3>
      <div className="flex items-center justify-between">
        {metrics.slice(0, 2).map((metric, index) => (
          <MetricItem
            key={index}
            {...metric}
            vertical={true}
            className={index % 2 !== 0 ? "text-end" : ""}
          />
        ))}
      </div>
      <div className="space-y-3">
        {metrics.slice(2).map((metric, index) => (
          <MetricItem key={index} {...metric} />
        ))}
      </div>
    </section>
  );
}
