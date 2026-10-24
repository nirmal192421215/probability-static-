import { handleClientApi } from "./clientBackend";

const TOKEN_KEY = "eduwise_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token, remember) {
  clearToken();
  (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

const API_BASE = import.meta.env.VITE_API_URL || "";

export async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      body: options.body && !(options.body instanceof FormData) ? JSON.stringify(options.body) : options.body,
    });

    // If endpoint exists and responds normally
    if (res.ok) {
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/pdf")) {
        return res.blob();
      }
      if (ct.includes("application/json")) {
        return await res.json();
      }
      // If HTML was returned unexpectedly for an API call (e.g. Vercel SPA rewrite)
      if (path.startsWith("/api/")) {
        return handleClientApi(path, options);
      }
      return await res.text();
    }

    // If server returned 404, 405, or 500 (static deployment fallback)
    if (res.status === 404 || res.status === 405 || res.status >= 500) {
      return handleClientApi(path, options);
    }

    if (res.status === 401) {
      clearToken();
      if (!path.includes("/auth/login")) {
        window.location.href = "/login";
      }
    }

    const ct = res.headers.get("content-type") || "";
    const data = ct.includes("application/json") ? await res.json() : await res.text();
    const msg = data?.detail || data?.message || (typeof data === "string" ? data : "Request failed");
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  } catch (err) {
    // If fetch failed due to offline/no-backend, seamlessly fallback to client-side engine
    if (path.startsWith("/api/")) {
      try {
        return handleClientApi(path, options);
      } catch (innerErr) {
        throw innerErr;
      }
    }
    throw err;
  }
}
