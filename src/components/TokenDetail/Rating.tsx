// components
import { Dialog, DialogTrigger } from "@/components/shadcn/dialog";

// images
import Image from "next/image";

// components
import { Swap } from "./Swap";

interface RatingProps {
  name: string;
  tokenAddress: string;
  poolAddress: string;
}

export function Rating({ name, tokenAddress, poolAddress }: RatingProps) {
  return (
    <div className="flex items-center gap-2">
      <button className="p-2 bg-gray-200 rounded-full flex items-center justify-center">
        <Image src="/assets/x-logo.svg" alt="X Logo" width={12} height={12} />
      </button>
      <Dialog>
        <DialogTrigger asChild>
          <button className="ml-4 bg-brand-green-light text-black px-6 py-2 rounded-md hover:bg-brand-green-light/80 transition-colors">
            Manage
          </button>
        </DialogTrigger>
        <Swap
          name={name}
          tokenAddress={tokenAddress}
          poolAddress={poolAddress}
        />
      </Dialog>
    </div>
  );
}
