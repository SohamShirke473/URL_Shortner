import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const API_BASE_URL = rawBaseUrl.endsWith("/api") ? rawBaseUrl : `${rawBaseUrl}/api`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Url {
  id: string;
  url: string;
  short_code: string;
  user_id: string;
  created_at: string;
}

export interface Analytics {
  id: string;
  urlId?: string;
  originalUrl?: string;
  shortCode?: string;
  ipAddress: string;
  userAgent: string;
  clickedAt: string;
}

export const authApi = {
  register: async (data: { email: string; password: string; name: string }) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post("/auth/login", data);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  getMe: async () => {
    const response = await api.get<{ message: string; user: User }>("/auth/me");
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};

export const urlApi = {
  createUrl: async (data: { url: string }) => {
    const response = await api.post<{ message: string; data: Url }>("/url", data);
    return response.data;
  },

  getUrls: async () => {
    const response = await api.get<{ message: string; data: Url[] }>("/urls");
    return response.data;
  },

  getUrl: async (id: string) => {
    const response = await api.get<{ message: string; data: Url }>(`/url/${id}`);
    return response.data;
  },

  updateUrl: async (id: string, data: { url: string }) => {
    const response = await api.put<{ message: string; data: Url }>(`/url/${id}`, data);
    return response.data;
  },

  deleteUrl: async (id: string) => {
    const response = await api.delete<{ message: string; data: Url }>(`/url/${id}`);
    return response.data;
  },

  bulkDeleteUrls: async (ids: string[]) => {
    const response = await api.delete<{ message: string; data: Url[] }>("/urls/bulk", { data: { ids } });
    return response.data;
  },
};

export const analyticsApi = {
  getAnalytics: async (urlId: string) => {
    const response = await api.get<{ message: string; data: Analytics[] }>(`/analytics/${urlId}`);
    return response.data;
  },

  getAllAnalytics: async () => {
    const response = await api.get<{ message: string; data: Analytics[] }>("/analytics");
    return response.data;
  },
};
