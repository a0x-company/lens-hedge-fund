"use client";

import React from "react";
import { DonutChart } from "./DonutChart";
import { AssetList } from "./AssetList";
import { Asset } from "./types";

interface AssetsSectionProps {
  assets: Asset[];
}

export function AssetsSection({ assets }: AssetsSectionProps) {
  return (
    <section className="p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Asset Preferences</h3>
        <span className="text-sm text-gray-500">30 Days</span>
      </div>
      <div className="flex items-center justify-start gap-4">
        <DonutChart assets={assets} />
        <AssetList assets={assets} />
      </div>
    </section>
  );
}
