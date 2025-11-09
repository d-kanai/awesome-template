import type { Config } from "tailwindcss";
import { figmaTokens } from "./design-tokens/tailwind-tokens";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-roboto-mono)", "monospace"],
      },
      colors: {
        // Semantic Colors (CSS Variables)
        background: "var(--background)",
        "background-secondary": "var(--background-secondary)",
        "background-tertiary": "var(--background-tertiary)",
        foreground: "var(--foreground)",
        "foreground-secondary": "var(--foreground-secondary)",
        "foreground-tertiary": "var(--foreground-tertiary)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          hover: "var(--secondary-hover)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          hover: "var(--destructive-hover)",
          foreground: "var(--destructive-foreground)",
        },
        success: {
          DEFAULT: "var(--success)",
          hover: "var(--success-hover)",
          foreground: "var(--success-foreground)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          hover: "var(--warning-hover)",
          foreground: "var(--warning-foreground)",
        },
        border: {
          DEFAULT: "var(--border)",
          secondary: "var(--border-secondary)",
        },
        input: "var(--input)",
        ring: "var(--ring)",
        neutral: {
          DEFAULT: "var(--neutral)",
          hover: "var(--neutral-hover)",
          foreground: "var(--neutral-foreground)",
          border: "var(--neutral-border)",
        },
        subtle: {
          DEFAULT: "var(--subtle)",
          hover: "var(--subtle-hover)",
          foreground: "var(--subtle-foreground)",
          "foreground-hover": "var(--subtle-foreground-hover)",
          border: "var(--subtle-border)",
          "border-hover": "var(--subtle-border-hover)",
        },
        disabled: {
          DEFAULT: "var(--disabled)",
          foreground: "var(--disabled-foreground)",
          border: "var(--disabled-border)",
        },
        // Figma Design Tokens (Direct Access)
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
