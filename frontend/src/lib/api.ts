interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function api<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  if (!BASE_URL) {
    throw new Error("Missing VITE_API_BASE_URL environment variable.");
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...init?.headers },
      ...init,
    });
  } catch (error) {
    throw new Error("Unable to reach the backend API. Confirm the server is running and HTTPS is trusted.");
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

export interface LoginPayload {
  email: string;
  password: string;
}

export async function pingAuth() {
  return api<string>("/api/v1/auth/ping");
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

export default api;