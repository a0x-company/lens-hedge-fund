import Image from "next/image";

interface TokenInfoProps {
  name: string;
  description: string;
  imageURL: string;
}

export function TokenInfo({ name, description, imageURL }: TokenInfoProps) {
  return (
    <div className="flex items-center gap-4">
      {imageURL ? (
        <Image src={imageURL} alt={name} width={48} height={48} />
      ) : (
        <div className="w-12 h-12 rounded-xl bg-gray-200"></div>
      )}
      <div>
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
