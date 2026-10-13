"use client";

import { useState } from "react";
import {
  UserSession,
  loginWithGoogle,
  loginAsGuest,
  adminSecretLogin,
} from "./apiService";
// auth
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserSession, token: string) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<"google" | "guest" | "admin">("google");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [googleClientToken, setGoogleClientToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulatedGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Prompt user or use prompt mock
      const mockGoogleUser = {
        email: email || "user.studio@gmail.com",
        name: name || "محمد العمري",
        picture:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
        id: `google_id_${Date.now()}`,
      };

      const res = await loginWithGoogle(
        googleClientToken || "simulated_google_token",
        mockGoogleUser,
      );
      localStorage.setItem("bidx_token", res.token);
      localStorage.setItem("bidx_user", JSON.stringify(res.user));
      onLoginSuccess(res.user, res.token);
      onClose();
    } catch (err: any) {
      setError(err.message || "فشل تسجيل الدخول بـ Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("البريد الإلكتروني مطلوب");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await loginAsGuest(email, name || "عميل الاستوديو");
      localStorage.setItem("bidx_token", res.token);
      localStorage.setItem("bidx_user", JSON.stringify(res.user));
      onLoginSuccess(res.user, res.token);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminSecret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretKey) {
      setError("رمز المرور السري مطلوب");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminSecretLogin(
        secretKey,
        email || "admin@bidx-studio.com",
      );
      localStorage.setItem("bidx_token", res.token);
      localStorage.setItem("bidx_user", JSON.stringify(res.user));
      onLoginSuccess(res.user, res.token);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-zinc-950 border border-white/10 p-6 shadow-2xl text-zinc-100 flex flex-col gap-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center gap-1.5 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 text-2xl font-black shadow-lg shadow-amber-500/20">
            B
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            تسجيل الدخول إلى BidX Studio
          </h3>
          <p className="text-xs text-zinc-400">
            سجل دخولك لحفظ تصاميمك، متابعة طلباتك، وإتمام الشراء
          </p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold">
          <button
            onClick={() => setMode("google")}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === "google"
                ? "bg-amber-500 text-zinc-950 shadow-md font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Google OAuth
          </button>
          <button
            onClick={() => setMode("guest")}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === "guest"
                ? "bg-amber-500 text-zinc-950 shadow-md font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            بريد إلكتروني
          </button>
          <button
            onClick={() => setMode("admin")}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === "admin"
                ? "bg-amber-500 text-zinc-950 shadow-md font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            لوحة الإدارة
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Mode 1: Google OAuth */}
        {mode === "google" && (
          <div className="flex flex-col gap-4">
            <button
              onClick={handleSimulatedGoogleLogin}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-lg active:scale-98 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>
                {isLoading
                  ? "جاري تسجيل الدخول..."
                  : "المتابعة باستخدام Google"}
              </span>
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-[11px] text-zinc-500">
                أو تخصيص بيانات التجربة
              </span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            <div className="flex flex-col gap-2.5">
              <input
                type="text"
                placeholder="اسمك (اختياري)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <input
                type="email"
                placeholder="بريدك الإلكتروني (اختياري)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}

        {/* Mode 2: Quick Email / Guest */}
        {mode === "guest" && (
          <form onSubmit={handleGuestLogin} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="الاسم الكامل"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-500"
              required
            />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-500"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs transition-all shadow-lg active:scale-98 disabled:opacity-50"
            >
              {isLoading ? "جاري الدخول..." : "متابعة كعميل"}
            </button>
          </form>
        )}

        {/* Mode 3: Admin Secret Key */}
        {mode === "admin" && (
          <form onSubmit={handleAdminSecret} className="flex flex-col gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] leading-relaxed">
              🔐 ادخل الرمز السري للمدير للوصول للوحة التحكم الكاملة وإدارة
              الصور والطلبات. (الافتراضي:{" "}
              <code className="font-mono font-bold">
                bidx_admin_secret_pass_2026
              </code>
              )
            </div>
            <input
              type="password"
              placeholder="رمز مرور المدير (Admin Secret)"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              required
            />
            <input
              type="email"
              placeholder="بريد المدير (admin@bidx-studio.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs transition-all shadow-lg active:scale-98 disabled:opacity-50"
            >
              {isLoading
                ? "جاري التخويل..."
                : "الدخول بصلاحية الإدارة (Admin Login)"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
