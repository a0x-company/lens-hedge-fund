import { AssetsSection } from "@/components/Assets/AssetsSection";
import { CommentsSection } from "@/components/Comments/CommentsSection";
import { PerformanceSection } from "@/components/Performance/PerformanceSection";
import { TokenDetailSection } from "@/components/TokenDetail/TokenDetailSection";

export default function Home() {
  const stats = [
    { label: "Liquidity", value: "$6,135.00" },
    { label: "24H Volume", value: "$1,234.56" },
    { label: "APR", value: "100%" },
  ];

  const metrics = [
    { label: "ROI", value: "+128.00", isPercentage: true, isPositive: true },
    { label: "PnL", value: "+673,219.94", isPositive: true },
    { label: "Market Cap", value: "$50,053.00" },
    { label: "LP Value", value: "$53.00" },
    { label: "LP Balance", value: "0" },
    { label: "Your Holdings", value: "0" },
    { label: "Your Market Value", value: "0" },
  ];

  const assets = [
    { name: "BTC", percentage: 78.85, color: "#1E88E5", fill: "#1E88E5" },
    { name: "SOL", percentage: 9.33, color: "#43A047", fill: "#43A047" },
    { name: "DOGE", percentage: 5.47, color: "#7CB342", fill: "#7CB342" },
    { name: "ETH", percentage: 1.98, color: "#546E7A", fill: "#546E7A" },
    { name: "POPCNT", percentage: 1.24, color: "#EC407A", fill: "#EC407A" },
    { name: "BOME", percentage: 0.43, color: "#FB8C00", fill: "#FB8C00" },
  ];
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto space-y-4">
        <TokenDetailSection
          name="$CAP"
          description="$CAP is a token that is used to reward the community for their contributions to the project."
          rating={1.747}
          stats={stats}
        />
        <PerformanceSection metrics={metrics} />
        <AssetsSection assets={assets} />
        <CommentsSection />
      </div>
    </div>
  );
}
