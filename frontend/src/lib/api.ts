//
// 🔹 Common API wrapper
//
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const baseUrl = rawBaseUrl ? rawBaseUrl.replace(/\/+$/, "") : "";
const hasBaseUrl = baseUrl.length > 0;
let baseUrlWarningShown = false;

function resolveUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return hasBaseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
}

async function api<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  if (!hasBaseUrl && import.meta.env.DEV && !baseUrlWarningShown) {
    console.info(
      "⚠️ VITE_API_BASE_URL is not set; using relative paths. Ensure the dev proxy forwards /api to the backend."
    );
    baseUrlWarningShown = true;
  }

  const requestUrl = resolveUrl(path);

  let response: Response;
  try {
    response = await fetch(requestUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
          ? `Bearer ${localStorage.getItem("token")}`
          : "",
        ...init?.headers,
      },
      ...init,
    });
  } catch (error) {
    throw new Error("❌ Unable to reach the backend API. Confirm the server is running.");
  }

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "message" in payload
        ? String((payload as Record<string, unknown>).message)
        : typeof payload === "string"
        ? payload
        : `Request failed: ${response.status}`;
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return payload as ApiResponse<T>;
}

//
// 🔹 AUTH API
//
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresAt: string;
  refreshToken?: string;
  user: {
    userId: string;
    fullName: string;
    email: string;
    roles: string[];
  };
}

export async function login(payload: LoginPayload) {
  return api<LoginResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function pingAuth() {
  return api<string>("/api/v1/auth/ping");
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface RegisterResponse {
  userId: string;
  email: string;
  fullName: string;
  status: string;
  createdAt: string;
  accessToken: string;
  expiresAt: string;
  refreshToken?: string;
}

export async function register(payload: RegisterPayload) {
  return api<RegisterResponse>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

//
// 🔹 USER API
//
export interface UserProfile {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  roles: string[];
}

export async function getCurrentUser() {
  return api<UserProfile>("/api/v1/users/me", { method: "GET" });
}

export interface UpdateProfilePayload {
  fullName?: string;
  phoneNumber?: string;
}

export async function updateProfile(payload: UpdateProfilePayload) {
  return api<UserProfile>("/api/v1/users/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function changePassword(oldPassword: string, newPassword: string) {
  return api<string>("/api/v1/users/change-password", {
    method: "POST",
    body: JSON.stringify({ oldPassword, newPassword }),
  });
}

//
// 🔹 RESERVATIONS API
//
export interface Reservation {
  reservationId: string;
  stationName: string;
  startTime: string;
  endTime?: string;
  status: string; // Pending | Active | Completed
}

export async function getReservations() {
  return api<Reservation[]>("/api/v1/reservations", { method: "GET" });
}

//
// 🔹 HISTORY API
//
export interface ChargingHistory {
  sessionId: string;
  stationName: string;
  energyConsumedKWh: number;
  cost: number;
  startTime: string;
  endTime: string;
}

export async function getHistory() {
  return api<ChargingHistory[]>("/api/v1/history", { method: "GET" });
}

//
// 🔹 WALLET API
//
export interface Wallet {
  balance: number;
  currency: string;
  transactions: {
    id: string;
    type: "topup" | "payment";
    amount: number;
    timestamp: string;
  }[];
}

export async function getWallet() {
  return api<Wallet>("/api/v1/wallet", { method: "GET" });
}

export default api;
