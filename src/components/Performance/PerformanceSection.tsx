import React from "react";
import { MetricItem } from "./MetricItem";

interface Metric {
  label: string;
  value: string;
  isPercentage?: boolean;
  isPositive?: boolean;
}

interface PerformanceSectionProps {
  metrics: Metric[];
}

export function PerformanceSection({ metrics }: PerformanceSectionProps) {
  return (
    <section className="space-y-4 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold">Performance</h3>
      <div className="flex items-center justify-between">
        {metrics.slice(0, 2).map((metric, index) => (
          <MetricItem
            key={index}
            {...metric}
            vertical={true}
            className={index % 2 !== 0 ? "text-end" : ""}
          />
        ))}
      </div>
      <div className="space-y-3">
        {metrics.slice(2).map((metric, index) => (
          <MetricItem key={index} {...metric} />
        ))}
      </div>
    </section>
  );
}
