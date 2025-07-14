import type React from "react";
import { useRef } from "react";
import { Upload } from "lucide-react";
import { useThumbnailStore } from "@/lib/thumbnail-store";

export function UploadArea() {
  const { handleImageUpload } = useThumbnailStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-gray-400 transition-colors"
      onClick={() => fileInputRef.current?.click()}
    >
      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <p className="text-lg font-medium mb-2 text-gray-700">
        Upload your image
      </p>
      <p className="text-gray-500">Click here or drag and drop your image</p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
