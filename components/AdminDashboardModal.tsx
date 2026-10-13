"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  fetchAdminStats,
  fetchAdminOrders,
  updateOrderStatus,
  fetchAdminUsers,
  updateUserRole,
  deleteUser,
  fetchGalleryItems,
  addGalleryItem,
  deleteGalleryItem,
  ApiOrder,
  ApiGalleryItem,
} from "./apiService";

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  onGalleryUpdated: () => void;
}

export default function AdminDashboardModal({
  isOpen,
  onClose,
  token,
  onGalleryUpdated,
}: AdminDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<"stats" | "gallery" | "orders" | "users">("stats");

  // Stats State
  const [stats, setStats] = useState<any>(null);

  // Gallery State
  const [galleryItems, setGalleryItems] = useState<ApiGalleryItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newSrc, setNewSrc] = useState("");
  const [newCategory, setNewCategory] = useState<"طبيعة" | "فن تجريدي" | "عمارة ومدن" | "تراث وخط">("طبيعة");
  const [newAspect, setNewAspect] = useState<"portrait" | "landscape" | "square">("portrait");
  const [newPrice, setNewPrice] = useState(190);
  const [isAddingImage, setIsAddingImage] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [orderFilter, setOrderFilter] = useState("الكل");
  const [orderSearch, setOrderSearch] = useState("");

  // Users State
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState("");

  // Loading & Message
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "stats") {
        const data = await fetchAdminStats(token);
        setStats(data.stats);
      } else if (activeTab === "gallery") {
        const items = await fetchGalleryItems();
        setGalleryItems(items);
      } else if (activeTab === "orders") {
        const ords = await fetchAdminOrders(token, orderFilter, orderSearch);
        setOrders(ords);
      } else if (activeTab === "users") {
        const usrs = await fetchAdminUsers(token, userSearch);
        setUsers(usrs);
      }
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, activeTab, orderFilter]);

  if (!isOpen) return null;

  const handleAddGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSrc) {
      setMessage({ text: "العنوان ورابط الصورة مطلوبان", type: "error" });
      return;
    }
    setIsAddingImage(true);
    try {
      await addGalleryItem(token, {
        title: newTitle,
        src: newSrc,
        category: newCategory,
        aspect: newAspect,
        price: newPrice,
      });
      setMessage({ text: "تمت إضافة الصورة بنجاح إلى المعرض!", type: "success" });
      setNewTitle("");
      setNewSrc("");
      const items = await fetchGalleryItems();
      setGalleryItems(items);
      onGalleryUpdated();
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setIsAddingImage(false);
    }
  };

  const handleDeleteGalleryImage = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه اللوحة من المعرض؟")) return;
    try {
      await deleteGalleryItem(token, id);
      setMessage({ text: "تم حذف العمل الفني بنجاح", type: "success" });
      setGalleryItems(galleryItems.filter((item) => item._id !== id));
      onGalleryUpdated();
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const updated = await updateOrderStatus(token, orderId, newStatus);
      setMessage({ text: `تم تحديث حالة الطلب إلى "${newStatus}"`, type: "success" });
      setOrders(orders.map((o) => (o._id === orderId ? updated : o)));
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    }
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      const updated = await updateUserRole(token, userId, newRole);
      setMessage({ text: `تم تغيير الصلاحية إلى "${newRole}"`, type: "success" });
      setUsers(users.map((u) => (u._id === userId ? updated : u)));
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
    try {
      await deleteUser(token, userId);
      setMessage({ text: "تم حذف المستخدم بنجاح", type: "success" });
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[90vh] rounded-3xl bg-zinc-950 border border-white/10 p-5 sm:p-7 shadow-2xl text-zinc-100 flex flex-col gap-5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 text-lg font-black shadow-lg shadow-amber-500/20">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">لوحة تحكم المدير والإدارة العامة</h3>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  ADMIN PORTAL
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                إدارة المعرض وإضافة الصور، متابعة وتنفيذ الطلبات، وإدارة المستخدمين
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Status Notification */}
        {message && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center justify-between border flex-shrink-0 ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-rose-500/10 border-rose-500/30 text-rose-300"
            }`}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-xs font-bold">✕</button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-2 p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold flex-shrink-0 overflow-x-auto">
          {[
            { id: "stats", label: "📊 نظرة عامة والإحصائيات" },
            { id: "gallery", label: "🖼️ إدارة معرض الصور" },
            { id: "orders", label: "📦 سجل الطلبات والشحن" },
            { id: "users", label: "👥 المستخدمين والصلاحيات" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setMessage(null);
              }}
              className={`py-2 px-4 rounded-lg whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-amber-500 text-zinc-950 font-bold shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1">
          {/* TAB 1: STATS */}
          {activeTab === "stats" && (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col gap-1">
                  <span className="text-xs text-zinc-400">إجمالي المبيعات</span>
                  <span className="text-xl sm:text-2xl font-bold text-amber-400 font-mono">
                    {stats?.totalRevenue ?? 0} <span className="text-xs text-zinc-400 font-normal">ر.س</span>
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col gap-1">
                  <span className="text-xs text-zinc-400">عدد الطلبات</span>
                  <span className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">
                    {stats?.totalOrders ?? 0}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col gap-1">
                  <span className="text-xs text-zinc-400">لوحات المعرض</span>
                  <span className="text-xl sm:text-2xl font-bold text-sky-400 font-mono">
                    {stats?.totalGalleryItems ?? 0}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col gap-1">
                  <span className="text-xs text-zinc-400">المستخدمين المسجلين</span>
                  <span className="text-xl sm:text-2xl font-bold text-purple-400 font-mono">
                    {stats?.totalUsers ?? 0}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-col gap-3">
                <h4 className="text-sm font-bold text-white">إجراءات الإدارة السريعة</h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => setActiveTab("gallery")}
                    className="px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all font-semibold"
                  >
                    + إضافة عمل فني جديد للمعرض
                  </button>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="px-3.5 py-2 rounded-xl bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-all"
                  >
                    مراجعة الطلبات الجديدة
                  </button>
                  <button
                    onClick={loadData}
                    className="px-3.5 py-2 rounded-xl bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-all"
                  >
                    🔄 تحديث البيانات الحية
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GALLERY MANAGEMENT */}
          {activeTab === "gallery" && (
            <div className="flex flex-col gap-6">
              {/* Add New Image Form */}
              <form
                onSubmit={handleAddGalleryImage}
                className="p-4 sm:p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="text-amber-400 font-bold">+</span>
                    <span>إضافة لوحة جديدة إلى المعرض الحي</span>
                  </h4>
                  <span className="text-[11px] text-zinc-400">ستظهر مباشرة لجميع زوار الاستوديو</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex flex-col gap-1">
                    <label className="text-zinc-300">عنوان اللوحة / العمل *</label>
                    <input
                      type="text"
                      placeholder="مثال: واحة الغروب الذهبية"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-zinc-300">رابط الصورة المباشر (URL أو Unsplash) *</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={newSrc}
                      onChange={(e) => setNewSrc(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-zinc-300">التصنيف</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="طبيعة">طبيعة</option>
                      <option value="فن تجريدي">فن تجريدي</option>
                      <option value="عمارة ومدن">عمارة ومدن</option>
                      <option value="تراث وخط">تراث وخط</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-zinc-300">الاتجاه والتناسق</label>
                    <select
                      value={newAspect}
                      onChange={(e) => setNewAspect(e.target.value as any)}
                      className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="portrait">طولي (Portrait)</option>
                      <option value="landscape">عرضي (Landscape)</option>
                      <option value="square">مربع (Square)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAddingImage}
                  className="self-end px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-98 disabled:opacity-50"
                >
                  {isAddingImage ? "جاري الإضافة..." : "حفظ ونشر العمل بالمعرض"}
                </button>
              </form>

              {/* Current Gallery List */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-white">لوحات المعرض الحالية ({galleryItems.length})</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {galleryItems.map((item) => (
                    <div
                      key={item._id}
                      className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden flex flex-col group"
                    >
                      <div className="relative w-full h-32 bg-zinc-950">
                        <Image
                          src={item.src}
                          alt={item.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div className="absolute top-2 right-2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-semibold text-zinc-300">
                          {item.category}
                        </div>
                      </div>

                      <div className="p-3 flex items-center justify-between text-xs">
                        <div className="flex flex-col">
                          <span className="font-bold text-white">{item.title}</span>
                          <span className="text-[10px] text-zinc-400">{item.aspect}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteGalleryImage(item._id)}
                          className="text-xs text-rose-400 hover:text-rose-300 p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20"
                          title="حذف من المعرض"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === "orders" && (
            <div className="flex flex-col gap-4">
              {/* Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-1.5 text-xs">
                  {["الكل", "قيد المراجعة", "قيد التنفيذ الحرفي", "تم الشحن", "مكتمل", "ملغي"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                        orderFilter === st
                          ? "bg-amber-500 text-zinc-950 font-bold"
                          : "bg-zinc-900 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders List */}
              <div className="flex flex-col gap-3">
                {orders.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500 text-xs">لا توجد طلبات في هذا التصنيف حالياً</div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order._id}
                      className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-3 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-800">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-400 text-sm">{order.orderNumber}</span>
                          <span className="text-zinc-400">• {new Date(order.createdAt).toLocaleDateString("ar-SA")}</span>
                        </div>

                        {/* Status Select */}
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-400 text-[11px]">حالة الطلب:</span>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                            className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-700 text-xs font-bold text-amber-300 focus:outline-none"
                          >
                            <option value="قيد المراجعة">قيد المراجعة</option>
                            <option value="قيد التنفيذ الحرفي">قيد التنفيذ الحرفي</option>
                            <option value="تم الشحن">تم الشحن</option>
                            <option value="مكتمل">مكتمل</option>
                            <option value="ملغي">ملغي</option>
                          </select>
                        </div>
                      </div>

                      {/* Customer & Shipping Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-zinc-300">
                        <div>
                          <span className="text-zinc-500 block text-[10px]">العميل</span>
                          <span className="font-semibold">{order.customerName}</span> ({order.customerPhone})
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px]">العنوان والتوصيل</span>
                          <span>{order.shippingAddress.city} - {order.shippingAddress.address}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px]">طريقة الدفع والمبلغ</span>
                          <span className="font-mono font-bold text-amber-400">{order.totalAmount} ر.س</span> ({order.paymentMethod})
                        </div>
                      </div>

                      {/* Items */}
                      <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex flex-col gap-1.5">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between text-zinc-400">
                            <span>• {it.artworkName} - مقاس {it.dimensionsCm} (إطار: {it.frameLabel})</span>
                            <span className="font-mono text-zinc-200">{it.totalPrice} ر.س</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: USERS MANAGEMENT */}
          {activeTab === "users" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">المستخدمين المسجلين ({users.length})</h4>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {users.map((u) => (
                  <div
                    key={u._id}
                    className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-amber-400">
                        {u.name?.charAt(0) || "U"}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{u.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.role === "admin"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                : "bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            {u.role === "admin" ? "مدير (Admin)" : "عميل"}
                          </span>
                        </div>
                        <span className="text-zinc-400 text-[11px]">{u.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleRole(u._id, u.role)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium"
                      >
                        {u.role === "admin" ? "تحويل إلى عميل" : "ترقية إلى مدير"}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                        title="حذف"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
