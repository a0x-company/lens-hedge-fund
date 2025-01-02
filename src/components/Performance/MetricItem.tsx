import React from "react";

interface MetricItemProps {
  label: string;
  value: string;
  isPercentage?: boolean;
  isPositive?: boolean;
  vertical?: boolean;
  className?: string;
}

export function MetricItem({
  label,
  value,
  isPercentage,
  isPositive,
  vertical,
  className,
}: MetricItemProps) {
  return (
    <div
      className={`flex ${
        vertical ? "flex-col" : "justify-between items-center"
      } ${className}`}
    >
      <span className="text-gray-600">{label}</span>
      <span className={`font-medium ${isPositive ? "text-brand-green" : ""}`}>
        {value}
        {isPercentage && "%"}
      </span>
    </div>
  );
}
