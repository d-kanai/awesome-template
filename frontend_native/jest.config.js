const expoPreset = require("jest-expo/jest-preset");

module.exports = {
  ...expoPreset,
  setupFiles: ["<rootDir>/jest.env-setup.ts"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  moduleNameMapper: {
    ...expoPreset.moduleNameMapper,
    "^@/(.*)$": "<rootDir>/$1",
  },
  transformIgnorePatterns: [],
};
