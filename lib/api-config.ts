/**
 * Base URL for the StyleMD Express API (port 3002 by default).
 * Set `NEXT_PUBLIC_API_BASE` in `.env.local` to override (e.g. production).
 */
export const API_BASE =
  typeof process.env.NEXT_PUBLIC_API_BASE === "string" && process.env.NEXT_PUBLIC_API_BASE.trim() !== ""
    ? process.env.NEXT_PUBLIC_API_BASE.trim()
    : process.env.NODE_ENV === "development"
      ? "http://localhost:3002"
      : "";
