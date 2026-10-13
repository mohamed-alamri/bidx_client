"use client";

import { useState } from "react";
import Image from "next/image";
import { UserSession, createCheckoutOrder } from "./apiService";
import { FrameStyle, MatOption, MatColor, ArtworkSize, GlassOptionId } from "./types";
import { GLASS_OPTIONS } from "./constants";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserSession | null;
  onRequireLogin: () => void;
  item: {
    artworkName: string;
    artworkSrc: string;
    aspectRatio: "portrait" | "landscape" | "square";
    frame: FrameStyle;
    matOption: MatOption;
    matColor: MatColor;
    artworkSize: ArtworkSize;
    glassId: GlassOptionId;
    wallColorName: string;
    price: number;
  };
  onOrderSuccess: (orderNumber: string) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  user,
  onRequireLogin,
  item,
  onOrderSuccess,
}: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [city, setCity] = useState(user?.shippingAddress?.city || "الرياض");
  const [address, setAddress] = useState(user?.shippingAddress?.address || "");
  const [notes, setNotes] = useState(user?.shippingAddress?.notes || "");
  const [paymentMethod, setPaymentMethod] = useState("الدفع عند الاستلام");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedGlass = GLASS_OPTIONS.find((g) => g.id === item.glassId) || GLASS_OPTIONS[0];

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !address) {
      setError("يرجى تعبئة جميع بيانات الشحن والاتصال");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const orderPayload = {
        userId: user?.id || null,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress: {
          city,
          address,
          notes,
        },
        items: [
          {
            artworkName: item.artworkName,
            artworkSrc: item.artworkSrc,
            artworkSourceType: item.artworkSrc.startsWith("data:") ? "uploaded" : "gallery",
            aspectRatio: item.aspectRatio,
            sizeId: item.artworkSize.id,
            dimensionsCm: item.artworkSize.dimensionsCm,
            frameId: item.frame.id,
            frameLabel: item.frame.label,
            matId: item.matOption.id,
            matLabel: item.matOption.label,
            matColor: item.matOption.widthPx > 0 ? item.matColor.label : "بدون",
            glassId: item.glassId,
            glassLabel: selectedGlass.label,
            wallColorUsed: item.wallColorName,
            quantity: 1,
            unitPrice: item.price,
            totalPrice: item.price,
          },
        ],
        paymentMethod,
      };

      const res = await createCheckoutOrder(orderPayload);
      onOrderSuccess(res.order.orderNumber);
      onClose();
    } catch (err: any) {
      setError(err.message || "فشل إتمام الطلب");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-950 border border-white/10 p-6 shadow-2xl text-zinc-100 flex flex-col gap-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg font-bold">
            🛍️
          </div>
          <div>
            <h3 className="text-base font-bold text-white">إتمام طلب التأطير الفاخر</h3>
            <p className="text-xs text-zinc-400">
              تأكيد المواصفات، العنوان الحرفي، وخيارات الدفع الآمن
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Order Summary Miniature Card */}
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-20 h-24 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-950 flex-shrink-0">
            {item.artworkSrc ? (
              <Image
                src={item.artworkSrc}
                alt={item.artworkName}
                fill
                className="object-cover"
                unoptimized
              />
            ) : null}
          </div>

          <div className="flex-1 flex flex-col gap-1 text-xs">
            <span className="font-bold text-sm text-white">{item.artworkName}</span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-zinc-400 mt-1">
              <span>المقاس: <strong className="text-zinc-200">{item.artworkSize.dimensionsCm}</strong></span>
              <span>الإطار: <strong className="text-amber-300">{item.frame.label}</strong></span>
              <span>الحاشية: <strong className="text-zinc-200">{item.matOption.marginMm > 0 ? `${item.matOption.marginMm} مم` : "بدون"}</strong></span>
              <span>الزجاج: <strong className="text-zinc-200">{selectedGlass.label.split("(")[0]}</strong></span>
            </div>
          </div>

          <div className="text-left sm:border-r border-zinc-800 sm:pr-4">
            <span className="text-[10px] text-zinc-400 block">الإجمالي</span>
            <span className="text-lg font-bold text-amber-400 font-mono">
              {item.price} <span className="text-xs font-normal text-zinc-400">ر.س</span>
            </span>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmitOrder} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex flex-col gap-1">
              <label className="text-zinc-300 font-medium">اسم العميل المستلم *</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="الاسم الثلاثي"
                className="px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-zinc-300 font-medium">رقم الجوال *</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="05XXXXXXXX"
                className="px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-zinc-300 font-medium">البريد الإلكتروني *</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="name@example.com"
                className="px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-zinc-300 font-medium">المدينة *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="الرياض، جدة، دبي..."
                className="px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="text-zinc-300 font-medium">العنوان التفصيلي (الحي / الشارع / المبنى) *</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="حي الملقا، شارع الأمير تركي، فيلا 12"
              className="px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="text-zinc-300 font-medium">ملاحظات حرفية إضافية (اختياري)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: يرجى التوصيل بعد الساعة 4 عصراً"
              className="px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Payment Method Selector */}
          <div className="flex flex-col gap-2 pt-2">
            <label className="text-xs text-zinc-300 font-medium">طريقة الدفع:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: "الدفع عند الاستلام", icon: "💵" },
                { id: "بطاقة بنكية", icon: "💳" },
                { id: "Apple Pay", icon: "" },
                { id: "تحويل بنكي", icon: "🏦" },
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-center gap-1.5 font-medium ${
                    paymentMethod === m.id
                      ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>{m.icon}</span>
                  <span>{m.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white text-xs font-semibold"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>جاري تسجيل الطلب...</span>
                </>
              ) : (
                <>
                  <span>تأكيد الطلب والشحن الحرفي</span>
                  <span>←</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
