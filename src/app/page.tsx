"use client";

import type React from "react";
import { useRef, useState, useCallback, useEffect } from "react";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Download,
  RotateCcw,
  Type,
  Loader2,
  Plus,
  Trash2,
  Copy,
  Move,
  RotateCw,
  ZoomIn,
} from "lucide-react";
import { removeBackground } from "@imgly/background-removal";

interface TextElement {
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

interface BorderSettings {
  enabled: boolean;
  width: number;
  color: string;
  style: "solid" | "dashed" | "dotted";
  blur: number;
}

type AspectRatioType = "16:9" | "1:1" | "9:16";

export default function ThumbnailEditor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  const [useCustomBackground, setUseCustomBackground] = useState(false);
  const [useOriginalBackground, setUseOriginalBackground] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>("16:9");
  const [borderSettings, setBorderSettings] = useState<BorderSettings>({
    enabled: false,
    width: 3,
    color: "#8b5cf6",
    style: "solid",
    blur: 8,
  });
  const [subjectPosition, setSubjectPosition] = useState({ x: 50, y: 50 });
  const [subjectScale, setSubjectScale] = useState(100);
  const [subjectRotation, setSubjectRotation] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const fonts = [
    // Sans-serif fonts
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Source Sans Pro",
    "Oswald",
    "Raleway",
    "PT Sans",
    "Lora",
    "Ubuntu",
    "Nunito",
    "Poppins",
    "Merriweather",
    "Playfair Display",
    "Fira Sans",
    "Noto Sans",
    "Work Sans",
    "Barlow",
    "Mukti",
    "Rubik",
    "Karla",
    "Hind",
    "Libre Franklin",
    "Oxygen",
    "Quicksand",
    "Muli",
    "Libre Baskerville",
    "Crimson Text",
    "Bitter",
    "Arvo",
    "Vollkorn",
    "Alegreya",
    "Gentium Basic",
    "Droid Sans",
    "Droid Serif",
    "PT Serif",
    "Slabo 27px",
    "Slabo 13px",
    "Abril Fatface",
    "Ultra",
    "Righteous",
    "Bangers",
    "Fredoka One",
    "Lobster",
    "Pacifico",
    "Dancing Script",
    "Great Vibes",
    "Satisfy",
    "Kaushan Script",
    "Amatic SC",
    "Caveat",
    "Indie Flower",
    "Shadows Into Light",
    "Permanent Marker",

    // Serif fonts
    "Times New Roman",
    "Georgia",
    "Garamond",
    "Book Antiqua",
    "Palatino",
    "Times",
    "Cambria",
    "Constantia",
    "Baskerville",
    "Caslon",
    "Minion Pro",
    "Adobe Garamond Pro",
    "Trajan Pro",
    "Optima",
    "Gill Sans",
    "Futura",
    "Avenir",
    "Proxima Nova",
    "Gotham",
    "Brandon Grotesque",
    "Circular",
    "SF Pro Display",
    "SF Pro Text",
    "Helvetica Neue",
    "Arial",
    "Verdana",
    "Tahoma",
    "Geneva",
    "Lucida Grande",
    "Trebuchet MS",
    "Century Gothic",
    "Franklin Gothic Medium",
    "Impact",
    "Arial Black",

    // Display fonts
    "Bebas Neue",
    "Anton",
    "Fjalla One",
    "Russo One",
    "Squada One",
    "Alfa Slab One",
    "Black Ops One",
    "Orbitron",
    "Exo",
    "Rajdhani",
    "Titillium Web",
    "Play",
    "Audiowide",
    "Electrolize",
    "Michroma",
    "Aldrich",
    "Jura",
    "Quantico",
    "Syncopate",
    "Advent Pro",
    "Poiret One",
    "Comfortaa",
    "Varela Round",
    "Nunito Sans",
    "Catamaran",
    "Monda",
    "Questrial",

    // Script fonts
    "Allura",
    "Alex Brush",
    "Tangerine",
    "Pinyon Script",
    "Courgette",
    "Cookie",
    "Handlee",
    "Kalam",
    "Patrick Hand",
    "Architects Daughter",
    "Covered By Your Grace",
    "Gloria Hallelujah",
    "Schoolbell",
    "Reenie Beanie",
    "Coming Soon",
    "Neucha",
    "Kalam",
    "Caveat Brush",
    "Markerfield",
    "Yellowtail",
    "Rochester",
    "Herr Von Muellerhoff",
    "Mr De Haviland",

    // Monospace fonts
    "Courier New",
    "Monaco",
    "Menlo",
    "Consolas",
    "DejaVu Sans Mono",
    "Liberation Mono",
    "Courier",
    "Lucida Console",
    "Andale Mono",
    "Source Code Pro",
    "Fira Code",
    "JetBrains Mono",
    "Roboto Mono",
    "Ubuntu Mono",
    "Space Mono",
    "Inconsolata",
  ];

