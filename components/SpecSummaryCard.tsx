"use client";

import { useState } from "react";
import {
  FrameStyle,
  MatOption,
  MatColor,
  ArtworkSize,
  GlassOptionId,
} from "./types";
import { GLASS_OPTIONS } from "./constants";

interface SpecSummaryCardProps {
  imageName: string;
  frame: FrameStyle;
  matOption: MatOption;
  matColor: MatColor;
  artworkSize: ArtworkSize;
  glassId: GlassOptionId;
  wallColorName: string;
  onCheckout?: (price: number) => void;
}

export default function SpecSummaryCard({
  imageName,
  frame,
  matOption,
  matColor,
  artworkSize,
  glassId,
  wallColorName,
  onCheckout,
}: SpecSummaryCardProps) {
  const [copied, setCopied] = useState(false);

  const selectedGlass = GLASS_OPTIONS.find((g) => g.id === glassId) || GLASS_OPTIONS[0];

  // Calculate realistic craft estimate
  const perimeterMeters = ((artworkSize.widthCm + artworkSize.heightCm) * 2) / 100;
  const frameCost = Math.round(perimeterMeters * frame.pricePerMeter);
  const totalEstimatedPrice = artworkSize.basePrice + frameCost + matOption.priceExtra + selectedGlass.priceExtra;

  const handleCopy = () => {
    const text = `
🌟 مواصفات التأطير الفاخر - BidX Studio:
------------------------------------------
• العمل الفني: ${imageName}
• المقاس المعتمد: ${artworkSize.dimensionsCm} (${artworkSize.label})
• طراز الإطار: ${frame.label} (عرض ${frame.widthMm} مم / عمق ${frame.depthMm} مم)
• الحاشية الداخلية (المات): ${matOption.label} ${matOption.widthPx > 0 ? `| لون ${matColor.label}` : ""}
• نوع الزجاج: ${selectedGlass.label}
• لون الجدار المعاين: ${wallColorName}
• التكلفة التقديرية للتصنيع: ${totalEstimatedPrice} ر.س تقريباً
------------------------------------------
تم التجهيز عبر استوديو BidX Frame Studio
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <h4 className="font-bold text-white text-sm">بطاقة مواصفات الإطار</h4>
        </div>
        <span className="text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
          جاهز للتنفيذ
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-zinc-300">
        <div className="p-2 rounded-lg bg-zinc-950/50 border border-white/5 flex flex-col">
          <span className="text-[10px] text-zinc-500">المقاس الحقيقي</span>
          <span className="font-semibold text-white mt-0.5">{artworkSize.dimensionsCm}</span>
        </div>

        <div className="p-2 rounded-lg bg-zinc-950/50 border border-white/5 flex flex-col">
          <span className="text-[10px] text-zinc-500">خامة الإطار</span>
          <span className="font-semibold text-amber-300 mt-0.5 truncate">{frame.label}</span>
        </div>

        <div className="p-2 rounded-lg bg-zinc-950/50 border border-white/5 flex flex-col">
          <span className="text-[10px] text-zinc-500">الحاشية (المات)</span>
          <span className="font-semibold text-zinc-200 mt-0.5 truncate">
            {matOption.widthPx > 0 ? `${matOption.marginMm} مم (${matColor.label})` : "بدون"}
          </span>
        </div>

        <div className="p-2 rounded-lg bg-zinc-950/50 border border-white/5 flex flex-col">
          <span className="text-[10px] text-zinc-500">حماية الزجاج</span>
          <span className="font-semibold text-zinc-200 mt-0.5 truncate">{selectedGlass.label.split("(")[0]}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-400">التكلفة التقديرية الحرفية</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-bold text-amber-400 font-mono">
              {totalEstimatedPrice}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">ر.س / درهم</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className={`px-2.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1 ${
              copied
                ? "bg-emerald-500 text-zinc-950 font-bold"
                : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"
            }`}
            title="نسخ المواصفات"
          >
            {copied ? (
              <span>تم النسخ!</span>
            ) : (
              <span>نسخ</span>
            )}
          </button>

          {onCheckout && (
            <button
              onClick={() => onCheckout(totalEstimatedPrice)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1 active:scale-95"
            >
              <span>طلب وتجهيز</span>
              <span>←</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
