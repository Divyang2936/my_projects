const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export type ApiUser = {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  provider: string;
  role: string;
  points: number;
  createdAt: string;
};

export type ApiProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  volume: string;
  imageUrl: string;
  stock: number;
};

export type ApiOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  items: { productId: string; productName: string; volume: string; unitPrice: number; quantity: number }[];
};

export type ApiAddress = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
  defaultAddress: boolean;
};

type ApiEnvelope<T> = { success: boolean; data: T; message: string; code: string };

const csrfToken = () => document.cookie.split("; ")
  .find((cookie) => cookie.startsWith("XSRF-TOKEN="))?.split("=").slice(1).join("=");

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (init.method && !["GET", "HEAD", "OPTIONS"].includes(init.method.toUpperCase())) {
    const csrf = csrfToken();
    if (csrf) headers.set("X-XSRF-TOKEN", decodeURIComponent(csrf));
  }
  const response = await fetch(`${API_URL}${path}`, { ...init, headers, credentials: "include" });
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try { message = (await response.json()).message || message; } catch { /* non-JSON response */ }
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  const body = await response.json() as ApiEnvelope<T>;
  return body.data;
}

export const api = {
  csrf: () => request<void>("/api/auth/csrf"),
  login: (payload: { email: string; password: string }) => request<ApiUser>("/api/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload: { email: string; password: string; firstName: string; lastName: string }) => request<ApiUser>("/api/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => request<void>("/api/auth/logout", { method: "POST" }),
  me: () => request<ApiUser>("/api/account"),
  updateProfile: (payload: { firstName: string; lastName: string }) => request<ApiUser>("/api/account", { method: "PUT", body: JSON.stringify(payload) }),
  products: () => request<ApiProduct[]>("/api/products"),
  orders: () => request<ApiOrder[]>("/api/orders"),
  order: (orderNumber: string) => request<ApiOrder>(`/api/orders/${encodeURIComponent(orderNumber)}`),
  addresses: () => request<ApiAddress[]>("/api/account/addresses"),
  addAddress: (payload: Omit<ApiAddress, "id" | "defaultAddress"> & { defaultAddress?: boolean }) => request<ApiAddress>("/api/account/addresses", { method: "POST", body: JSON.stringify(payload) }),
  createOrder: (payload: unknown, idempotencyKey: string) => request<ApiOrder>("/api/orders", { method: "POST", headers: { "Idempotency-Key": idempotencyKey }, body: JSON.stringify(payload) }),
  googleLoginUrl: () => `${API_URL}/api/auth/google`,
};
