import type React from "react";
import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useThumbnailStore } from "@/lib/thumbnail-store";

export function UploadArea() {
  const { handleImageUpload } = useThumbnailStore();
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileChange,
  });

  function handleFileChange(files: File[]) {
    const file = files[0];
    if (file) {
      handleImageUpload(file);
    }
  }

  return (
    <div className="flex items-center justify-center w-full h-[80vh] border-2 border-dashed border-gray-300">
      <div
        className="rounded-2xl p-16 text-center cursor-pointer hover:border-gray-400 transition-colors w-full max-w-xl"
        {...getRootProps()}
      >
        <Upload className="w-16 h-16 mx-auto mb-6 text-gray-400" />
        <p className="text-2xl font-semibold mb-3 text-gray-700">
          Upload your image
        </p>
        <p className="text-gray-500">Click here or drag and drop your image</p>
        <input {...getInputProps({ accept: "image/*" })} className="hidden" />
      </div>
    </div>
  );
}
