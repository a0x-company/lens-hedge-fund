import React from "react";
import { Star } from "lucide-react";

interface RatingProps {
  value: number;
}

export function Rating({ value }: RatingProps) {
  return (
    <div className="flex items-center gap-2">
      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      <span className="font-medium">{value}</span>
      <button className="ml-4 bg-brand-green-light text-black px-6 py-2 rounded-md hover:bg-brand-green-light/80 transition-colors">
        Manage
      </button>
    </div>
  );
}
