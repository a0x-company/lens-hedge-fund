import React from "react";
import { Asset } from "./types";

interface AssetListProps {
  assets: Asset[];
}

export function AssetList({ assets }: AssetListProps) {
  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
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
