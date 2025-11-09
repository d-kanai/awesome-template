import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./.config/vitest.setup.ts"],
    include: ["**/*.spec.{ts,tsx}"],
    exclude: [
      "node_modules",
      ".next",
      "out",
      "coverage",
      "features/shared/api/generated/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: ["features/**/*.{ts,tsx}"],
      exclude: [
        "features/shared/api/generated/**",
        "features/shared/figma_generated/**",
        "**/*.spec.{ts,tsx}",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../"),
    },
  },
});
