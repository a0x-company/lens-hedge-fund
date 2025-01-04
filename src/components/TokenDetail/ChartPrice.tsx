"use client";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { memo } from "react";

interface ChartProps {
  tokenAddress: string;
}
const url =
  "https://dexscreener.com/base/tokenAddress?embed=1&loadChartSettings=0&trades=0&tabs=0&info=0&chartLeftToolbar=0&chartTheme=light&theme=light&chartStyle=1&chartType=usd&interval=240";

const parseTokenAddress = (tokenAddress: string) => {
  return url.replace("tokenAddress", tokenAddress);
};

export function Chart({ tokenAddress }: ChartProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const size = isMobile ? `h-[467px] w-[360px]` : `h-[580px] w-[100%]`;
  return (
    <iframe
      className={size}
      id="dexscreener-embed"
      title="Dexscreener Embed"
      src={parseTokenAddress(tokenAddress)}
      allow="clipboard-write"
      allowFullScreen
    ></iframe>
  );
}

export default memo(Chart);
