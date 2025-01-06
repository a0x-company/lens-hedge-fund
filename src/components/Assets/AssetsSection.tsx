"use client";

import React from "react";
import { DonutChart } from "./DonutChart";
import { AssetList } from "./AssetList";
import { Asset } from "./types";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface AssetsSectionProps {
  assets: Asset[];
  treasuryAddress: string;
  totalNetWorth: number;
}

export function AssetsSection({
  assets,
  treasuryAddress,
  totalNetWorth,
}: AssetsSectionProps) {
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
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          Net Asset Value:{" "}
          <span className="font-bold">${totalNetWorth.toFixed(2)}</span>
        </p>
        <Link
          href={`https://basescan.org/address/${treasuryAddress}`}
          target="_blank"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          {treasuryAddress.slice(0, 6)}...{treasuryAddress.slice(-4)}
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
