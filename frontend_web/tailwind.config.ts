import type { Config } from "tailwindcss";
import { figmaTokens } from "./design-tokens/tailwind-tokens";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Figma Design Tokens
        ...figmaTokens.colors,
      },
      spacing: {
        // Figma Design Tokens
        ...figmaTokens.spacing,
      },
      fontSize: {
        // Figma Design Tokens
        ...figmaTokens.fontSize,
      },
      fontWeight: {
        // Figma Design Tokens
        ...figmaTokens.fontWeight,
      },
    },
  },
  plugins: [],
};

export default config;
