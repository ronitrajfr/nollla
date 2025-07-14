import React, { useState, useRef, useCallback, useEffect } from "react";
import NextImage from "next/image";
import { useThumbnailStore } from "@/lib/thumbnail-store";
import { useClickOutside } from "@/hooks/use-click-outside";

interface InteractiveSubjectProps {
  processedImage: string;
  subjectSettings: {
    position: { x: number; y: number };
    scale: number;
    rotation: number;
  };
  borderSettings: {
    enabled: boolean;
    width: number;
    color: string;
    blur: number;
  };
  isSelected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function InteractiveSubject({
  processedImage,
  subjectSettings,
  borderSettings,
  isSelected,
  onSelect,
  onDeselect,
  containerRef,
}: InteractiveSubjectProps) {
  const { updateSubjectPosition, updateSubjectScale, updateSubjectRotation } = useThumbnailStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [initialScale, setInitialScale] = useState(100);
  const [initialRotation, setInitialRotation] = useState(0);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const subjectRef = useRef<HTMLDivElement>(null);

  useClickOutside(subjectRef, () => {
    if (isSelected) {
      onDeselect();
    }
  });

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
    img.src = processedImage;
  }, [processedImage]);

  const getRelativePosition = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    };
  }, [containerRef]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPosition({ x: subjectSettings.position.x, y: subjectSettings.position.y });
  }, [onSelect, subjectSettings.position]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect();
  }, [onSelect]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialScale(subjectSettings.scale);
    onSelect();
  }, [subjectSettings.scale, onSelect]);

  const handleRotateStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRotating(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialRotation(subjectSettings.rotation);
    onSelect();
  }, [subjectSettings.rotation, onSelect]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const deltaXPercent = (deltaX / rect.width) * 100;
        const deltaYPercent = (deltaY / rect.height) * 100;
        
        const newX = Math.max(0, Math.min(100, initialPosition.x + deltaXPercent));
        const newY = Math.max(0, Math.min(100, initialPosition.y + deltaYPercent));
        
        updateSubjectPosition({ x: newX, y: newY });
      }
    } else if (isResizing) {
      const deltaX = e.clientX - dragStart.x;
      const scaleFactor = 1 + (deltaX / 200);
      const newScale = Math.max(10, Math.min(300, initialScale * scaleFactor));
      updateSubjectScale(newScale);
    } else if (isRotating) {
      const deltaX = e.clientX - dragStart.x;
      const rotationDelta = deltaX * 0.5;
      const newRotation = (initialRotation + rotationDelta) % 360;
      updateSubjectRotation(newRotation);
    }
  }, [
    isDragging,
    isResizing,
    isRotating,
    dragStart,
    initialPosition,
    initialScale,
    initialRotation,
    containerRef,
    updateSubjectPosition,
    updateSubjectScale,
    updateSubjectRotation,
  ]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
  }, []);

  React.useEffect(() => {
    if (isDragging || isResizing || isRotating) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, isRotating, handleMouseMove, handleMouseUp]);

  // Calculate consistent dimensions - use fixed 400px base like export
  const baseSize = 400;
  const aspectRatio = imageDimensions.width && imageDimensions.height 
    ? imageDimensions.width / imageDimensions.height 
    : 1;
  
  let displayWidth = baseSize;
  let displayHeight = baseSize;
  
  if (aspectRatio > 1) {
    displayHeight = baseSize / aspectRatio;
  } else {
    displayWidth = baseSize * aspectRatio;
  }

  const finalScale = subjectSettings.scale / 100;

  return (
    <div
      ref={subjectRef}
      className={`absolute cursor-move select-none transition-none ${
        isSelected ? "ring-2 ring-orange-500" : ""
      }`}
      style={{
        left: `${subjectSettings.position.x}%`,
        top: `${subjectSettings.position.y}%`,
        width: `${displayWidth}px`,
        height: `${displayHeight}px`,
        transform: `translate(-50%, -50%) scale(${finalScale}) rotate(${subjectSettings.rotation}deg)`,
        transformOrigin: 'center',
        filter: borderSettings.enabled
          ? `drop-shadow(0 0 ${borderSettings.blur}px ${borderSettings.color}) drop-shadow(0 0 ${borderSettings.width}px ${borderSettings.color})`
          : "none",
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <NextImage
        src={processedImage}
        alt="Processed subject"
        width={displayWidth}
        height={displayHeight}
        className="w-full h-full object-contain pointer-events-none"
        style={{
          width: `${displayWidth}px`,
          height: `${displayHeight}px`,
        }}
      />
      
      {/* Interactive Controls */}
      {isSelected && (
        <>
          {/* Resize handles */}
          <div
            className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 rounded-full cursor-nw-resize border-2 border-white shadow-md"
            onMouseDown={handleResizeStart}
          />
          <div
            className="absolute -bottom-2 -right-2 w-4 h-4 bg-orange-500 rounded-full cursor-nw-resize border-2 border-white shadow-md"
            onMouseDown={handleResizeStart}
          />
          <div
            className="absolute -top-2 -left-2 w-4 h-4 bg-orange-500 rounded-full cursor-ne-resize border-2 border-white shadow-md"
            onMouseDown={handleResizeStart}
          />
          <div
            className="absolute -bottom-2 -left-2 w-4 h-4 bg-orange-500 rounded-full cursor-ne-resize border-2 border-white shadow-md"
            onMouseDown={handleResizeStart}
          />
          
          {/* Rotation handle */}
          <div
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full cursor-grab border-2 border-white shadow-md"
            onMouseDown={handleRotateStart}
          />
          <div
            className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-0.5 h-3 bg-blue-500"
          />
        </>
      )}
    </div>
  );
} 