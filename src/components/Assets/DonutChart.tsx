"use client";

import React from "react";
import { Asset } from "./types";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../shadcn/chart";
import { Pie, PieChart } from "recharts";

interface DonutChartProps {
  assets: Asset[];
}

// const chartConfig = {
//   visitors: {
//     label: "Visitors",
//   },
//   chrome: {
//     label: "Chrome",
//     color: "hsl(var(--chart-1))",
//   },
//   safari: {
//     label: "Safari",
//     color: "hsl(var(--chart-2))",
//   },
//   firefox: {
//     label: "Firefox",
//     color: "hsl(var(--chart-3))",
//   },
//   edge: {
//     label: "Edge",
//     color: "hsl(var(--chart-4))",
//   },
//   other: {
//     label: "Other",
//     color: "hsl(var(--chart-5))",
//   },
// } satisfies ChartConfig

const chartConfig = (assets: Asset[]): ChartConfig => {
  return assets.reduce((acc, asset) => {
    acc[asset.name] = {
      label: asset.name,
      color: asset.color,
    };
    return acc;
  }, {} as ChartConfig);
};

export function DonutChart({ assets }: DonutChartProps) {
  return (
    <div className="relative w-48 h-48">
      <ChartContainer
        config={chartConfig(assets)}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                nameKey="name"
                className="bg-white text-black"
              />
            }
          />
          <Pie
            data={assets}
            dataKey="percentage"
            nameKey="name"
            innerRadius={40}
            outerRadius={80}
          />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
