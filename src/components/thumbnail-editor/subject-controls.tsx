import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Upload, Move, ZoomIn, RotateCw, RotateCcw } from "lucide-react";
import { useThumbnailStore } from "@/lib/thumbnail-store";

interface SubjectControlsProps {
  onUploadClick: () => void;
}

export function SubjectControls({ onUploadClick }: SubjectControlsProps) {
  const {
    subjectSettings,
    updateSubjectPosition,
    updateSubjectScale,
    updateSubjectRotation,
    resetSubject,
  } = useThumbnailStore();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="font-medium text-gray-900 mb-4">Subject Controls</h3>

      <div className="space-y-4">
        <Button
          onClick={onUploadClick}
          variant="outline"
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload New Image
        </Button>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium flex items-center gap-2">
              <Move className="w-4 h-4" />
              Position X: {subjectSettings.position.x.toFixed(2)}%
            </Label>
            <Slider
              value={[subjectSettings.position.x]}
              onValueChange={([value]) =>
                updateSubjectPosition({ ...subjectSettings.position, x: value })
              }
              min={0}
              max={100}
              step={1}
              className="mt-2"
            />
          </div>
          <div>
            <Label className="text-sm font-medium flex items-center gap-2">
              <Move className="w-4 h-4" />
              Position Y: {subjectSettings.position.y.toFixed(2)}%
            </Label>
            <Slider
              value={[subjectSettings.position.y]}
              onValueChange={([value]) =>
                updateSubjectPosition({ ...subjectSettings.position, y: value })
              }
              min={0}
              max={100}
              step={1}
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium flex items-center gap-2">
            <ZoomIn className="w-4 h-4" />
            Scale: {subjectSettings.scale.toFixed(2)}%
          </Label>
          <Slider
            value={[subjectSettings.scale]}
            onValueChange={([value]) => updateSubjectScale(value)}
            min={10}
            max={200}
            step={5}
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm font-medium flex items-center gap-2">
            <RotateCw className="w-4 h-4" />
            Rotation: {subjectSettings.rotation}°
          </Label>
          <Slider
            value={[subjectSettings.rotation]}
            onValueChange={([value]) => updateSubjectRotation(value)}
            min={-180}
            max={180}
            step={1}
            className="mt-2"
          />
        </div>

        <Button
          onClick={resetSubject}
          variant="outline"
          className="w-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
} 