import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fonts, predefinedColors } from "@/lib/constants";
import { useThumbnailStore } from "@/lib/thumbnail-store";
import type { TextElement } from "@/lib/thumbnail-editor";

export function TextControls() {
  const {
    textElements,
    selectedTextId,
    updateTextElementById,
  } = useThumbnailStore();

  const selectedText = textElements.find(el => el.id === selectedTextId);

  if (!selectedText) return null;

  const onUpdate = (updates: Partial<TextElement>) => {
    updateTextElementById(selectedText.id, updates);
  };

  return (
    <div className="space-y-4 border-t pt-4">
      <div>
        <Label className="text-sm font-medium">Text Content</Label>
        <Textarea
          value={selectedText.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          placeholder="Enter your text"
          className="mt-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Font</Label>
          <Select
            value={selectedText.fontFamily}
            onValueChange={(value) => onUpdate({ fontFamily: value })}
          >
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fonts.map((font) => (
                <SelectItem key={font} value={font}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm font-medium">Color</Label>
          <div className="flex gap-2 mt-2">
            <Input
              type="color"
              value={selectedText.color}
              onChange={(e) => onUpdate({ color: e.target.value })}
              className="w-12 h-10 p-1"
            />
            <Select
              value={selectedText.color}
              onValueChange={(value) => onUpdate({ color: value })}
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
      </div>

      <div>
        <Label className="text-sm font-medium">
          Size: {selectedText.fontSize}px
        </Label>
        <Slider
          value={[selectedText.fontSize]}
          onValueChange={([value]) => onUpdate({ fontSize: value })}
          min={12}
          max={120}
          step={1}
          className="mt-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">X: {selectedText.x}%</Label>
          <Slider
            value={[selectedText.x]}
            onValueChange={([value]) => onUpdate({ x: value })}
            min={0}
            max={100}
            step={1}
            className="mt-2"
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Y: {selectedText.y}%</Label>
          <Slider
            value={[selectedText.y]}
            onValueChange={([value]) => onUpdate({ y: value })}
            min={0}
            max={100}
            step={1}
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">
          Rotation: {selectedText.rotation}°
        </Label>
        <Slider
          value={[selectedText.rotation]}
          onValueChange={([value]) => onUpdate({ rotation: value })}
          min={-180}
          max={180}
          step={1}
          className="mt-2"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={selectedText.behind}
          onCheckedChange={(checked) => onUpdate({ behind: checked })}
        />
        <Label className="text-sm font-medium">Place behind subject</Label>
      </div>
    </div>
  );
} 