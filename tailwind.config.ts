import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: "#0EA5E9",
          teal: "#14B8A6",
          lime: "#EFFF00",
          purple: "#A855F7",
          pink: "#EC4899",
          green: "#22C55E",
          orange: "#FF8C00",
        },
      },
      fontSize: {
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "28px" }],
        xl: ["20px", { lineHeight: "32px" }],
        "2xl": ["24px", { lineHeight: "36px" }],
        "3xl": ["30px", { lineHeight: "40px" }],
        "4xl": ["36px", { lineHeight: "48px" }],
        "5xl": ["48px", { lineHeight: "56px" }],
        "6xl": ["60px", { lineHeight: "68px" }],
      },
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
        manrope: ["Manrope", "ui-sans-serif", "system-ui"],
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
      },
      boxShadow: {
        light: "0 1px 3px rgba(0, 0, 0, 0.08)",
        medium: "0 4px 12px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
