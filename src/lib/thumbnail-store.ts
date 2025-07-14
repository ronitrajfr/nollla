import { create } from "zustand";
import { removeBackground } from "@imgly/background-removal";
import type { 
  TextElement, 
  BorderSettings, 
  AspectRatioType, 
  SubjectSettings, 
  BackgroundSettings 
} from "./thumbnail-editor";
import { 
  createTextElement, 
  updateTextElement, 
  duplicateTextElement, 
  deleteTextElement, 
  resetSubjectSettings 
} from "./thumbnail-editor";
import { exportImage } from "./canvas-export";

const removeBackgroundNonBlocking = async (
  imageUrl: string,
  onProgress?: (progress: number, stage: string) => void
): Promise<Blob> => {
  // Yield control to allow UI updates
  await new Promise(resolve => requestAnimationFrame(resolve));
  
  onProgress?.(10, 'Initializing...');
  await new Promise(resolve => setTimeout(resolve, 50));
  
  onProgress?.(30, 'Loading model...');
  await new Promise(resolve => setTimeout(resolve, 50));
  
  try {
    onProgress?.(50, 'Processing image...');
    
    // Use the library's built-in progress callback if available
    const result = await removeBackground(imageUrl, {
      progress: (key: string, current: number, total: number) => {
        const progress = Math.min(50 + (current / total) * 40, 90);
        onProgress?.(progress, `Processing: ${key}`);
      }
    });
    
    onProgress?.(100, 'Complete!');
    return result;
  } catch (error) {
    throw error;
  }
};

interface ThumbnailStore {
  // State
  originalImage: string | null;
  processedImage: string | null;
  isProcessing: boolean;
  processingProgress: number;
  processingStage: string;
  textElements: TextElement[];
  selectedTextId: string | null;
  aspectRatio: AspectRatioType;
  subjectSettings: SubjectSettings;
  borderSettings: BorderSettings;
  backgroundSettings: BackgroundSettings;

  // Actions
  setOriginalImage: (image: string | null) => void;
  setProcessedImage: (image: string | null) => void;
  setIsProcessing: (processing: boolean) => void;
  setAspectRatio: (ratio: AspectRatioType) => void;
  setSelectedTextId: (id: string | null) => void;
  
  // Image handling
  handleImageUpload: (file: File) => Promise<void>;
  
  // Text element actions
  addTextElement: () => void;
  updateTextElementById: (id: string, updates: Partial<TextElement>) => void;
  duplicateTextElementById: (id: string) => void;
  deleteTextElementById: (id: string) => void;
  
  // Subject actions
  updateSubjectPosition: (position: { x: number; y: number }) => void;
  updateSubjectScale: (scale: number) => void;
  updateSubjectRotation: (rotation: number) => void;
  resetSubject: () => void;
  
  // Background actions
  updateBackgroundColor: (color: string) => void;
  updateBackgroundCustomImage: (file: File) => void;
  toggleUseCustomImage: (enabled: boolean) => void;
  toggleUseOriginalImage: (enabled: boolean) => void;
  
  // Border actions
  updateBorderSettings: (settings: BorderSettings) => void;
  
  // Export
  exportThumbnail: (canvas: HTMLCanvasElement) => Promise<void>;
}

