"use client";

import { useRef, useState, useCallback } from "react";

interface ImageUploadProps {
  uploadedSrc: string | null;
  onUpload: (dataUrl: string, detectedAspect?: "portrait" | "landscape" | "square") => void;
  onClear: () => void;
}

export default function ImageUpload({
  uploadedSrc,
  onUpload,
  onClear,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(
    (file: File) => {
      setError(null);
      if (!file.type.startsWith("image/")) {
        setError("الملف المختار ليس صورة. يرجى اختيار ملف JPG أو PNG أو WEBP.");
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        setError("حجم الصورة كبير جداً. الحد الأقصى المسموح به 25 ميغابايت.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          // Detect natural aspect ratio
          const img = new Image();
          img.onload = () => {
            const ratio = img.width / img.height;
            let aspect: "portrait" | "landscape" | "square" = "portrait";
            if (ratio > 1.15) {
              aspect = "landscape";
            } else if (ratio < 0.88) {
              aspect = "portrait";
            } else {
              aspect = "square";
            }
            onUpload(result, aspect);
          };
          img.src = result;
        }
      };
      reader.readAsDataURL(file);
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold">
            ↑
          </span>
          <h3 className="text-sm font-bold text-white tracking-wide">
            رفع صورتك الخاصة
          </h3>
        </div>
        {uploadedSrc && (
          <button
            onClick={onClear}
            className="text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors flex items-center gap-1"
          >
            <span>✕</span>
            <span>إزالة الصورة</span>
          </button>
        )}
      </div>

      <label
        htmlFor="image-file-upload"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex flex-col items-center justify-center gap-2 w-full p-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-amber-400 bg-amber-500/10 scale-[1.01]"
            : uploadedSrc
            ? "border-emerald-500/50 bg-emerald-950/20 hover:border-emerald-400"
            : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900/80"
        }`}
      >
        <div className="flex flex-col items-center gap-2 text-center select-none pointer-events-none">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
              uploadedSrc
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-zinc-800 text-zinc-300 border border-zinc-700"
            }`}
          >
            {uploadedSrc ? "✓" : isDragging ? "📂" : "📷"}
          </div>

          <div>
            <p className="text-xs font-semibold text-zinc-200">
              {uploadedSrc
                ? "تم تحميل صورتك بنجاح! اضغط لاستبدالها"
                : isDragging
                ? "أفلت الصورة هنا الآن"
                : "اسحب وأفلت صورتك هنا، أو اضغط للاختيار"}
            </p>
            <p className="text-[10px] text-zinc-500 mt-0.5">
              يدعم ملفات JPG، PNG، WEBP عالية الدقة حتى 25 ميغابايت
            </p>
          </div>
        </div>

        <input
          id="image-file-upload"
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="sr-only"
        />
      </label>

      {error && (
        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
