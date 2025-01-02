import React from "react";

interface Asset {
  name: string;
  percentage: number;
  color: string;
}

interface AssetPreferencesProps {
  assets: Asset[];
}

export function AssetPreferences({ assets }: AssetPreferencesProps) {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Asset Preferences</h3>
        <span className="text-sm text-gray-500">30 Days</span>
      </div>
      <div className="relative w-48 h-48 mx-auto">
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          {assets.map((asset, index) => {
            const previousPercentages = assets
              .slice(0, index)
              .reduce((sum, a) => sum + a.percentage, 0);
            const dashArray = asset.percentage;
            const dashOffset = -previousPercentages;

            return (
              <circle
                key={asset.name}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={asset.color}
                strokeWidth="20"
                strokeDasharray={`${dashArray} 100`}
                strokeDashoffset={dashOffset}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>
      </div>
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
    </div>
  );
}
