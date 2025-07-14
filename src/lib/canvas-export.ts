import type { 
  TextElement, 
  BorderSettings, 
  AspectRatioType,
  SubjectSettings,
  BackgroundSettings 
} from "./thumbnail-editor";
import { getCanvasDimensions, getPreviewStyle, getCurrentBackground } from "./thumbnail-editor";
import { waitForFontsReady } from "./font-loader";

export interface ExportOptions {
  canvas: HTMLCanvasElement;
  processedImage: string;
  textElements: TextElement[];
  backgroundColor: string;
  aspectRatio: AspectRatioType;
  borderSettings: BorderSettings;
  subjectSettings: SubjectSettings;
  backgroundSettings: BackgroundSettings;
  originalImage: string | null;
}

export const exportImage = async (options: ExportOptions) => {
  const {
    canvas,
    processedImage,
    textElements,
    backgroundColor,
    aspectRatio,
    borderSettings,
    subjectSettings,
    backgroundSettings,
    originalImage,
  } = options;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dimensions = getCanvasDimensions(aspectRatio);
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const currentBg = getCurrentBackground(backgroundSettings, originalImage);
  
  if (currentBg) {
    await drawBackground(ctx, currentBg, canvas, backgroundColor);
  } else {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  drawTextElements(ctx, textElements.filter(el => el.behind), canvas, aspectRatio);
  await drawSubject(ctx, processedImage, canvas, subjectSettings, borderSettings, aspectRatio);
  drawTextElements(ctx, textElements.filter(el => !el.behind), canvas, aspectRatio);

  triggerDownload(canvas, aspectRatio);
};

const drawBackground = (
  ctx: CanvasRenderingContext2D,
  backgroundUrl: string,
  canvas: HTMLCanvasElement,
  fallbackColor: string
): Promise<void> => {
  return new Promise((resolve) => {
    const bgImg = new window.Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.onload = () => {
      const imgAspect = bgImg.width / bgImg.height;
      const canvasAspect = canvas.width / canvas.height;

      let drawWidth, drawHeight, drawX, drawY;

      if (imgAspect > canvasAspect) {
        drawHeight = canvas.height;
        drawWidth = drawHeight * imgAspect;
        drawX = (canvas.width - drawWidth) / 2;
        drawY = 0;
      } else {
        drawWidth = canvas.width;
        drawHeight = drawWidth / imgAspect;
        drawX = 0;
        drawY = (canvas.height - drawHeight) / 2;
      }

      ctx.drawImage(bgImg, drawX, drawY, drawWidth, drawHeight);
      resolve();
    };
    bgImg.onerror = () => {
      ctx.fillStyle = fallbackColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      resolve();
    };
    bgImg.src = backgroundUrl;
  });
};

const drawSubject = (
  ctx: CanvasRenderingContext2D,
  processedImage: string,
  canvas: HTMLCanvasElement,
  subjectSettings: SubjectSettings,
  borderSettings: BorderSettings,
  aspectRatio: AspectRatioType
): Promise<void> => {
  return new Promise(async (resolve) => {
    await waitForFontsReady();
    
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Use consistent base size like the preview (400px)
      const baseSize = 400;
      const previewStyle = getPreviewStyle(aspectRatio); // Use actual aspect ratio
      const canvasScale = canvas.width / previewStyle.width;
      
      // Calculate scaled base size for canvas
      const scaledBaseSize = baseSize * canvasScale;
      
      // Apply subject scale
      const finalScale = subjectSettings.scale / 100;
      const width = scaledBaseSize * finalScale;
      const height = scaledBaseSize * finalScale;
      
      // Position calculation
      const x = (canvas.width * subjectSettings.position.x) / 100 - width / 2;
      const y = (canvas.height * subjectSettings.position.y) / 100 - height / 2;

      ctx.save();
      ctx.translate(x + width / 2, y + height / 2);
      ctx.rotate((subjectSettings.rotation * Math.PI) / 180);
      ctx.translate(-width / 2, -height / 2);

      if (borderSettings.enabled) {
        ctx.save();
        ctx.shadowColor = borderSettings.color;
        ctx.shadowBlur = borderSettings.blur + borderSettings.width;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        for (let i = 0; i < borderSettings.width; i++) {
          ctx.drawImage(img, 0, 0, width, height);
        }
        ctx.restore();
      }

      ctx.drawImage(img, 0, 0, width, height);
      ctx.restore();
      resolve();
    };
    img.onerror = () => {
      console.error("Failed to load processed image for export");
      resolve();
    };
    img.src = processedImage;
  });
};

const drawTextElements = (
  ctx: CanvasRenderingContext2D,
  elements: TextElement[],
  canvas: HTMLCanvasElement,
  aspectRatio: AspectRatioType
) => {
  elements.forEach((element) => {
    ctx.save();
    const x = (canvas.width * element.x) / 100;
    const y = (canvas.height * element.y) / 100;
    ctx.translate(x, y);
    ctx.rotate((element.rotation * Math.PI) / 180);
    ctx.globalAlpha = element.opacity;
    ctx.fillStyle = element.color;

    const previewStyle = getPreviewStyle(aspectRatio);
    const fontScale = canvas.width / previewStyle.width;
    ctx.font = `${element.fontWeight} ${element.fontSize * fontScale}px ${element.fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (element.letterSpacing > 0) {
      const chars = element.text.split("");
      let currentX = 0;
      const totalWidth = chars.reduce((width, char, i) => {
        const charWidth = ctx.measureText(char).width;
        return width + charWidth + (i < chars.length - 1 ? element.letterSpacing * fontScale : 0);
      }, 0);
      currentX = -totalWidth / 2;
      chars.forEach((char, i) => {
        const charWidth = ctx.measureText(char).width;
        ctx.fillText(char, currentX + charWidth / 2, 0);
        currentX += charWidth + element.letterSpacing * fontScale;
      });
    } else {
      ctx.fillText(element.text, 0, 0);
    }
    ctx.restore();
  });
};

const triggerDownload = (canvas: HTMLCanvasElement, aspectRatio: AspectRatioType) => {
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = `thumbnail-${aspectRatio.replace(":", "x")}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 