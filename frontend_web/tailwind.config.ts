import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Text colors
        text: {
          brand: {
            "on-brand-tertiary":
              "var(--sds-color-text-brand-on-brand-tertiary)",
            "on-brand": "var(--sds-color-text-brand-on-brand)",
            tertiary: "var(--sds-color-text-brand-tertiary)",
          },
          default: {
            DEFAULT: "var(--sds-color-text-default-default)",
            tertiary: "var(--sds-color-text-default-tertiary)",
            secondary: "var(--sds-color-text-default-secondary)",
          },
          neutral: {
            DEFAULT: "var(--sds-color-text-neutral-default)",
          },
          disabled: {
            "on-disabled": "var(--sds-color-text-disabled-on-disabled)",
          },
        },
        // Background colors
        background: {
          default: {
            DEFAULT: "var(--sds-color-background-default-default)",
            secondary: "var(--sds-color-background-default-secondary)",
          },
          brand: {
            DEFAULT: "var(--sds-color-background-brand-default)",
            hover: "var(--sds-color-background-brand-hover)",
            secondary: "var(--sds-color-background-brand-secondary)",
            tertiary: "var(--sds-color-background-brand-tertiary)",
          },
          neutral: {
            tertiary: "var(--sds-color-background-neutral-tertiary)",
            "tertiary-hover":
              "var(--sds-color-background-neutral-tertiary-hover)",
          },
          disabled: {
            DEFAULT: "var(--sds-color-background-disabled-default)",
          },
          utilities: {
            scrim: "var(--sds-color-background-utilities-scrim)",
          },
        },
        // Border colors
        border: {
          default: {
            DEFAULT: "var(--sds-color-border-default-default)",
          },
          brand: {
            DEFAULT: "var(--sds-color-border-brand-default)",
          },
          neutral: {
            secondary: "var(--sds-color-border-neutral-secondary)",
          },
          disabled: {
            DEFAULT: "var(--sds-color-border-disabled-default)",
          },
        },
        // Icon colors
        icon: {
          default: {
            tertiary: "var(--sds-color-icon-default-tertiary)",
            DEFAULT: "var(--sds-color-icon-default-default)",
          },
          brand: {
            "on-brand": "var(--sds-color-icon-brand-on-brand)",
          },
        },
      },
      // Spacing
      spacing: {
        100: "var(--sds-size-space-100)",
        200: "var(--sds-size-space-200)",
        300: "var(--sds-size-space-300)",
        400: "var(--sds-size-space-400)",
        600: "var(--sds-size-space-600)",
        800: "var(--sds-size-space-800)",
        1200: "var(--sds-size-space-1200)",
        1600: "var(--sds-size-space-1600)",
        4000: "var(--sds-size-space-4000)",
      },
      // Border radius
      borderRadius: {
        100: "var(--sds-size-radius-100)",
        200: "var(--sds-size-radius-200)",
        400: "var(--sds-size-radius-400)",
        full: "var(--sds-size-radius-full)",
      },
      // Font family
      fontFamily: {
        title: ["var(--sds-typography-title-hero-font-family)", "sans-serif"],
        subtitle: ["var(--sds-typography-subtitle-font-family)", "sans-serif"],
        body: ["var(--sds-typography-body-font-family)", "sans-serif"],
        heading: ["var(--sds-typography-heading-font-family)", "sans-serif"],
      },
      // Font size
      fontSize: {
        "title-hero": "var(--sds-typography-title-hero-size)",
        subtitle: "var(--sds-typography-subtitle-size-base)",
        "body-medium": "var(--sds-typography-body-size-medium)",
        "body-small": "var(--sds-typography-body-size-small)",
        heading: "var(--sds-typography-heading-size-base)",
      },
      // Font weight
      fontWeight: {
        "title-hero": "var(--sds-typography-title-hero-font-weight)",
        subtitle: "var(--sds-typography-subtitle-font-weight)",
        "body-regular": "var(--sds-typography-body-font-weight-regular)",
        "body-strong": "var(--sds-typography-body-font-weight-strong)",
        heading: "var(--sds-typography-heading-font-weight)",
      },
      // Border width
      borderWidth: {
        DEFAULT: "var(--sds-size-stroke-border)",
      },
      // Blur
      blur: {
        100: "var(--sds-size-blur-100)",
      },
      // Line height
      lineHeight: {
        body: "1.4",
        heading: "1.2",
        single: "1",
      },
    },
  },
  plugins: [],
};

export default config;
