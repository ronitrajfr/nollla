import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useThumbnailStore } from "@/lib/thumbnail-store";
import type { BorderSettings } from "@/lib/thumbnail-editor";

export function EffectsControls() {
  const { borderSettings, updateBorderSettings } = useThumbnailStore();

  const updateSettings = (updates: Partial<BorderSettings>) => {
    updateBorderSettings({ ...borderSettings, ...updates });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="font-medium text-gray-900 mb-4">Border Effects</h3>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={borderSettings.enabled}
            onCheckedChange={(checked) => updateSettings({ enabled: checked })}
          />
          <Label className="text-sm font-medium">Enable border</Label>
        </div>

        {borderSettings.enabled && (
          <>
            <div>
              <Label className="text-sm font-medium">
                Outline Width: {borderSettings.width}px
              </Label>
              <Slider
                value={[borderSettings.width]}
                onValueChange={([value]) => updateSettings({ width: value })}
                min={1}
                max={10}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Border Color</Label>
              <Input
                type="color"
                value={borderSettings.color}
                onChange={(e) => updateSettings({ color: e.target.value })}
                className="w-12 h-10 p-1 mt-2"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">
                Glow Intensity: {borderSettings.blur}px
              </Label>
              <Slider
                value={[borderSettings.blur]}
                onValueChange={([value]) => updateSettings({ blur: value })}
                min={0}
                max={30}
                step={1}
                className="mt-2"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
} 