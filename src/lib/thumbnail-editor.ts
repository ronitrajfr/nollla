export interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight: number;
  rotation: number;
  opacity: number;
  letterSpacing: number;
  behind: boolean;
}

export interface BorderSettings {
  enabled: boolean;
  width: number;
  color: string;
  style: "solid" | "dashed" | "dotted";
  blur: number;
}

export type AspectRatioType = "16:9" | "1:1" | "9:16";

export interface SubjectSettings {
  position: { x: number; y: number };
  scale: number;
  rotation: number;
}

export interface BackgroundSettings {
  color: string;
  customImage: string | null;
  useCustomImage: boolean;
  useOriginalImage: boolean;
}

export const getCanvasDimensions = (aspectRatio: AspectRatioType) => {
  switch (aspectRatio) {
    case "16:9":
      return { width: 1920, height: 1080 };
    case "9:16":
      return { width: 1080, height: 1920 };
    case "1:1":
    default:
      return { width: 1200, height: 1200 };
  }
};

export const getPreviewStyle = (aspectRatio: AspectRatioType) => {
  const dimensions = getCanvasDimensions(aspectRatio);
  const maxWidth = 800;
  const maxHeight = 600;
  const scale = Math.min(maxWidth / dimensions.width, maxHeight / dimensions.height);
  
  return {
    width: dimensions.width * scale,
    height: dimensions.height * scale,
  };
};

export const getCurrentBackground = (
  backgroundSettings: BackgroundSettings,
  originalImage: string | null
) => {
  if (backgroundSettings.useCustomImage && backgroundSettings.customImage) {
    return backgroundSettings.customImage;
  }
  if (backgroundSettings.useOriginalImage && originalImage) {
    return originalImage;
  }
  return null;
};

export const createTextElement = (overrides: Partial<TextElement> = {}): TextElement => ({
  id: Date.now().toString(),
  text: "Your Text Here",
  x: 50,
  y: 50,
  fontSize: 48,
  fontFamily: "Inter",
  color: "#ffffff",
  fontWeight: 700,
  rotation: 0,
  opacity: 1,
  letterSpacing: 0,
  behind: false,
  ...overrides,
});

export const updateTextElement = (
  elements: TextElement[],
  id: string,
  updates: Partial<TextElement>
): TextElement[] => {
  return elements.map((el) => (el.id === id ? { ...el, ...updates } : el));
};

export const duplicateTextElement = (
  elements: TextElement[],
  id: string
): TextElement[] => {
  const element = elements.find((el) => el.id === id);
  if (!element) return elements;
  
  const newElement = {
    ...element,
    id: Date.now().toString(),
    x: element.x + 5,
    y: element.y + 5,
  };
  return [...elements, newElement];
};

export const deleteTextElement = (elements: TextElement[], id: string): TextElement[] => {
  return elements.filter((el) => el.id !== id);
};

export const resetSubjectSettings = (): SubjectSettings => ({
  position: { x: 50, y: 50 },
  scale: 100,
  rotation: 0,
}); 