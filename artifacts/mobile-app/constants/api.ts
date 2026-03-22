import { Platform } from "react-native";

const domain = process.env.EXPO_PUBLIC_DOMAIN || "";

export const API_BASE = Platform.OS === "web"
  ? "/api"
  : `https://${domain}/api`;

export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });
  return res;
}
