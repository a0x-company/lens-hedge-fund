"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function CreateFund() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí irá la lógica para crear el fondo
    console.log({ ...formData, imageFile });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-center mb-8">Create New Fund</h1>
        
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
                "w-full font-normal border border-secondary rounded-[8px] p-[8px] text-[18px]",
                "text-secondary selection:text-secondary placeholder:text-secondary focus:outline-none"
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
                "w-full font-normal border border-secondary rounded-[8px] p-[8px] text-[18px]",
                "text-secondary selection:text-secondary placeholder:text-secondary focus:outline-none"
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
                "w-full font-normal border border-secondary rounded-[8px] p-[8px] text-[18px]",
                "text-secondary selection:text-secondary placeholder:text-secondary focus:outline-none"
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
                  "cursor-pointer bg-brand-green-light hover:bg-brand-green-light/80",
                  "transition-colors text-black px-4 py-2 rounded-md"
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
            className={cn(
              "w-full bg-brand-green-light hover:bg-brand-green-light/80",
              "transition-colors text-black px-4 py-2 rounded-md mt-8"
            )}
          >
            Create Fund
          </button>
        </form>
      </div>
    </div>
  );
}
