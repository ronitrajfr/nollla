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
    <div className="flex items-center justify-center w-full h-[80vh] border-2 border-dashed border-gray-300">
      <div
        className=" rounded-2xl p-16 text-center cursor-pointer hover:border-gray-400 transition-colors w-full max-w-xl"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-16 h-16 mx-auto mb-6 text-gray-400" />
        <p className="text-2xl font-semibold mb-3 text-gray-700">
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
    </div>
  );
}
