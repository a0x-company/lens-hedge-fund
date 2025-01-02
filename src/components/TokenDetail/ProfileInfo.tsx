import React from "react";

interface ProfileInfoProps {
  name: string;
  description: string;
}

export function ProfileInfo({ name, description }: ProfileInfoProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-gray-200"></div>
      <div>
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
