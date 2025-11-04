import { useFlag } from "@unleash/proxy-client-react";

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
    const flagName = "sample-feature";
    (useFlag as jest.Mock).mockReturnValue(true);

    // when
    const result = useFeatureFlag(flagName);

    // then
    expect(result).toBe(true);
    expect(useFlag).toHaveBeenCalledWith(flagName);
  });

  it("フィーチャーフラグが無効な場合_falseを返す", () => {
    // given
    const flagName = "disabled-feature";
    (useFlag as jest.Mock).mockReturnValue(false);

    // when
    const result = useFeatureFlag(flagName);

    // then
    expect(result).toBe(false);
    expect(useFlag).toHaveBeenCalledWith(flagName);
  });

  it("存在しないフィーチャーフラグの場合_falseを返す", () => {
    // given
    const flagName = "nonexistent-feature";
    (useFlag as jest.Mock).mockReturnValue(false);

    // when
    const result = useFeatureFlag(flagName);

    // then
    expect(result).toBe(false);
    expect(useFlag).toHaveBeenCalledWith(flagName);
  });
});
