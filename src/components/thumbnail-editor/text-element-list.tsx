import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Type, Copy, Trash2 } from "lucide-react";
import { useThumbnailStore } from "@/lib/thumbnail-store";

export function TextElementList() {
  const {
    textElements,
    selectedTextId,
    addTextElement,
    setSelectedTextId,
    duplicateTextElementById,
    deleteTextElementById,
  } = useThumbnailStore();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">Text Elements</h3>
        <Button
          onClick={addTextElement}
          size="sm"
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Text
        </Button>
      </div>

      {textElements.length === 0 ? (
        <div className="text-center py-8">
          <Type className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 mb-2">No text elements yet</p>
          <p className="text-xs text-gray-400">
            Click "Add Text" to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {textElements.map((element) => (
            <div
              key={element.id}
              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                selectedTextId === element.id
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedTextId(element.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium truncate text-gray-700">
                  {element.text}
                </span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateTextElementById(element.id);
                    }}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTextElementById(element.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge
                  variant={element.behind ? "secondary" : "default"}
                  className="text-xs"
                >
                  {element.behind ? "Behind" : "Front"}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {element.fontFamily}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 