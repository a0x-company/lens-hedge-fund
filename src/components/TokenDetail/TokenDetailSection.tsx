import { TokenInfo } from "./TokenInfo";
import { Rating } from "./Rating";
import { StatsGrid } from "./StatsGrid";

interface TokenDetailSectionProps {
  name: string;
  description: string;
  stats: Array<{ label: string; value: string }>;
  tokenAddress: string;
  poolAddress: string;
  imageURL: string;
}

export function TokenDetailSection({
  name,
  description,
  stats,
  tokenAddress,
  poolAddress,
  imageURL,
}: TokenDetailSectionProps) {
  return (
    <section className="space-y-4 bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="flex items-center justify-between px-6 pt-6">
        <TokenInfo name={name} description={description} imageURL={imageURL} />
        <Rating
          name={name}
          tokenAddress={tokenAddress}
          poolAddress={poolAddress}
        />
      </div>
      <StatsGrid stats={stats} />
    </section>
  );
}
