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

export async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(path, {
    ...options,
    headers,
    body: options.body && !(options.body instanceof FormData) ? JSON.stringify(options.body) : options.body,
  });
  if (res.status === 401) {
    clearToken();
    if (!path.includes("/auth/login")) {
      window.location.href = "/login";
    }
  }
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/pdf")) {
    if (!res.ok) throw new Error("PDF download failed");
    return res.blob();
  }
  const data = ct.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) {
    const msg = data?.detail || data?.message || (typeof data === "string" ? data : "Request failed");
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return data;
}
