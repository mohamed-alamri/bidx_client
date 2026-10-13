"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  FrameStyle,
  MatOption,
  MatColor,
  ArtworkSize,
  RoomScene,
  LightingMoodId,
  GlassOptionId,
  WallTexture,
} from "./types";

interface WallPreviewProps {
  imageSrc: string | null;
  imageAlt: string;
  frame: FrameStyle;
  matOption: MatOption;
  matColor: MatColor;
  artworkSize: ArtworkSize;
  wallColor: string;
  wallTexture: WallTexture;
  roomScene: RoomScene;
  lightingMood: LightingMoodId;
  glassOption: GlassOptionId;
  aspectRatio: "portrait" | "landscape" | "square";
  verticalOffsetPercent: number;
  showDimensions: boolean;
  showFurniture: boolean;
  onVerticalOffsetChange: (val: number) => void;
  onToggleDimensions: () => void;
  onToggleFurniture: () => void;
  onExportMockup: () => void;
}

export default function WallPreview({
  imageSrc,
  imageAlt,
  frame,
  matOption,
  matColor,
  artworkSize,
  wallColor,
  wallTexture,
  roomScene,
  lightingMood,
  glassOption,
  aspectRatio,
  verticalOffsetPercent,
  showDimensions,
  showFurniture,
  onVerticalOffsetChange,
  onToggleDimensions,
  onToggleFurniture,
  onExportMockup,
}: WallPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Compute sizing dimensions based on scaleRatio and aspect ratio (viewport-safe)
  const baseWidthPx = 310 * artworkSize.scaleRatio;
  let frameWidth = baseWidthPx;
  let frameHeight = baseWidthPx * 1.35; // default portrait

  if (aspectRatio === "landscape") {
    frameWidth = baseWidthPx * 1.25;
    frameHeight = baseWidthPx * 0.78;
  } else if (aspectRatio === "square") {
    frameWidth = baseWidthPx;
    frameHeight = baseWidthPx;
  }

  // Texture class mapping
  const textureClass =
    wallTexture === "subtle-plaster"
      ? "texture-subtle-plaster"
      : wallTexture === "limewash"
      ? "texture-limewash"
      : wallTexture === "slatted-wood"
      ? "texture-slatted-wood"
      : "";

  // Lighting class mapping
  const lightingClass =
    lightingMood === "spotlight"
      ? "light-spotlight"
      : lightingMood === "daylight"
      ? "light-daylight"
      : lightingMood === "warm-evening"
      ? "light-warm-evening"
      : "light-neutral-studio";

  // Floor class mapping
  const floorClass =
    roomScene.floorType === "parquet"
      ? "floor-parquet"
      : roomScene.floorType === "marble"
      ? "floor-marble"
      : "floor-concrete";

  return (
    <div
      ref={containerRef}
      id="wall-capture-area"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`wall-container relative w-full h-full flex flex-col justify-between overflow-hidden select-none ${textureClass} ${lightingClass}`}
      style={{
        backgroundColor: wallColor,
        transition: "background-color 0.4s ease",
      }}
    >
      {/* Top Floating Info & Controls Toolbar */}
      <div className="absolute top-3 inset-x-3 sm:top-4 sm:inset-x-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Left Badge: Active Specs Summary */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950/80 border border-white/10 text-xs font-semibold text-zinc-200 backdrop-blur-xl shadow-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">معاينة حية</span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="font-mono text-amber-300 font-bold">{artworkSize.dimensionsCm}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-300 font-medium truncate max-w-[110px] sm:max-w-none">{frame.label}</span>
          </div>
        </div>

        {/* Right Floating Control Pills */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={onToggleDimensions}
            className={`px-2.5 py-1.5 text-xs rounded-xl border backdrop-blur-xl transition-all flex items-center gap-1.5 ${
              showDimensions
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm"
                : "bg-zinc-950/70 text-zinc-400 border-white/10 hover:text-white hover:bg-zinc-900/80"
            }`}
            title="إظهار أبعاد اللوحة"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.3 15.3l-6.6-6.6a2 2 0 0 0-2.8 0L2.7 17.9a2 2 0 0 0 0 2.8l.6.6a2 2 0 0 0 2.8 0L14.7 13" />
            </svg>
            <span className="hidden sm:inline">الأبعاد</span>
          </button>

          {roomScene.hasFurniture && (
            <button
              onClick={onToggleFurniture}
              className={`px-2.5 py-1.5 text-xs rounded-xl border backdrop-blur-xl transition-all flex items-center gap-1.5 ${
                showFurniture
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm"
                  : "bg-zinc-950/70 text-zinc-400 border-white/10 hover:text-white hover:bg-zinc-900/80"
              }`}
              title="إظهار الديكور للمقارنة"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 10h18M4 14h16M7 14v6M17 14v6" />
              </svg>
              <span className="hidden sm:inline">الديكور</span>
            </button>
          )}

          <button
            onClick={onExportMockup}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-1.5 active:scale-95"
            title="حفظ صورة الموك آب بدقة عالية"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>حفظ الموك آب</span>
          </button>
        </div>
      </div>

      {/* Main Wall Hanging Space (takes central height available) */}
      <div
        className="flex-1 w-full flex items-center justify-center transition-all duration-300 px-4"
        style={{
          transform: `translateY(${(verticalOffsetPercent - 50) * 1.4}px)`,
        }}
      >
        {imageSrc ? (
          <div className="relative flex flex-col items-center select-none">
            {/* Luxury Brass Wall Nail & Wire */}
            {frame.hasNail && (
              <>
                <div className="luxury-brass-nail" aria-hidden="true" />
                <div className="luxury-hanging-wire" aria-hidden="true" />
              </>
            )}

            {/* Framed Picture Assembly */}
            <div
              className={`relative z-10 transition-all duration-300 ${frame.frameClassName}`}
              style={{
                ...frame.customStyle,
              }}
            >
              {/* Passe-Partout Mat Board */}
              <div
                style={{
                  backgroundColor: matOption.widthPx > 0 ? matColor.hex : "transparent",
                  padding: `${matOption.widthPx}px`,
                  boxShadow:
                    matOption.widthPx > 0
                      ? "inset 0 1px 3px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(0,0,0,0.08)"
                      : "none",
                  transition: "padding 0.25s ease, background-color 0.3s ease",
                }}
              >
                {/* Artwork Image Container */}
                <div
                  className="relative overflow-hidden bg-zinc-900"
                  style={{
                    width: `${frameWidth}px`,
                    height: `${frameHeight}px`,
                    boxShadow: "inset 0 0 6px rgba(0,0,0,0.35)",
                    transition: "width 0.3s ease, height 0.3s ease",
                  }}
                >
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    priority
                    className="object-cover transition-transform duration-500 ease-out"
                    sizes="(max-width: 768px) 320px, 800px"
                    unoptimized={imageSrc.startsWith("data:")}
                  />

                  {/* Realistic Glass Reflection Layers */}
                  {glassOption === "window" && (
                    <div className="glass-window-reflection" aria-hidden="true" />
                  )}
                  {glassOption === "museum" && (
                    <div className="glass-museum-sheen" aria-hidden="true" />
                  )}
                  {glassOption === "standard" && (
                    <div className="glass-standard-glare" aria-hidden="true" />
                  )}
                </div>
              </div>

              {/* Dimension Guides Overlay */}
              {showDimensions && (
                <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-2">
                  <div className="self-center -top-7 relative bg-zinc-950/90 text-amber-300 text-[11px] font-mono font-semibold px-2 py-0.5 rounded shadow-lg border border-amber-500/30">
                    ← {artworkSize.widthCm} سم →
                  </div>
                  <div className="absolute -left-9 top-1/2 -translate-y-1/2 -rotate-90 bg-zinc-950/90 text-amber-300 text-[11px] font-mono font-semibold px-2 py-0.5 rounded shadow-lg border border-amber-500/30">
                    ← {artworkSize.heightCm} سم →
                  </div>
                </div>
              )}
            </div>

            {/* Realistic Ambient Wall Shadow Beneath Frame */}
            <div className="artwork-cast-shadow" aria-hidden="true" />
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center gap-3 py-10 px-6 text-center max-w-xs rounded-2xl bg-zinc-950/50 backdrop-blur-xl border border-white/10 p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xl shadow-inner">
              🖼️
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">
                اختر عملاً أو ارفع صورتك
              </h3>
              <p className="text-xs text-zinc-400">
                استخدم لوحة التخصيص لتجربة إطارات فاخرة على الجدار
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Realistic Floor & Skirting Section at Bottom */}
      <div className="relative w-full h-[15%] min-h-[75px] pointer-events-none flex-shrink-0">
        {/* Architectural Wall Skirting Board */}
        <div className="skirting-board" />

        {/* Floor Surface */}
        <div className={`w-full h-full ${floorClass}`} />

        {/* Credenza Furniture Silhouette for Realistic Scale */}
        {roomScene.hasFurniture && showFurniture && roomScene.furnitureType === "credenza" && (
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 sm:w-96 h-24 pointer-events-none z-10 flex flex-col justify-end"
            aria-hidden="true"
          >
            {/* Ceramic Art Vase */}
            <div className="relative -mb-1 mr-14 self-end flex items-end">
              <div className="w-8 h-14 bg-gradient-to-t from-stone-800 to-stone-700 rounded-t-full rounded-b-md shadow-lg border border-stone-600/30 relative">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-10 h-12 opacity-80 pointer-events-none">
                  <svg viewBox="0 0 50 60" fill="none" className="w-full h-full stroke-emerald-900/90 fill-emerald-950/70">
                    <path d="M25 55 Q20 30 15 10 M25 45 Q35 38 40 30 M25 35 Q10 28 8 20" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="15" cy="10" r="3" />
                    <circle cx="40" cy="30" r="3" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Console Surface */}
            <div className="w-full h-3 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 rounded-t-sm shadow-md border-t border-stone-600/40" />
            <div className="w-full h-14 bg-gradient-to-b from-stone-900 to-stone-950 border-x border-b border-stone-800/80 shadow-2xl flex items-center justify-around px-4">
              <div className="w-px h-8 bg-stone-800" />
              <div className="w-px h-8 bg-stone-800" />
            </div>
          </div>
        )}
      </div>

      {/* Height Slider (Bottom Left Float) */}
      <div
        className={`absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-zinc-950/80 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/10 text-xs text-zinc-300 shadow-xl transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none sm:opacity-85"
        }`}
      >
        <span className="text-[11px] text-zinc-400 font-medium">الارتفاع:</span>
        <input
          type="range"
          min="20"
          max="80"
          value={verticalOffsetPercent}
          onChange={(e) => onVerticalOffsetChange(Number(e.target.value))}
          className="w-20 accent-amber-500 cursor-pointer h-1.5 rounded-lg bg-zinc-800"
          title="تعديل ارتفاع اللوحة"
        />
      </div>
    </div>
  );
}
