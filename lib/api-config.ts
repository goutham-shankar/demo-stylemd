/**
 * Base URL for the StyleMD Express API.
 * Set `NEXT_PUBLIC_API_BASE` in `.env.local` to override (e.g. production).
 * Defaults to port 3002 in development (the Express backend default).
 */
const rawBase =
  typeof process.env.NEXT_PUBLIC_API_BASE === "string" &&
  process.env.NEXT_PUBLIC_API_BASE.trim() !== ""
    ? process.env.NEXT_PUBLIC_API_BASE.trim()
    : "http://localhost:3002";

// Remove trailing slash if it exists
export const API_BASE = rawBase.endsWith("/") ? rawBase.slice(0, -1) : rawBase;
