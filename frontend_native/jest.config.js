const expoPreset = require("jest-expo/jest-preset");

module.exports = {
  ...expoPreset,
  setupFiles: ["<rootDir>/jest.env-setup.ts"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/features/**/*.{js,jsx,ts,tsx}",
    "!**/__tests__/**",
    "!**/?(*.)+(spec|test).[tj]s?(x)",
    "!<rootDir>/features/shared/api/**",
  ],
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["text", "lcov", "cobertura"],
  moduleNameMapper: {
    ...expoPreset.moduleNameMapper,
    "^@/(.*)$": "<rootDir>/$1",
  },
  transformIgnorePatterns: [],
  forceExit: true,
};