export const useThumbnailStore = create<ThumbnailStore>((set, get) => ({
  // Initial state
  originalImage: null,
  processedImage: null,
  isProcessing: false,
  processingProgress: 0,
  processingStage: "",
  textElements: [],
  selectedTextId: null,
  aspectRatio: "16:9",
  subjectSettings: {
    position: { x: 50, y: 50 },
    scale: 100,
    rotation: 0,
  },
  borderSettings: {
    enabled: false,
    width: 3,
    color: "#8b5cf6",
    style: "solid",
    blur: 8,
  },
  backgroundSettings: {
    color: "#ffffff",
    customImage: null,
    useCustomImage: false,
    useOriginalImage: false,
  },

  // Basic setters
  setOriginalImage: (image) => set({ originalImage: image }),
  setProcessedImage: (image) => set({ processedImage: image }),
  setIsProcessing: (processing) => set({ isProcessing: processing }),
  setAspectRatio: (ratio) => set({ aspectRatio: ratio }),
  setSelectedTextId: (id) => set({ selectedTextId: id }),

  // Image handling
  handleImageUpload: async (file) => {
    const imageUrl = URL.createObjectURL(file);
    set({ 
      originalImage: imageUrl, 
      isProcessing: true, 
      processingProgress: 0, 
      processingStage: 'Starting...' 
    });
    
    try {
      const imageBlob = await removeBackgroundNonBlocking(
        imageUrl,
        (progress: number, stage: string) => {
          set({ processingProgress: progress, processingStage: stage });
        }
      );
      const processedUrl = URL.createObjectURL(imageBlob);
      set({ processedImage: processedUrl });
    } catch (error) {
      console.error("Background removal failed:", error);
    } finally {
      set({ 
        isProcessing: false, 
        processingProgress: 0, 
        processingStage: '' 
      });
    }
  },

  // Text element actions
  addTextElement: () => {
    const newText = createTextElement();
    set((state) => ({
      textElements: [...state.textElements, newText],
      selectedTextId: newText.id,
    }));
  },

  updateTextElementById: (id, updates) => {
    set((state) => ({
      textElements: updateTextElement(state.textElements, id, updates),
    }));
  },

  duplicateTextElementById: (id) => {
    set((state) => ({
      textElements: duplicateTextElement(state.textElements, id),
    }));
  },

  deleteTextElementById: (id) => {
    set((state) => ({
      textElements: deleteTextElement(state.textElements, id),
      selectedTextId: state.selectedTextId === id ? null : state.selectedTextId,
    }));
  },

  // Subject actions
  updateSubjectPosition: (position) => {
    set((state) => ({
      subjectSettings: { ...state.subjectSettings, position },
    }));
  },

  updateSubjectScale: (scale) => {
    set((state) => ({
      subjectSettings: { ...state.subjectSettings, scale },
    }));
  },

  updateSubjectRotation: (rotation) => {
    set((state) => ({
      subjectSettings: { ...state.subjectSettings, rotation },
    }));
  },

  resetSubject: () => {
    set({ subjectSettings: resetSubjectSettings() });
  },

  // Background actions
  updateBackgroundColor: (color) => {
    set((state) => ({
      backgroundSettings: { ...state.backgroundSettings, color },
    }));
  },

  updateBackgroundCustomImage: (file) => {
    const imageUrl = URL.createObjectURL(file);
    set((state) => ({
      backgroundSettings: {
        ...state.backgroundSettings,
        customImage: imageUrl,
        useCustomImage: true,
        useOriginalImage: false,
      },
    }));
  },

  toggleUseCustomImage: (enabled) => {
    set((state) => ({
      backgroundSettings: {
        ...state.backgroundSettings,
        useCustomImage: enabled,
        useOriginalImage: enabled ? false : state.backgroundSettings.useOriginalImage,
      },
    }));
  },

  toggleUseOriginalImage: (enabled) => {
    set((state) => ({
      backgroundSettings: {
        ...state.backgroundSettings,
        useOriginalImage: enabled,
        useCustomImage: enabled ? false : state.backgroundSettings.useCustomImage,
      },
    }));
  },

  // Border actions
  updateBorderSettings: (settings) => {
    set({ borderSettings: settings });
  },

  // Export
  exportThumbnail: async (canvas) => {
    const state = get();
    if (!state.processedImage) return;

    await exportImage({
      canvas,
      processedImage: state.processedImage,
      textElements: state.textElements,
      backgroundColor: state.backgroundSettings.color,
      aspectRatio: state.aspectRatio,
      borderSettings: state.borderSettings,
      subjectSettings: state.subjectSettings,
      backgroundSettings: state.backgroundSettings,
      originalImage: state.originalImage,
    });
  },
})); 