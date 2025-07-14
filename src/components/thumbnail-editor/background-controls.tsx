import { useRef } from "react";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { predefinedColors } from "@/lib/constants";
import { Upload } from "lucide-react";
import { useThumbnailStore } from "@/lib/thumbnail-store";

export function BackgroundControls() {
  const {
    backgroundSettings,
    updateBackgroundColor,
    updateBackgroundCustomImage,
    toggleUseCustomImage,
    toggleUseOriginalImage,
  } = useThumbnailStore();
  
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      updateBackgroundCustomImage(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="font-medium text-gray-900 mb-4">Background Settings</h3>

      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch
              checked={backgroundSettings.useOriginalImage}
              onCheckedChange={toggleUseOriginalImage}
            />
            <Label className="text-sm font-medium">Use original background</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={backgroundSettings.useCustomImage}
              onCheckedChange={toggleUseCustomImage}
            />
            <Label className="text-sm font-medium">Use custom background</Label>
          </div>
        </div>

        {backgroundSettings.useCustomImage ? (
          <div>
            <Button
              onClick={() => backgroundInputRef.current?.click()}
              variant="outline"
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Background
            </Button>
            <input
              ref={backgroundInputRef}
              type="file"
              accept="image/*"
              onChange={handleBackgroundUpload}
              className="hidden"
            />
            {backgroundSettings.customImage && (
              <div className="mt-3">
                <NextImage
                  src={backgroundSettings.customImage}
                  alt="Custom background"
                  width={100}
                  height={100}
                  className="rounded-lg border object-cover"
                />
              </div>
            )}
          </div>
        ) : !backgroundSettings.useOriginalImage ? (
          <div>
            <Label className="text-sm font-medium">Background Color</Label>
            <div className="flex gap-2 mt-2">
              <Input
                type="color"
                value={backgroundSettings.color}
                onChange={(e) => updateBackgroundColor(e.target.value)}
                className="w-12 h-10 p-1"
              />
              <Select
                value={backgroundSettings.color}
                onValueChange={updateBackgroundColor}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {predefinedColors.map((color) => (
                    <SelectItem key={color} value={color}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: color }}
                        />
                        {color}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
} 