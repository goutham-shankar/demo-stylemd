/**
 * Base URL for the StyleMD Express API.
 * Set `NEXT_PUBLIC_API_BASE` in `.env.local` to override (e.g. production).
 * Defaults to port 3002 in development (the Express backend default).
 */
export const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3002"
    : (typeof process.env.NEXT_PUBLIC_API_BASE === "string" && process.env.NEXT_PUBLIC_API_BASE.trim() !== ""
        ? process.env.NEXT_PUBLIC_API_BASE.trim()
        : "http://localhost:3002");
