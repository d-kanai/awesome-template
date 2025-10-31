global.IS_REACT_ACT_ENVIRONMENT = true;
global.IS_REACT_NATIVE_TEST_ENVIRONMENT = true;
global.__DEV__ = true;

global.performance = {
  now: Date.now,
};

global.requestAnimationFrame = (callback: (time: number) => void) =>
  setTimeout(() => callback(Date.now()), 0);

global.cancelAnimationFrame = (id: ReturnType<typeof setTimeout>) =>
  clearTimeout(id);

global.window = global;

// Minimal native bridge mocks required by React Native internals
// @ts-expect-error - expose bridge config for tests
global.__fbBatchedBridgeConfig = {
  remoteModuleConfig: [],
  localModules: [],
};
