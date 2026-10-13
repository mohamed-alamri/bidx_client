"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AuthModal from "@/components/AuthModal";
import CheckoutModal from "@/components/CheckoutModal";
import AdminDashboardModal from "@/components/AdminDashboardModal";
import { exportWallMockup } from "@/components/exportMockup";
import { UserSession, fetchGalleryItems, ApiGalleryItem } from "@/components/apiService";
import {
  CURATED_ARTWORKS,
  REALISTIC_FRAMES,
  MAT_OPTIONS,
  MAT_COLORS,
  LUXURY_WALL_COLORS,
  ARTWORK_SIZES,
  ROOM_SCENES,
} from "@/components/constants";
import {
  GalleryImage,
  FrameStyle,
  MatOption,
  MatColor,
  ArtworkSize,
  WallColor,
  RoomScene,
} from "@/components/types";

export default function Home() {
  // Session & Modals
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string>("");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [orderNotice, setOrderNotice] = useState<string | null>(null);

  // Core Visual State
  const [artworks, setArtworks] = useState<GalleryImage[]>(CURATED_ARTWORKS);
  const [selectedArt, setSelectedArt] = useState<GalleryImage>(CURATED_ARTWORKS[0]);
  const [uploadedSrc, setUploadedSrc] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>(REALISTIC_FRAMES[0]);
  const [selectedMat, setSelectedMat] = useState<MatOption>(MAT_OPTIONS[2]); // Standard mat
  const [selectedMatColor, setSelectedMatColor] = useState<MatColor>(MAT_COLORS[1]);
  const [selectedSize, setSelectedSize] = useState<ArtworkSize>(ARTWORK_SIZES[1]); // 50x70
  const [wallColor, setWallColor] = useState<WallColor>(LUXURY_WALL_COLORS[0]);
  const [roomScene, setRoomScene] = useState<RoomScene>(ROOM_SCENES[0]);

  // Bottom Control Drawer Tab: null = closed/minimized, or "frames" | "art" | "wall" | "sizes"
  const [activeMenu, setActiveMenu] = useState<"frames" | "art" | "wall" | "sizes" | null>("frames");

  // Load session & gallery
  useEffect(() => {
    try {
      const sTok = localStorage.getItem("bidx_token");
      const sUsr = localStorage.getItem("bidx_user");
      if (sTok && sUsr) {
        setToken(sTok);
        setUser(JSON.parse(sUsr));
      }
    } catch {}

    fetchGalleryItems()
      .then((items: ApiGalleryItem[]) => {
        if (items && items.length > 0) {
          setArtworks(
            items.map((it) => ({
              id: it._id,
              src: it.src,
              alt: it.alt || it.title,
              label: it.title,
              category: it.category as any,
              aspect: it.aspect || "portrait",
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  // Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setUploadedSrc(ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Price calculation
  const perimeterMeters = ((selectedSize.widthCm + selectedSize.heightCm) * 2) / 100;
  const frameCost = Math.round(perimeterMeters * selectedFrame.pricePerMeter);
  const totalPrice = selectedSize.basePrice + frameCost + selectedMat.priceExtra;

  // Active Art Source
  const activeImage = uploadedSrc || selectedArt.src;
  const activeLabel = uploadedSrc ? "صورة مخصصة" : selectedArt.label;

  // Sizing in px
  const baseW = 320 * selectedSize.scaleRatio;
  let frameW = baseW;
  let frameH = baseW * 1.35;
  if (selectedArt.aspect === "landscape" && !uploadedSrc) {
    frameW = baseW * 1.25;
    frameH = baseW * 0.78;
  } else if (selectedArt.aspect === "square" && !uploadedSrc) {
    frameW = baseW;
    frameH = baseW;
  }

  // Floor style
  const floorClass =
    roomScene.floorType === "parquet"
      ? "floor-parquet"
      : roomScene.floorType === "marble"
      ? "floor-marble"
      : "floor-concrete";

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0d0f12] text-zinc-100 flex flex-col font-sans select-none">
      {/* 1. CLEAN TOP HEADER */}
      <header className="h-14 px-4 sm:px-6 z-40 flex items-center justify-between border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 font-black text-sm shadow-md">
            B
          </div>
          <span className="font-bold text-base text-white tracking-wide">BidX Frame</span>
        </div>

        {/* Top Right Simple Actions */}
        <div className="flex items-center gap-2 text-xs">
          {user?.role === "admin" && (
            <button
              onClick={() => setIsAdminOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold"
            >
              الإدارة
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
              <span className="max-w-[100px] truncate">{user.name}</span>
              <button
                onClick={() => {
                  localStorage.removeItem("bidx_token");
                  localStorage.removeItem("bidx_user");
                  setUser(null);
                  setToken("");
                }}
                className="text-zinc-500 hover:text-rose-400 ml-1"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 font-semibold transition-all"
            >
              تسجيل الدخول
            </button>
          )}

          <button
            onClick={() =>
              exportWallMockup({
                imageSrc: activeImage,
                frame: selectedFrame,
                matOption: selectedMat,
                matColor: selectedMatColor,
                artworkSize: selectedSize,
                wallColor: wallColor.hex,
                roomScene,
                glassOption: "window",
                aspectRatio: selectedArt.aspect,
              })
            }
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-medium transition-all"
            title="حفظ صورة الموك آب"
          >
            📸 حفظ
          </button>

          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>طلب</span>
            <span className="font-mono">({totalPrice} ر.س)</span>
          </button>
        </div>
      </header>

      {/* Order Alert */}
      {orderNotice && (
        <div className="absolute top-16 inset-x-4 z-50 bg-emerald-950/90 border border-emerald-500/40 rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs text-emerald-300 max-w-md mx-auto shadow-2xl backdrop-blur-md">
          <span>تم تسجيل طلبك رقم <strong>{orderNotice}</strong> بنجاح!</span>
          <button onClick={() => setOrderNotice(null)} className="font-bold">✕</button>
        </div>
      )}

      {/* 2. ENTIRE WALL (FULL VIEWPORT) */}
      <main className="relative flex-1 w-full h-[calc(100vh-3.5rem)] flex flex-col justify-between overflow-hidden">
        {/* Wall Canvas */}
        <div
          className="absolute inset-0 w-full h-full flex flex-col justify-between"
          style={{
            backgroundColor: wallColor.hex,
            transition: "background-color 0.4s ease",
          }}
        >
          {/* Framed Artwork in Center */}
          <div className="flex-1 w-full flex items-center justify-center p-6">
            <div className="relative flex flex-col items-center">
              {/* Brass Nail */}
              {selectedFrame.hasNail && (
                <>
                  <div className="luxury-brass-nail" aria-hidden="true" />
                  <div className="luxury-hanging-wire" aria-hidden="true" />
                </>
              )}

              {/* Physical Frame */}
              <div
                className={`relative z-10 transition-all duration-300 ${selectedFrame.frameClassName}`}
              >
                {/* Mat Board */}
                <div
                  style={{
                    backgroundColor: selectedMat.widthPx > 0 ? selectedMatColor.hex : "transparent",
                    padding: `${selectedMat.widthPx}px`,
                    boxShadow:
                      selectedMat.widthPx > 0
                        ? "inset 0 1px 3px rgba(0,0,0,0.25)"
                        : "none",
                  }}
                >
                  {/* Artwork Image */}
                  <div
                    className="relative overflow-hidden bg-zinc-900"
                    style={{
                      width: `${frameW}px`,
                      height: `${frameH}px`,
                    }}
                  >
                    <Image
                      src={activeImage}
                      alt={activeLabel}
                      fill
                      priority
                      className="object-cover"
                      sizes="600px"
                      unoptimized={activeImage.startsWith("data:")}
                    />
                    {/* Soft Glass Glare */}
                    <div className="glass-window-reflection" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* Realistic Ambient Wall Shadow */}
              <div className="artwork-cast-shadow" aria-hidden="true" />
            </div>
          </div>

          {/* Floor & Baseboard Skirting at Bottom */}
          <div className="relative w-full h-24 flex-shrink-0">
            <div className="skirting-board" />
            <div className={`w-full h-full ${floorClass}`} />

            {/* Credenza furniture silhouette for scale */}
            {roomScene.hasFurniture && (
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-20 pointer-events-none z-10 flex flex-col justify-end"
                aria-hidden="true"
              >
                <div className="w-full h-3 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 rounded-t-sm shadow-md" />
                <div className="w-full h-12 bg-gradient-to-b from-stone-900 to-stone-950 border-x border-b border-stone-800 flex items-center justify-around px-4">
                  <div className="w-px h-6 bg-stone-800" />
                  <div className="w-px h-6 bg-stone-800" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. ULTRA-CLEAN BOTTOM FLOATING CONTROLS (Non-busy, Sleek iOS/Figma dock style) */}
        <div className="absolute bottom-4 inset-x-4 z-30 flex flex-col items-center pointer-events-none">
          {/* Expanded Drawer Content if a button is clicked */}
          {activeMenu && (
            <div className="w-full max-w-xl mb-3 p-4 rounded-3xl bg-zinc-950/90 border border-white/10 shadow-2xl backdrop-blur-2xl pointer-events-auto animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 text-xs">
                <span className="font-bold text-white">
                  {activeMenu === "frames" && "اختر طراز الإطار والحاشية"}
                  {activeMenu === "art" && "اختر العمل الفني أو ارفع صورتك"}
                  {activeMenu === "wall" && "لون الجدار ومشهد الغرفة"}
                  {activeMenu === "sizes" && "أبعاد ومقاس اللوحة"}
                </span>
                <button
                  onClick={() => setActiveMenu(null)}
                  className="w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* MENU: FRAMES */}
              {activeMenu === "frames" && (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {REALISTIC_FRAMES.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setSelectedFrame(f)}
                        className={`flex flex-col items-center p-2 rounded-2xl border transition-all ${
                          selectedFrame.id === f.id
                            ? "bg-zinc-800 border-amber-400 shadow-md ring-2 ring-amber-400/20"
                            : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                        }`}
                        title={f.label}
                      >
                        <div
                          className={`w-9 h-9 rounded-lg ${f.frameClassName} mb-1`}
                          style={{ borderWidth: "4px" }}
                        />
                        <span className="text-[10px] text-zinc-300 font-medium truncate w-full text-center">
                          {f.label.split(" ")[0]}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Quick Mat Width */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-zinc-300">
                    <span className="text-[11px] text-zinc-400">الحاشية (المات):</span>
                    <div className="flex gap-1">
                      {MAT_OPTIONS.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMat(m)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                            selectedMat.id === m.id
                              ? "bg-amber-500 text-zinc-950 font-bold"
                              : "bg-zinc-900 text-zinc-400 hover:text-white"
                          }`}
                        >
                          {m.marginMm > 0 ? `${m.marginMm} مم` : "بدون"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* MENU: ARTWORK & UPLOAD */}
              {activeMenu === "art" && (
                <div className="flex flex-col gap-3">
                  {/* Upload button */}
                  <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-zinc-700 hover:border-amber-400 bg-zinc-900/50 cursor-pointer text-xs text-zinc-300">
                    <span>📷</span>
                    <span>رفع صورة خاصة من جهازك</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="sr-only" />
                  </label>

                  {/* Artwork gallery grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {artworks.map((art) => (
                      <button
                        key={art.id}
                        onClick={() => {
                          setSelectedArt(art);
                          setUploadedSrc(null);
                        }}
                        className={`relative aspect-square rounded-xl overflow-hidden border transition-all ${
                          selectedArt.id === art.id && !uploadedSrc
                            ? "border-amber-400 ring-2 ring-amber-400/30 scale-105"
                            : "border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <Image src={art.src} alt={art.label} fill className="object-cover" sizes="60px" unoptimized />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* MENU: WALL COLOR & ROOM */}
              {activeMenu === "wall" && (
                <div className="flex flex-col gap-3">
                  {/* Colors */}
                  <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                    {LUXURY_WALL_COLORS.slice(0, 12).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setWallColor(c)}
                        className={`aspect-square rounded-xl border transition-all ${
                          wallColor.id === c.id
                            ? "border-amber-400 scale-110 shadow-lg ring-2 ring-amber-400/40"
                            : "border-zinc-800 hover:scale-105"
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.label}
                      />
                    ))}
                  </div>

                  {/* Room Scene presets */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                    <span className="text-[11px] text-zinc-400">مشهد الغرفة:</span>
                    <div className="flex gap-1.5">
                      {ROOM_SCENES.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setRoomScene(s)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${
                            roomScene.id === s.id
                              ? "bg-amber-500 text-zinc-950 font-bold"
                              : "bg-zinc-900 text-zinc-400 hover:text-white"
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* MENU: SIZES */}
              {activeMenu === "sizes" && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ARTWORK_SIZES.map((sz) => (
                    <button
                      key={sz.id}
                      onClick={() => setSelectedSize(sz)}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col gap-0.5 ${
                        selectedSize.id === sz.id
                          ? "bg-zinc-800 border-amber-400 text-amber-300 font-bold"
                          : "bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                      }`}
                    >
                      <span className="text-xs">{sz.dimensionsCm}</span>
                      <span className="text-[10px] text-zinc-500">{sz.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Minimal Floating Dock Menu (Floating Bottom Bar) */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-950/80 border border-white/10 shadow-2xl backdrop-blur-xl pointer-events-auto">
            <button
              onClick={() => setActiveMenu(activeMenu === "frames" ? null : "frames")}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeMenu === "frames"
                  ? "bg-amber-500 text-zinc-950 font-bold shadow-md"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <span>🪞</span>
              <span>الإطار</span>
            </button>

            <button
              onClick={() => setActiveMenu(activeMenu === "art" ? null : "art")}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeMenu === "art"
                  ? "bg-amber-500 text-zinc-950 font-bold shadow-md"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <span>🖼️</span>
              <span>العمل الفني</span>
            </button>

            <button
              onClick={() => setActiveMenu(activeMenu === "wall" ? null : "wall")}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeMenu === "wall"
                  ? "bg-amber-500 text-zinc-950 font-bold shadow-md"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <span>🎨</span>
              <span>الجدار</span>
            </button>

            <button
              onClick={() => setActiveMenu(activeMenu === "sizes" ? null : "sizes")}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeMenu === "sizes"
                  ? "bg-amber-500 text-zinc-950 font-bold shadow-md"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <span>📐</span>
              <span>المقاس</span>
            </button>

            <div className="w-px h-5 bg-zinc-800 mx-1" />

            {/* Quick Price & Direct Checkout */}
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-zinc-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1"
            >
              <span>شراء</span>
              <span className="font-mono">{totalPrice} ر.س</span>
            </button>
          </div>
        </div>
      </main>

      {/* MODALS */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(u, t) => {
          setUser(u);
          setToken(t);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        user={user}
        onRequireLogin={() => setIsAuthOpen(true)}
        item={{
          artworkName: activeLabel,
          artworkSrc: activeImage,
          aspectRatio: selectedArt.aspect,
          frame: selectedFrame,
          matOption: selectedMat,
          matColor: selectedMatColor,
          artworkSize: selectedSize,
          glassId: "window",
          wallColorName: wallColor.label,
          price: totalPrice,
        }}
        onOrderSuccess={(num) => setOrderNotice(num)}
      />

      {token && (
        <AdminDashboardModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          token={token}
          onGalleryUpdated={() => {
            fetchGalleryItems().then((items: ApiGalleryItem[]) => {
              if (items && items.length > 0) {
                setArtworks(
                  items.map((it) => ({
                    id: it._id,
                    src: it.src,
                    alt: it.alt || it.title,
                    label: it.title,
                    category: it.category as any,
                    aspect: it.aspect || "portrait",
                  }))
                );
              }
            });
          }}
        />
      )}
    </div>
  );
}
