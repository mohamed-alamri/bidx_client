"use client";

import {
  WallColor,
  WallTexture,
  RoomScene,
  LightingMoodId,
} from "./types";
import {
  LUXURY_WALL_COLORS,
  ROOM_SCENES,
  LIGHTING_MOODS,
} from "./constants";

interface WallColorPickerProps {
  selectedColorId: string;
  customColor: string;
  selectedTexture: WallTexture;
  selectedRoomSceneId: string;
  selectedLightingMood: LightingMoodId;
  onSelectColor: (color: WallColor) => void;
  onCustomColor: (hex: string) => void;
  onSelectTexture: (texture: WallTexture) => void;
  onSelectRoomScene: (scene: RoomScene) => void;
  onSelectLightingMood: (mood: LightingMoodId) => void;
}

export default function WallColorPicker({
  selectedColorId,
  customColor,
  selectedTexture,
  selectedRoomSceneId,
  selectedLightingMood,
  onSelectColor,
  onCustomColor,
  onSelectTexture,
  onSelectRoomScene,
  onSelectLightingMood,
}: WallColorPickerProps) {
  const activeColorHex =
    customColor ||
    (LUXURY_WALL_COLORS.find((c) => c.id === selectedColorId)?.hex ?? LUXURY_WALL_COLORS[0].hex);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* 1. Room Scenes */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xs font-bold text-white flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>مشهد الغرفة والبيئة</span>
        </span>

        <div className="grid grid-cols-3 gap-2">
          {ROOM_SCENES.map((scene) => {
            const isSelected = selectedRoomSceneId === scene.id;
            return (
              <button
                key={scene.id}
                onClick={() => onSelectRoomScene(scene)}
                className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? "bg-zinc-850 border-amber-500/70 text-amber-300 shadow-sm ring-1 ring-amber-500/30"
                    : "bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                }`}
              >
                <span className="text-[11px] font-bold">{scene.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-t border-zinc-800/60" />

      {/* 2. Wall Color Palettes */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>لون الجدار المعماري</span>
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-zinc-400">
              {activeColorHex.toUpperCase()}
            </span>
            <div
              className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
              style={{ backgroundColor: activeColorHex }}
            />
          </div>
        </div>

        {/* Color Collections */}
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 items-center">
          {LUXURY_WALL_COLORS.map((color) => {
            const isSelected = selectedColorId === color.id && !customColor;
            return (
              <button
                key={color.id}
                onClick={() => onSelectColor(color)}
                title={`${color.label} (${color.collection})`}
                aria-label={color.label}
                className={`group relative w-full aspect-square rounded-xl border transition-all flex items-center justify-center ${
                  isSelected
                    ? "border-amber-400 scale-110 shadow-lg ring-2 ring-amber-400/40 z-10"
                    : "border-zinc-800 hover:border-zinc-600 hover:scale-105"
                }`}
                style={{ backgroundColor: color.hex }}
              >
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 shadow-sm" />
                )}
              </button>
            );
          })}

          {/* Custom Color Input */}
          <label
            className="group relative w-full aspect-square rounded-xl border border-dashed border-zinc-700 hover:border-amber-400 cursor-pointer transition-all flex flex-col items-center justify-center bg-zinc-900/60"
            title="اختر لوناً مخصصاً (Hex)"
          >
            <span className="text-xs text-zinc-400 group-hover:text-amber-400 font-bold leading-none">
              +
            </span>
            <span className="text-[8px] text-zinc-500">مخصص</span>
            <input
              type="color"
              value={activeColorHex}
              onChange={(e) => onCustomColor(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              aria-label="لون مخصص"
            />
          </label>
        </div>
      </div>

      <hr className="border-t border-zinc-800/60" />

      {/* 3. Wall Texture Finish */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xs font-bold text-white flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>ملمس وخامة السطح</span>
        </span>

        <div className="grid grid-cols-2 gap-1.5 text-xs">
          {[
            { id: "smooth-matte", label: "ناعم مطفي" },
            { id: "subtle-plaster", label: "بلاستر معماري" },
            { id: "limewash", label: "ليم-واش جيري" },
            { id: "slatted-wood", label: "بانوهات خشبية" },
          ].map((tex) => {
            const isSelected = selectedTexture === tex.id;
            return (
              <button
                key={tex.id}
                onClick={() => onSelectTexture(tex.id as WallTexture)}
                className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                  isSelected
                    ? "bg-zinc-850 border-amber-500/70 text-amber-300 font-semibold shadow-sm"
                    : "bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                }`}
              >
                <span className="text-[11px]">{tex.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-t border-zinc-800/60" />

      {/* 4. Lighting Ambience */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xs font-bold text-white flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>الأجواء الضوئية</span>
        </span>

        <div className="grid grid-cols-2 gap-1.5">
          {LIGHTING_MOODS.map((mood) => {
            const isSelected = selectedLightingMood === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => onSelectLightingMood(mood.id)}
                className={`p-2 rounded-xl border text-right transition-all flex flex-col ${
                  isSelected
                    ? "bg-zinc-850 border-amber-500/70 text-amber-300 font-semibold shadow-sm"
                    : "bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                }`}
              >
                <span className="text-[11px] font-bold">{mood.label}</span>
                <span className="text-[9px] text-zinc-400 line-clamp-1">{mood.description}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
