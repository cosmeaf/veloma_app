// src/api/api.js
import axios from "axios";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

// Storage keys
export const ACCESS_KEY = "access_token";
export const REFRESH_KEY = "refresh_token";

// Endpoints
export const LOGIN_PATH                 = "/auth/login";
export const REFRESH_PATH               = "/auth/refresh";
export const REGISTER_PATH              = "/auth/register";
export const EMAIL_SEND_VERIF_PATH      = "/auth/email/send-verification";
export const EMAIL_VERIFY_PATH          = "/auth/email/verify";
export const OTP_GENERATE_PATH          = "/auth/otp/generate";
export const OTP_VERIFY_PATH            = "/auth/otp/verify";
export const RECOVERY_PATH              = "/auth/recovery";
export const RESET_PASSWORD_PATH        = "/auth/reset-password";

// Axios
const api = axios.create({
  baseURL: BASE_URL,            // ex.: https://api.alvelos.com/api
  timeout: 20000,
  withCredentials: false,
  headers: { Accept: "*/*", "Content-Type": "application/json" },
});

// Request: add token + LOG
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_KEY);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    try {
      console.groupCollapsed(`[API ⇢ ${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`);
      const safe = config.data && typeof config.data === "object"
        ? { ...config.data, password: config.data.password ? "***" : undefined }
        : config.data;
      console.log("headers", config.headers);
      console.log("payload", safe);
      console.groupEnd();
    } catch {
      // Ignore Error log
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Refresh queue
let refreshing = false;
let queue = [];
const flushQueue = (err, token = null) => {
  queue.forEach(({ resolve, reject }) => (err ? reject(err) : resolve(token)));
  queue = [];
};

// Response: try refresh on 401 once
api.interceptors.response.use(
  (res) => {
    try {
      console.groupCollapsed(`[API ⇠ ${res.config.method?.toUpperCase()}] ${res.config.baseURL}${res.config.url} (${res.status})`);
      console.log("data", res.data);
      console.groupEnd();
    } catch {
      // Ignore Error log
    }
    return res;
  },
  async (error) => {
    const original = error.config;
    const status = error?.response?.status;

    try {
      console.groupCollapsed(`[API ⇠ ERROR ${original?.method?.toUpperCase()}] ${original?.baseURL || ""}${original?.url || ""} (${status || "NO_STATUS"})`);
      console.log("resp.data", error?.response?.data);
      console.log("req.headers", original?.headers);
      console.groupEnd();
    } catch {
      // Ignore Error log
    }

    if (status === 401 && !original?._retry) {
      const refresh = localStorage.getItem(REFRESH_KEY);
      if (!refresh) {
        localStorage.removeItem(ACCESS_KEY);
        return Promise.reject(error);
      }
      original._retry = true;

      if (refreshing) {
        return new Promise((resolve, reject) => {
          queue.push({
            resolve: (token) => {
              original.headers = original.headers || {};
              original.headers.Authorization = `Bearer ${token}`;
              resolve(api(original));
            },
            reject,
          });
        });
      }

      try {
        refreshing = true;
        const { data } = await axios.post(`${BASE_URL}${REFRESH_PATH}`, { refresh });
        const newAccess = data?.access || data?.access_token;
        const newRefresh = data?.refresh || data?.refresh_token;
        if (!newAccess) throw new Error("Refresh sem access token");

        localStorage.setItem(ACCESS_KEY, newAccess);
        if (newRefresh) localStorage.setItem(REFRESH_KEY, newRefresh);

        flushQueue(null, newAccess);
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch (e) {
        flushQueue(e, null);
        localStorage.removeItem(ACCESS_KEY);
        localStorage.removeItem(REFRESH_KEY);
        return Promise.reject(e);
      } finally {
        refreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { api };
