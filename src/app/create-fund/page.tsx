"use client";

// React
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Next
import Image from "next/image";

// Utils
import { cn } from "@/lib/utils";

// Hooks
import { useCreateFund } from "@/hooks/useCreateFund";

// Shadcn
import { useToast } from "@/components/shadcn/use-toast";

import { CheckCircle } from "lucide-react";

export default function CreateFund() {
  const router = useRouter();

  const { toast } = useToast();

  const { createFund, isPending, isSuccess, status } = useCreateFund();

  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    treasuryAddress: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createFund({
        name: formData.name,
        symbol: formData.symbol,
      });

      toast({
        title: "Fund Created Successfully!",
        description: "Redirecting to dashboard...",
      });
    } catch (error) {
      console.error("Error creating fund:", error);
      toast({
        title: "Error",
        description: "Failed to create fund. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Success!",
        description: "Your fund has been created successfully.",
      });
    }
  }, [isSuccess, router, toast]);

  if (status === "success" && isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/50 to-blue-50/50 py-8">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-blue-100/40" />
          <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow">
            <div className="flex flex-col items-center justify-center space-y-4">
              <CheckCircle className="w-20 h-20 text-emerald-500" />
              <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">
                Fund Created Successfully!
              </h1>

              <p className="text-gray-600 text-center">
                Your fund has been created successfully.
              </p>

              <div className="w-full max-w-md bg-emerald-50 rounded-lg p-4 mt-4">
                <p className="text-emerald-700 text-center">
                  <span className="font-semibold">Fund Name:</span>{" "}
                  {formData.name}
                </p>

                <p className="text-emerald-700 text-center">
                  <span className="font-semibold">Symbol:</span>{" "}
                  {formData.symbol}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/50 to-blue-50/50 py-8">
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-blue-100/40" />
        <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">
            Create New Fund
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Fund Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={cn(
                  "w-full font-normal border border-gray-200 rounded-lg p-3 text-[18px]",
                  "bg-white/50 backdrop-blur-sm",
                  "text-gray-800 selection:text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                )}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Symbol <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={handleInputChange}
                className={cn(
                  "w-full font-normal border border-gray-200 rounded-lg p-3 text-[18px]",
                  "bg-white/50 backdrop-blur-sm",
                  "text-gray-800 selection:text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                )}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Treasury Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="treasuryAddress"
                value={formData.treasuryAddress}
                onChange={handleInputChange}
                className={cn(
                  "w-full font-normal border border-gray-200 rounded-lg p-3 text-[18px]",
                  "bg-white/50 backdrop-blur-sm",
                  "text-gray-800 selection:text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                )}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Token Image <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="imageInput"
                  required
                />
                <label
                  htmlFor="imageInput"
                  className={cn(
                    "cursor-pointer bg-gradient-to-r from-emerald-500 to-emerald-600",
                    "hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg"
                  )}
                >
                  Choose Image
                </label>
                {imagePreview && (
                  <div className="relative w-16 h-16">
                    <Image
                      src={imagePreview}
                      alt="Token preview"
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={cn(
                "w-full bg-gradient-to-r from-emerald-500 to-emerald-600",
                "hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-3 rounded-lg",
                "transition-all transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating Fund...
                </span>
              ) : (
                "Create Fund"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
