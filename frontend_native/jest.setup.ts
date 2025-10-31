import "react-native/jest/setup.js";
import "jest-expo/src/preset/setup";
import "@testing-library/jest-native/extend-expect";
import type { ReactNode } from "react";

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock("react-native-safe-area-context", () => {
  const React = require("react");

  return {
    SafeAreaView: ({ children }: { children?: ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    SafeAreaProvider: ({ children }: { children?: ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});
