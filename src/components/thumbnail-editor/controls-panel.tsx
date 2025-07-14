import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useThumbnailStore } from "@/lib/thumbnail-store";
import { SubjectControls } from "./subject-controls";
import { TextElementList } from "./text-element-list";
import { TextControls } from "./text-controls";
import { BackgroundControls } from "./background-controls";
import { EffectsControls } from "./effects-controls";

interface ControlsPanelProps {
  onSubjectUpload: () => void;
}

export function ControlsPanel({ onSubjectUpload }: ControlsPanelProps) {
  const { textElements, selectedTextId } = useThumbnailStore();
  const selectedText = textElements.find((el) => el.id === selectedTextId);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="subject" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
          <TabsTrigger value="subject" className="data-[state=active]:bg-white">
            subject
          </TabsTrigger>
          <TabsTrigger value="text" className="data-[state=active]:bg-white">
            text
          </TabsTrigger>
          <TabsTrigger value="background" className="data-[state=active]:bg-white">
            background
          </TabsTrigger>
          <TabsTrigger value="effects" className="data-[state=active]:bg-white">
            effects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subject" className="space-y-4">
          <SubjectControls onUploadClick={onSubjectUpload} />
        </TabsContent>

        <TabsContent value="text" className="space-y-4">
          <TextElementList />
          {selectedText && <TextControls />}
        </TabsContent>

        <TabsContent value="background" className="space-y-4">
          <BackgroundControls />
        </TabsContent>

        <TabsContent value="effects" className="space-y-4">
          <EffectsControls />
        </TabsContent>
      </Tabs>
    </div>
  );
} 