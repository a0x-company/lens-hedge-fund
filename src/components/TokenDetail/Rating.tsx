import React from "react";
import { Star } from "lucide-react";
import Image from "next/image";

interface RatingProps {
  value: number;
}

export function Rating({ value }: RatingProps) {
  return (
    <div className="flex items-center gap-2">
      <button className="p-2 bg-gray-200 rounded-full flex items-center justify-center">
        <Image src="/assets/x-logo.svg" alt="X Logo" width={12} height={12} />
      </button>
      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      <span className="font-medium">{value}</span>
      <button className="ml-4 bg-brand-green-light text-black px-6 py-2 rounded-md hover:bg-brand-green-light/80 transition-colors">
        Manage
      </button>
    </div>
  );
}
