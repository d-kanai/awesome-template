import path from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../features/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "!../features/**/figma_generated/**",
    "../app/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
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
