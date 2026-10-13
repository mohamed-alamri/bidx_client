const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role: "user" | "admin";
  phone?: string;
  shippingAddress?: {
    city?: string;
    address?: string;
    notes?: string;
  };
}

export interface ApiGalleryItem {
  _id: string;
  title: string;
  src: string;
  alt?: string;
  category: "طبيعة" | "فن تجريدي" | "عمارة ومدن" | "تراث وخط" | "أخرى";
  aspect: "portrait" | "landscape" | "square";
  price: number;
  isActive: boolean;
  createdAt: string;
}

export interface ApiOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    city: string;
    address: string;
    notes?: string;
  };
  items: Array<{
    artworkName: string;
    artworkSrc: string;
    aspectRatio: string;
    dimensionsCm: string;
    frameLabel: string;
    matLabel?: string;
    matColor?: string;
    glassLabel?: string;
    unitPrice: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  currency: string;
  status: "قيد المراجعة" | "قيد التنفيذ الحرفي" | "تم الشحن" | "مكتمل" | "ملغي";
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

// 1. Auth Helpers
export async function loginWithGoogle(credential: string, userInfo?: any) {
  const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential, userInfo }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "فشل تسجيل الدخول بواسطة Google");
  return data;
}

export async function loginAsGuest(email: string, name: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/guest-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "فشل تسجيل الدخول");
  return data;
}

export async function adminSecretLogin(secretKey: string, email?: string) {
  const res = await fetch(`${API_BASE_URL}/api/admin/login-secret`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secretKey, email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "رمز مرور المدير غير صحيح");
  return data;
}

// 2. Gallery Helpers
export async function fetchGalleryItems(category?: string) {
  const url = category && category !== "all" && category !== "الكل"
    ? `${API_BASE_URL}/api/gallery?category=${encodeURIComponent(category)}`
    : `${API_BASE_URL}/api/gallery`;
  const res = await fetch(url);
  const data = await res.json();
  return data.items || [];
}

export async function addGalleryItem(token: string, itemData: Partial<ApiGalleryItem>) {
  const res = await fetch(`${API_BASE_URL}/api/gallery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(itemData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "فشل إضافة اللوحة");
  return data.item;
}

export async function deleteGalleryItem(token: string, id: string) {
  const res = await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "فشل الحذف");
  return data;
}

// 3. Orders & Checkout Helpers
export async function createCheckoutOrder(orderData: any) {
  const res = await fetch(`${API_BASE_URL}/api/orders/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "فشل إتمام الطلب");
  return data;
}

export async function fetchMyOrders(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/orders/my-orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.orders || [];
}

// 4. Admin Management Helpers
export async function fetchAdminStats(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "غير مصرح");
  return data;
}

export async function fetchAdminOrders(token: string, status?: string, search?: string) {
  let url = `${API_BASE_URL}/api/orders/admin/all?`;
  if (status) url += `status=${encodeURIComponent(status)}&`;
  if (search) url += `search=${encodeURIComponent(search)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.orders || [];
}

export async function updateOrderStatus(token: string, orderId: string, status: string, paymentStatus?: string) {
  const res = await fetch(`${API_BASE_URL}/api/orders/admin/${orderId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status, paymentStatus }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "فشل تحديث حالة الطلب");
  return data.order;
}

export async function fetchAdminUsers(token: string, search?: string) {
  const url = search
    ? `${API_BASE_URL}/api/admin/users?search=${encodeURIComponent(search)}`
    : `${API_BASE_URL}/api/admin/users`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.users || [];
}

export async function updateUserRole(token: string, userId: string, role: "user" | "admin") {
  const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "فشل تغيير الصلاحية");
  return data.user;
}

export async function deleteUser(token: string, userId: string) {
  const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "فشل حذف المستخدم");
  return data;
}
