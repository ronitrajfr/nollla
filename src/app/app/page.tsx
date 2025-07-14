"use client";

import { useRef, useEffect } from "react";
import { useThumbnailStore } from "@/lib/thumbnail-store";
import { loadGoogleFonts } from "@/lib/font-loader";
import { UploadArea } from "@/components/thumbnail-editor/upload-area";
import { PreviewPanel } from "@/components/thumbnail-editor/preview-panel";
import { ControlsPanel } from "@/components/thumbnail-editor/controls-panel";

export default function ThumbnailEditor() {
  const { originalImage, textElements, handleImageUpload, exportThumbnail } =
    useThumbnailStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadGoogleFonts(textElements);
  }, [textElements]);

  const handleExport = async () => {
    if (!canvasRef.current) return;
    await exportThumbnail(canvasRef.current);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Thumbnail Editor
          </h1>
          <p className="text-gray-600">
            Create stunning thumbnails with AI-powered background removal
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {!originalImage ? (
              <UploadArea />
            ) : (
              <PreviewPanel onExport={handleExport} />
            )}
          </div>

          <div>
            <ControlsPanel
              onSubjectUpload={() => fileInputRef.current?.click()}
            />
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file);
        }}
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
