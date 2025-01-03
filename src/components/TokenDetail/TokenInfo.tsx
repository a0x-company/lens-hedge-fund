interface TokenInfoProps {
  name: string;
  description: string;
}

export function TokenInfo({ name, description }: TokenInfoProps) {
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
