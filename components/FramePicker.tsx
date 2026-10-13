"use client";

import { useState } from "react";
import {
  FrameStyle,
  MatOption,
  MatColor,
  GlassOptionId,
  FrameMaterial,
} from "./types";
import {
  REALISTIC_FRAMES,
  MAT_OPTIONS,
  MAT_COLORS,
  GLASS_OPTIONS,
} from "./constants";

interface FramePickerProps {
  selectedFrameId: string;
  selectedMatOptionId: string;
  selectedMatColorId: string;
  selectedGlassId: GlassOptionId;
  onSelectFrame: (frame: FrameStyle) => void;
  onSelectMatOption: (mat: MatOption) => void;
  onSelectMatColor: (color: MatColor) => void;
  onSelectGlass: (glassId: GlassOptionId) => void;
}

export default function FramePicker({
  selectedFrameId,
  selectedMatOptionId,
  selectedMatColorId,
  selectedGlassId,
  onSelectFrame,
  onSelectMatOption,
  onSelectMatColor,
  onSelectGlass,
}: FramePickerProps) {
  const [materialFilter, setMaterialFilter] = useState<"all" | FrameMaterial>("all");

  const filteredFrames =
    materialFilter === "all"
      ? REALISTIC_FRAMES
      : REALISTIC_FRAMES.filter((f) => f.material === materialFilter);

  const currentFrame = REALISTIC_FRAMES.find((f) => f.id === selectedFrameId) || REALISTIC_FRAMES[0];

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* 1. Frame Selection Section */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>طراز ومادة الإطار</span>
          </span>
          <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
            {currentFrame.label.split(" ")[0]} {currentFrame.label.split(" ")[1] || ""}
          </span>
        </div>

        {/* Material Filter Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 text-[11px]">
          {[
            { id: "all", label: "الكل" },
            { id: "wood", label: "خشب طبيعي" },
            { id: "metal", label: "معدن" },
            { id: "ornate", label: "مذهب" },
            { id: "canvas", label: "عائم" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMaterialFilter(tab.id as "all" | FrameMaterial)}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                materialFilter === tab.id
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-zinc-900/60 text-zinc-400 border border-zinc-800 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Frames Grid */}
        <div className="grid grid-cols-2 gap-2">
          {filteredFrames.map((frame) => {
            const isSelected = selectedFrameId === frame.id;
            return (
              <button
                key={frame.id}
                onClick={() => onSelectFrame(frame)}
                className={`relative flex flex-col p-2.5 rounded-xl border text-right transition-all group overflow-hidden ${
                  isSelected
                    ? "bg-zinc-850 border-amber-500 shadow-md ring-1 ring-amber-500/30"
                    : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/40"
                }`}
              >
                {/* Visual Swatch Preview */}
                <div className="w-full h-11 rounded-lg mb-2 flex items-center justify-center p-1 bg-zinc-950/80 border border-white/5 relative overflow-hidden">
                  <div
                    className={`w-12 h-7 rounded-sm ${frame.frameClassName} shadow-md`}
                    style={{ borderWidth: "5px" }}
                  />
                  <div className="absolute top-1 left-1">
                    <span className="text-[8px] font-semibold text-zinc-400 bg-black/70 px-1 py-0.5 rounded">
                      {frame.badge}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                    {frame.label}
                  </span>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-1 pt-1 border-t border-white/5">
                    <span>عرض {frame.widthMm} مم</span>
                    <span className="text-amber-400/90 font-mono">
                      عمق {frame.depthMm} مم
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-t border-zinc-800/60" />

      {/* 2. Mat Board (Passe-Partout) Customization */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xs font-bold text-white flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>الحاشية الداخلية (المات / Passe-Partout)</span>
        </span>

        {/* Mat Width Selection */}
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          {MAT_OPTIONS.map((mat) => {
            const isSelected = selectedMatOptionId === mat.id;
            return (
              <button
                key={mat.id}
                onClick={() => onSelectMatOption(mat)}
                className={`py-2 px-2.5 rounded-lg border text-right transition-all flex flex-col ${
                  isSelected
                    ? "bg-zinc-850 border-amber-500/70 text-amber-300 font-semibold shadow-sm"
                    : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                <span className="text-[11px]">{mat.label}</span>
                <span className="text-[9px] text-zinc-500 font-mono">
                  {mat.marginMm > 0 ? `+${mat.priceExtra} ر.س` : "مباشر"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mat Color Swatches */}
        {selectedMatOptionId !== "mat-none" && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <span className="text-[11px] text-zinc-300">لون الحاشية:</span>
            <div className="flex items-center gap-2">
              {MAT_COLORS.map((color) => {
                const isSelected = selectedMatColorId === color.id;
                return (
                  <button
                    key={color.id}
                    onClick={() => onSelectMatColor(color)}
                    title={color.label}
                    className="focus:outline-none"
                  >
                    <div
                      className={`w-6 h-6 rounded-full border transition-all ${
                        isSelected
                          ? "border-amber-400 scale-110 shadow-md ring-2 ring-amber-400/30"
                          : "border-zinc-700 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <hr className="border-t border-zinc-800/60" />

      {/* 3. Glass & Glare Physics */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xs font-bold text-white flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>نوع الزجاج والانعكاس البصري</span>
        </span>

        <div className="grid grid-cols-1 gap-1.5">
          {GLASS_OPTIONS.map((glass) => {
            const isSelected = selectedGlassId === glass.id;
            return (
              <button
                key={glass.id}
                onClick={() => onSelectGlass(glass.id)}
                className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between gap-2 ${
                  isSelected
                    ? "bg-zinc-850 border-amber-500/60 text-amber-300"
                    : "bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                }`}
              >
                <div className="flex flex-col">
                  <span className={`text-[11px] font-bold ${isSelected ? "text-amber-300" : "text-zinc-200"}`}>
                    {glass.label.split("(")[0]}
                  </span>
                  <span className="text-[10px] text-zinc-400 line-clamp-1">{glass.description}</span>
                </div>
                <div
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                    isSelected ? "border-amber-400 bg-amber-500" : "border-zinc-700"
                  }`}
                >
                  {isSelected && <div className="w-1 h-1 rounded-full bg-zinc-950" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
