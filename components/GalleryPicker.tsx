"use client";

import { useState } from "react";
import Image from "next/image";
import { GalleryImage, ArtworkSize } from "./types";
import { CURATED_ARTWORKS, ARTWORK_SIZES } from "./constants";

interface GalleryPickerProps {
  selectedId: string | null;
  selectedSizeId: string;
  selectedAspect: "portrait" | "landscape" | "square";
  artworks?: GalleryImage[];
  onSelectArtwork: (image: GalleryImage) => void;
  onSelectSize: (size: ArtworkSize) => void;
  onSelectAspect: (aspect: "portrait" | "landscape" | "square") => void;
}

export default function GalleryPicker({
  selectedId,
  selectedSizeId,
  selectedAspect,
  artworks,
  onSelectArtwork,
  onSelectSize,
  onSelectAspect,
}: GalleryPickerProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const availableArtworks = artworks && artworks.length > 0 ? artworks : CURATED_ARTWORKS;
  const categories = ["all", "طبيعة", "فن تجريدي", "عمارة ومدن", "تراث وخط"];

  const filteredArtworks =
    activeCategory === "all"
      ? availableArtworks
      : availableArtworks.filter((art) => art.category === activeCategory);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* 1. Size & Scale Selector */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xs font-bold text-white flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>أبعاد ومقاس اللوحة</span>
        </span>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {ARTWORK_SIZES.map((size) => {
            const isSelected = selectedSizeId === size.id;
            return (
              <button
                key={size.id}
                onClick={() => onSelectSize(size)}
                className={`p-2.5 rounded-xl border text-right transition-all flex flex-col gap-0.5 ${
                  isSelected
                    ? "bg-zinc-850 border-amber-500/70 text-amber-300 shadow-sm ring-1 ring-amber-500/30"
                    : "bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px]">{size.dimensionsCm}</span>
                  <span className="text-[9px] text-zinc-500 font-mono">
                    {size.scaleRatio}x
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 truncate">{size.label}</span>
              </button>
            );
          })}
        </div>

        {/* Aspect Ratio Orientation */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-zinc-400">الاتجاه:</span>
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            {[
              { id: "portrait", label: "طولي", icon: "▯" },
              { id: "landscape", label: "عرضي", icon: "▭" },
              { id: "square", label: "مربع", icon: "◻" },
            ].map((asp) => (
              <button
                key={asp.id}
                onClick={() =>
                  onSelectAspect(asp.id as "portrait" | "landscape" | "square")
                }
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1 ${
                  selectedAspect === asp.id
                    ? "bg-amber-500 text-zinc-950 font-bold shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <span>{asp.icon}</span>
                <span>{asp.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-t border-zinc-800/60" />

      {/* 2. Curated Artworks Collection */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xs font-bold text-white flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>المجموعة الفنية المعروضة</span>
        </span>

        {/* Category Pills */}
        <div className="flex gap-1 overflow-x-auto pb-1 text-[11px]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-all font-medium ${
                activeCategory === cat
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-zinc-900/60 text-zinc-400 border border-zinc-800 hover:text-white"
              }`}
            >
              {cat === "all" ? "الكل" : cat}
            </button>
          ))}
        </div>

        {/* Artworks Grid */}
        <div className="grid grid-cols-2 gap-2">
          {filteredArtworks.map((art) => {
            const isSelected = selectedId === art.id;
            return (
              <button
                key={art.id}
                onClick={() => onSelectArtwork(art)}
                className={`group relative rounded-xl overflow-hidden border text-right transition-all flex flex-col ${
                  isSelected
                    ? "border-amber-500 ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/10"
                    : "border-zinc-800/80 hover:border-zinc-600 bg-zinc-900/60"
                }`}
              >
                <div className="relative w-full h-24 overflow-hidden bg-zinc-950">
                  <Image
                    src={art.src}
                    alt={art.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="160px"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-1 right-1">
                    <span className="text-[8px] font-semibold text-zinc-300 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded">
                      {art.category}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute bottom-1.5 left-1.5 bg-amber-500 text-zinc-950 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                      <span>✓</span>
                    </div>
                  )}
                </div>
                <div className="p-2 bg-zinc-900/90 flex flex-col">
                  <span className="text-[11px] font-semibold text-white group-hover:text-amber-300 transition-colors truncate">
                    {art.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
