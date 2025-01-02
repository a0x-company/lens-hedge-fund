import React from "react";

interface Stat {
  label: string;
  value: string | number;
}

interface StatsGridProps {
  stats: Stat[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="font-medium text-lg">{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
