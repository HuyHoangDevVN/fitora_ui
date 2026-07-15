const trimTrailingSlashes = (value: string): string => value.replace(/\/+$/, "");

const rawApiUrl = import.meta.env.VITE_API_URL?.trim();

if (import.meta.env.DEV && rawApiUrl !== undefined && rawApiUrl.length === 0) {
  throw new Error("VITE_API_URL must not be empty in development.");
}

export const API_BASE_URL =
  rawApiUrl && rawApiUrl.length > 0 ? trimTrailingSlashes(rawApiUrl) : "/api";

