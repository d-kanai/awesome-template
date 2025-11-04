import { useFlag } from "@unleash/proxy-client-react";

import { FEATURE_FLAGS } from "../../constants/featureFlags";
import { useFeatureFlag } from "../useFeatureFlag";

// Unleash SDKをモック化
jest.mock("@unleash/proxy-client-react", () => ({
  useFlag: jest.fn(),
}));

describe("useFeatureFlag", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("フィーチャーフラグが有効な場合_trueを返す", () => {
    // given
    const flagName = FEATURE_FLAGS.SHOW_VERSION_INFO;
    (useFlag as jest.Mock).mockReturnValue(true);

    // when
    const result = useFeatureFlag(flagName);

    // then
    expect(result).toBe(true);
    expect(useFlag).toHaveBeenCalledWith(flagName);
  });

  it("フィーチャーフラグが無効な場合_falseを返す", () => {
    // given
    const flagName = FEATURE_FLAGS.SHOW_VERSION_INFO;
    (useFlag as jest.Mock).mockReturnValue(false);

    // when
    const result = useFeatureFlag(flagName);

    // then
    expect(result).toBe(false);
    expect(useFlag).toHaveBeenCalledWith(flagName);
  });
});
