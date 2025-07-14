import { useRef, useState } from "react";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Loader2 } from "lucide-react";
import { useThumbnailStore } from "@/lib/thumbnail-store";
import { getPreviewStyle, getCurrentBackground } from "@/lib/thumbnail-editor";
import type { AspectRatioType } from "@/lib/thumbnail-editor";
import { InteractiveSubject } from "./interactive-subject";

interface PreviewPanelProps {
  onExport: () => void;
}

export function PreviewPanel({ onExport }: PreviewPanelProps) {
  const {
    aspectRatio,
    originalImage,
    processedImage,
    isProcessing,
    textElements,
    selectedTextId,
    subjectSettings,
    borderSettings,
    backgroundSettings,
    setAspectRatio,
    setSelectedTextId,
  } = useThumbnailStore();

  const previewRef = useRef<HTMLDivElement>(null);
  const [selectedElement, setSelectedElement] = useState<'subject' | string | null>(null);

  const currentBackground = getCurrentBackground(backgroundSettings, originalImage);
  const previewStyle = getPreviewStyle(aspectRatio);

  const handleAspectRatioChange = (value: AspectRatioType) => {
    setAspectRatio(value);
  };

  const handleTextElementClick = (elementId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTextId(elementId);
    setSelectedElement(elementId);
  };

  const handleSubjectSelect = () => {
    setSelectedTextId(null);
    setSelectedElement('subject');
  };

  const handleSubjectDeselect = () => {
    setSelectedElement(null);
  };

  const handleBackgroundClick = () => {
    setSelectedTextId(null);
    setSelectedElement(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Preview</h2>
          <div className="flex items-center gap-3">
            <Select value={aspectRatio} onValueChange={handleAspectRatioChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16:9">16:9</SelectItem>
                <SelectItem value="9:16">9:16</SelectItem>
                <SelectItem value="1:1">1:1</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={onExport}
              disabled={!processedImage}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-center">
          <div
            ref={previewRef}
            className="relative border border-gray-200 rounded-lg overflow-hidden"
            style={{
              ...previewStyle,
              backgroundColor: !currentBackground ? backgroundSettings.color : "transparent",
              backgroundImage: currentBackground ? `url(${currentBackground})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={handleBackgroundClick}
          >
            {isProcessing ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                  <span className="text-lg font-medium">Processing image...</span>
                </div>
              </div>
            ) : processedImage ? (
              <>
                {textElements
                  .filter((el) => el.behind)
                  .map((element) => (
                    <div
                      key={element.id}
                      className={`absolute cursor-pointer select-none transition-all ${
                        selectedTextId === element.id ? "ring-2 ring-orange-500" : ""
                      }`}
                      style={{
                        left: `${element.x}%`,
                        top: `${element.y}%`,
                        transform: `translate(-50%, -50%) rotate(${element.rotation}deg)`,
                        fontSize: `${element.fontSize}px`,
                        fontFamily: element.fontFamily,
                        fontWeight: element.fontWeight,
                        color: element.color,
                        opacity: element.opacity,
                        letterSpacing: `${element.letterSpacing}px`,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      }}
                      onClick={(e) => handleTextElementClick(element.id, e)}
                    >
                      {element.text}
                    </div>
                  ))}

                <InteractiveSubject
                  processedImage={processedImage}
                  subjectSettings={subjectSettings}
                  borderSettings={borderSettings}
                  isSelected={selectedElement === 'subject'}
                  onSelect={handleSubjectSelect}
                  containerRef={previewRef}
                  onDeselect={handleSubjectDeselect}
                />

                {textElements
                  .filter((el) => !el.behind)
                  .map((element) => (
                    <div
                      key={element.id}
                      className={`absolute cursor-pointer select-none transition-all ${
                        selectedTextId === element.id ? "ring-2 ring-orange-500" : ""
                      }`}
                      style={{
                        left: `${element.x}%`,
                        top: `${element.y}%`,
                        transform: `translate(-50%, -50%) rotate(${element.rotation}deg)`,
                        fontSize: `${element.fontSize}px`,
                        fontFamily: element.fontFamily,
                        fontWeight: element.fontWeight,
                        color: element.color,
                        opacity: element.opacity,
                        letterSpacing: `${element.letterSpacing}px`,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      }}
                      onClick={(e) => handleTextElementClick(element.id, e)}
                    >
                      {element.text}
                    </div>
                  ))}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
} 