  // Dynamically load Google fonts that are used in the composition so that they
  // also render correctly in the downloaded image / canvas export.
  useEffect(() => {
    const uniqueFonts = Array.from(
      new Set(textElements.map((el) => el.fontFamily))
    );
    uniqueFonts.forEach((font) => {
      // If the font is already available, skip.
      if (document.fonts.check(`16px "${font}"`)) return;

      // Avoid injecting duplicate links.
      const id = `google-font-${font.replace(/\\s+/g, "-")}`;
      if (document.getElementById(id)) return;

      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(
        /\\s+/g,
        "+"
      )}:wght@400;700&display=swap`;
      document.head.appendChild(link);
    });
  }, [textElements]);

  const predefinedColors = [
    "#ffffff",
    "#000000",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
    "#ffa500",
    "#800080",
  ];

  // Get canvas dimensions based on aspect ratio
  const getCanvasDimensions = () => {
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

  // Get preview aspect ratio class
  const getPreviewAspectRatio = () => {
    switch (aspectRatio) {
      case "16:9":
        return "aspect-video";
      case "9:16":
        return "aspect-[9/16]";
      case "1:1":
      default:
        return "aspect-square";
    }
  };

  // Get current background
  const getCurrentBackground = () => {
    if (useCustomBackground && customBackground) {
      return customBackground;
    }
    if (useOriginalBackground && originalImage) {
      return originalImage;
    }
    return null;
  };

  const handleImageUpload = useCallback(async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setOriginalImage(imageUrl);
    setIsProcessing(true);
    try {
      const imageBlob = await removeBackground(imageUrl);
      const processedUrl = URL.createObjectURL(imageBlob);
      setProcessedImage(processedUrl);
    } catch (error) {
      console.error("Background removal failed:", error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleBackgroundUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCustomBackground(imageUrl);
      setUseCustomBackground(true);
      setUseOriginalBackground(false);
    }
  };

  const addTextElement = () => {
    const newText: TextElement = {
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
    };
    setTextElements((prev) => [...prev, newText]);
    setSelectedTextId(newText.id);
  };

  const updateTextElement = (id: string, updates: Partial<TextElement>) => {
    setTextElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const duplicateTextElement = (id: string) => {
    const element = textElements.find((el) => el.id === id);
    if (element) {
      const newElement = {
        ...element,
        id: Date.now().toString(),
        x: element.x + 5,
        y: element.y + 5,
      };
      setTextElements((prev) => [...prev, newElement]);
    }
  };

  const deleteTextElement = (id: string) => {
    setTextElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedTextId === id) {
      setSelectedTextId(null);
    }
  };

  const selectedText = textElements.find((el) => el.id === selectedTextId);

  const exportImage = useCallback(() => {
    if (!canvasRef.current || !processedImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size based on aspect ratio
    const dimensions = getCanvasDimensions();
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawComposition = () => {
      // Draw background
      const currentBg = getCurrentBackground();
      if (currentBg) {
        // Use native HTML Image constructor, not Next.js Image component
        const bgImg = new window.Image();
        bgImg.crossOrigin = "anonymous";
        bgImg.onload = () => {
          const imgAspect = bgImg.width / bgImg.height;
          const canvasAspect = canvas.width / canvas.height;

          let drawWidth, drawHeight, drawX, drawY;

          if (imgAspect > canvasAspect) {
            // Image is wider than canvas, so fit to width
            drawWidth = canvas.width;
            drawHeight = drawWidth / imgAspect;
            drawX = 0;
            drawY = (canvas.height - drawHeight) / 2;
          } else {
            // Image is taller than canvas, so fit to height
            drawHeight = canvas.height;
            drawWidth = drawHeight * imgAspect;
            drawX = (canvas.width - drawWidth) / 2;
            drawY = 0;
          }

          // Draw the image to fill the canvas (matching CSS background-size: contain behavior)
          ctx.drawImage(bgImg, drawX, drawY, drawWidth, drawHeight);
          drawRestOfComposition();
        };
        bgImg.onerror = () => {
          // Fallback to solid color
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          drawRestOfComposition();
        };
        bgImg.src = currentBg;
      } else {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawRestOfComposition();
      }
    };

    const drawRestOfComposition = () => {
      // Draw text elements that are behind
      textElements.filter((el) => el.behind).forEach(drawTextElement);

      // Draw main subject
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = async () => {
        // Ensure all web fonts are loaded before drawing to canvas
        await (document as any).fonts.ready;
        const scale = subjectScale / 100;
        const width = img.width * scale;
        const height = img.height * scale;
        const x = (canvas.width * subjectPosition.x) / 100 - width / 2;
        const y = (canvas.height * subjectPosition.y) / 100 - height / 2;

        // Save context for rotation
        ctx.save();
        ctx.translate(x + width / 2, y + height / 2);
        ctx.rotate((subjectRotation * Math.PI) / 180);
        ctx.translate(-width / 2, -height / 2);

        // Apply border if enabled - use filter instead of stroke for image outline
        if (borderSettings.enabled) {
          // Create a glow/outline effect using shadow
          ctx.save();
          ctx.shadowColor = borderSettings.color;
          ctx.shadowBlur = borderSettings.blur + borderSettings.width;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          // Draw multiple shadows to create outline effect
          for (let i = 0; i < borderSettings.width; i++) {
            ctx.drawImage(img, 0, 0, width, height);
          }
          ctx.restore();
        }

        ctx.drawImage(img, 0, 0, width, height);
        ctx.restore();

        // Draw text elements that are in front
        textElements.filter((el) => !el.behind).forEach(drawTextElement);

        // Trigger download
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `thumbnail-${aspectRatio.replace(":", "x")}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      img.onerror = () => {
        console.error("Failed to load processed image for export");
      };
      img.src = processedImage;
    };

    const drawTextElement = (element: TextElement) => {
      ctx.save();
      const x = (canvas.width * element.x) / 100;
      const y = (canvas.height * element.y) / 100;
      ctx.translate(x, y);
      ctx.rotate((element.rotation * Math.PI) / 180);
      ctx.globalAlpha = element.opacity;
      ctx.fillStyle = element.color;

      // Dynamically scale font size so that it matches what you see in the
      // preview element regardless of the actual canvas resolution.
      const previewWidth = previewRef.current?.clientWidth || canvas.width;
      const fontScale = canvas.width / previewWidth;
      ctx.font = `${element.fontWeight} ${element.fontSize * fontScale}px ${
        element.fontFamily
      }`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (element.letterSpacing > 0) {
        // Manual letter spacing
        const chars = element.text.split("");
        let currentX = 0;
        const totalWidth = chars.reduce((width, char, i) => {
          const charWidth = ctx.measureText(char).width;
          return (
            width +
            charWidth +
            (i < chars.length - 1 ? element.letterSpacing * fontScale : 0)
          );
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
    };

    drawComposition();
  }, [
    processedImage,
    textElements,
    backgroundColor,
    customBackground,
    useCustomBackground,
    useOriginalBackground,
    originalImage,
    borderSettings,
    subjectPosition,
    subjectScale,
    subjectRotation,
    aspectRatio,
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Thumbnail Editor
          </h1>
          <p className="text-gray-600">
            Create stunning thumbnails with AI-powered background removal
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Preview</h2>
                  <div className="flex items-center gap-3">
                    <Select
                      value={aspectRatio}
                      onValueChange={(value: AspectRatioType) =>
                        setAspectRatio(value)
                      }
                    >
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
                      onClick={exportImage}
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
                {!originalImage ? (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-gray-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2 text-gray-700">
                      Upload your image
                    </p>
                    <p className="text-gray-500">
                      Click here or drag and drop your image
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div
                        ref={previewRef}
                        className={`relative ${getPreviewAspectRatio()} max-w-2xl w-full border border-gray-200 rounded-lg overflow-hidden`}
                        style={{
                          backgroundColor: !getCurrentBackground()
                            ? backgroundColor
                            : "transparent",
                          backgroundImage: getCurrentBackground()
                            ? `url(${getCurrentBackground()})`
                            : "none",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        {isProcessing ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/90">
                            <div className="flex items-center gap-3">
                              <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                              <span className="text-lg font-medium">
                                Processing image...
                              </span>
                            </div>
                          </div>
                        ) : processedImage ? (
                          <>
                            {/* Text elements behind */}
                            {textElements
                              .filter((el) => el.behind)
                              .map((element) => (
                                <div
                                  key={element.id}
                                  className={`absolute cursor-pointer select-none transition-all ${
                                    selectedTextId === element.id
                                      ? "ring-2 ring-orange-500"
                                      : ""
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
                                  onClick={() => setSelectedTextId(element.id)}
                                >
                                  {element.text}
                                </div>
                              ))}

                            {/* Main subject */}
                            <div
                              className="absolute"
                              style={{
                                left: `${subjectPosition.x}%`,
                                top: `${subjectPosition.y}%`,
                                transform: `translate(-50%, -50%) scale(${
                                  subjectScale / 100
                                }) rotate(${subjectRotation}deg)`,
                                filter: borderSettings.enabled
                                  ? `drop-shadow(0 0 ${borderSettings.blur}px ${borderSettings.color}) drop-shadow(0 0 ${borderSettings.width}px ${borderSettings.color})`
                                  : "none",
                              }}
                            >
                              <NextImage
                                src={processedImage || "/placeholder.svg"}
                                alt="Processed subject"
                                width={400}
                                height={400}
                                className="max-w-none"
                                style={{
                                  filter: borderSettings.enabled
                                    ? `drop-shadow(0 0 ${borderSettings.blur}px ${borderSettings.color}) drop-shadow(0 0 ${borderSettings.width}px ${borderSettings.color})`
                                    : "none",
                                }}
                              />
                            </div>

                            {/* Text elements in front */}
                            {textElements
                              .filter((el) => !el.behind)
                              .map((element) => (
                                <div
                                  key={element.id}
                                  className={`absolute cursor-pointer select-none transition-all ${
                                    selectedTextId === element.id
                                      ? "ring-2 ring-orange-500"
                                      : ""
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
                                  onClick={() => setSelectedTextId(element.id)}
                                >
                                  {element.text}
                                </div>
                              ))}
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-4">
            <Tabs defaultValue="subject" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-100">
                <TabsTrigger
                  value="subject"
                  className="data-[state=active]:bg-white"
                >
                  subject
                </TabsTrigger>
                <TabsTrigger
                  value="text"
                  className="data-[state=active]:bg-white"
                >
                  text
                </TabsTrigger>
                <TabsTrigger
                  value="background"
                  className="data-[state=active]:bg-white"
                >
                  background
                </TabsTrigger>
                <TabsTrigger
                  value="effects"
                  className="data-[state=active]:bg-white"
                >
                  effects
                </TabsTrigger>
              </TabsList>

              <TabsContent value="subject" className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="font-medium text-gray-900 mb-4">
                    Subject Controls
                  </h3>

                  <div className="space-y-4">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New Image
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Move className="w-4 h-4" />
                          Position X: {subjectPosition.x}%
                        </Label>
                        <Slider
                          value={[subjectPosition.x]}
                          onValueChange={([value]) =>
                            setSubjectPosition((prev) => ({
                              ...prev,
                              x: value,
                            }))
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
                          Position Y: {subjectPosition.y}%
                        </Label>
                        <Slider
                          value={[subjectPosition.y]}
                          onValueChange={([value]) =>
                            setSubjectPosition((prev) => ({
                              ...prev,
                              y: value,
                            }))
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
                        Scale: {subjectScale}%
                      </Label>
                      <Slider
                        value={[subjectScale]}
                        onValueChange={([value]) => setSubjectScale(value)}
                        min={10}
                        max={200}
                        step={5}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <RotateCw className="w-4 h-4" />
                        Rotation: {subjectRotation}°
                      </Label>
                      <Slider
                        value={[subjectRotation]}
                        onValueChange={([value]) => setSubjectRotation(value)}
                        min={-180}
                        max={180}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <Button
                      onClick={() => {
                        setSubjectPosition({ x: 50, y: 50 });
                        setSubjectScale(100);
                        setSubjectRotation(0);
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="text" className="space-y-4">
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
                    <div className="space-y-3 mb-4">
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
                                  duplicateTextElement(element.id);
                                }}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteTextElement(element.id);
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

                  {selectedText && (
                    <div className="space-y-4 border-t pt-4">
                      <div>
                        <Label className="text-sm font-medium">
                          Text Content
                        </Label>
                        <Textarea
                          value={selectedText.text}
                          onChange={(e) =>
                            updateTextElement(selectedText.id, {
                              text: e.target.value,
                            })
                          }
                          placeholder="Enter your text"
                          className="mt-2"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Font</Label>
                          <Select
                            value={selectedText.fontFamily}
                            onValueChange={(value) =>
                              updateTextElement(selectedText.id, {
                                fontFamily: value,
                              })
                            }
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
                              onChange={(e) =>
                                updateTextElement(selectedText.id, {
                                  color: e.target.value,
                                })
                              }
                              className="w-12 h-10 p-1"
                            />
                            <Select
                              value={selectedText.color}
                              onValueChange={(value) =>
                                updateTextElement(selectedText.id, {
                                  color: value,
                                })
                              }
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
                          onValueChange={([value]) =>
                            updateTextElement(selectedText.id, {
                              fontSize: value,
                            })
                          }
                          min={12}
                          max={120}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">
                            X: {selectedText.x}%
                          </Label>
                          <Slider
                            value={[selectedText.x]}
                            onValueChange={([value]) =>
                              updateTextElement(selectedText.id, {
                                x: value,
                              })
                            }
                            min={0}
                            max={100}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            Y: {selectedText.y}%
                          </Label>
                          <Slider
                            value={[selectedText.y]}
                            onValueChange={([value]) =>
                              updateTextElement(selectedText.id, {
                                y: value,
                              })
                            }
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
                          onValueChange={([value]) =>
                            updateTextElement(selectedText.id, {
                              rotation: value,
                            })
                          }
                          min={-180}
                          max={180}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={selectedText.behind}
                          onCheckedChange={(checked) =>
                            updateTextElement(selectedText.id, {
                              behind: checked,
                            })
                          }
                        />
                        <Label className="text-sm font-medium">
                          Place behind subject
                        </Label>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="background" className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="font-medium text-gray-900 mb-4">
                    Background Settings
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={useOriginalBackground}
                          onCheckedChange={(checked) => {
                            setUseOriginalBackground(checked);
                            if (checked) {
                              setUseCustomBackground(false);
                            }
                          }}
                        />
                        <Label className="text-sm font-medium">
                          Use original background
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={useCustomBackground}
                          onCheckedChange={(checked) => {
                            setUseCustomBackground(checked);
                            if (checked) {
                              setUseOriginalBackground(false);
                            }
                          }}
                        />
                        <Label className="text-sm font-medium">
                          Use custom background
                        </Label>
                      </div>
                    </div>

                    {useCustomBackground ? (
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
                        {customBackground && (
                          <div className="mt-3">
                            <NextImage
                              src={customBackground || "/placeholder.svg"}
                              alt="Custom background"
                              width={100}
                              height={100}
                              className="rounded-lg border object-cover"
                            />
                          </div>
                        )}
                      </div>
                    ) : !useOriginalBackground ? (
                      <div>
                        <Label className="text-sm font-medium">
                          Background Color
                        </Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-12 h-10 p-1"
                          />
                          <Select
                            value={backgroundColor}
                            onValueChange={setBackgroundColor}
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
              </TabsContent>

              <TabsContent value="effects" className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="font-medium text-gray-900 mb-4">
                    Border Effects
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={borderSettings.enabled}
                        onCheckedChange={(checked) =>
                          setBorderSettings((prev) => ({
                            ...prev,
                            enabled: checked,
                          }))
                        }
                      />
                      <Label className="text-sm font-medium">
                        Enable border
                      </Label>
                    </div>

                    {borderSettings.enabled && (
                      <>
                        <div>
                          <Label className="text-sm font-medium">
                            Outline Width: {borderSettings.width}px
                          </Label>
                          <Slider
                            value={[borderSettings.width]}
                            onValueChange={([value]) =>
                              setBorderSettings((prev) => ({
                                ...prev,
                                width: value,
                              }))
                            }
                            min={1}
                            max={10}
                            step={1}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium">
                            Border Color
                          </Label>
                          <Input
                            type="color"
                            value={borderSettings.color}
                            onChange={(e) =>
                              setBorderSettings((prev) => ({
                                ...prev,
                                color: e.target.value,
                              }))
                            }
                            className="w-12 h-10 p-1 mt-2"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium">
                            Glow Intensity: {borderSettings.blur}px
                          </Label>
                          <Slider
                            value={[borderSettings.blur]}
                            onValueChange={([value]) =>
                              setBorderSettings((prev) => ({
                                ...prev,
                                blur: value,
                              }))
                            }
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
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
