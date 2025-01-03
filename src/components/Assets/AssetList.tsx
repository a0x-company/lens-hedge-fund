import React from "react";
import { Asset } from "./types";
import { cn } from "@/lib/utils";

interface AssetListProps {
  assets: Asset[];
}

export function AssetList({ assets }: AssetListProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-6 grid-flow-col grid-rows-3",
        assets.length > 6 && "grid-cols-3",
        assets.length > 9 && "grid-cols-4"
      )}
    >
      {assets.map((asset) => (
        <div key={asset.name} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: asset.color }}
          />
          <span className="text-sm">
            {asset.name} ({asset.percentage.toFixed(1)}%)
          </span>
        </div>
      ))}
    </div>
  );
}
