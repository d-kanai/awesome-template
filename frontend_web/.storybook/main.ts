import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: [
    "../features/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "!../features/**/figma_generated/**",
    "../app/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    // @storybook/addon-essentials and @storybook/addon-interactions are now in core
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  async viteFinal(config) {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": path.resolve(__dirname, "../"),
      };
    }

    // Define process.env for browser
    if (config.define) {
      config.define = {
        ...config.define,
        "process.env": {},
      };
    } else {
      config.define = {
        "process.env": {},
      };
    }

    return config;
  },
};

export default config;
