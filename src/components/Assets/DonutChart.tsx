import React from "react";
import { Asset } from "./types";

interface DonutChartProps {
  assets: Asset[];
}

export function DonutChart({ assets }: DonutChartProps) {
  return (
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
  );
}
