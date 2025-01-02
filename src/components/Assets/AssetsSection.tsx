import React from "react";
import { DonutChart } from "./DonutChart";
import { AssetList } from "./AssetList";
import { Asset } from "./types";

interface AssetsSectionProps {
  assets: Asset[];
}

export function AssetsSection({ assets }: AssetsSectionProps) {
  return (
    <section className="p-4 bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Asset Preferences</h3>
        <span className="text-sm text-gray-500">30 Days</span>
      </div>
      <DonutChart assets={assets} />
      <AssetList assets={assets} />
    </section>
  );
}
