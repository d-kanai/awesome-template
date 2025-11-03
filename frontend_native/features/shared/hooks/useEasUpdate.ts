import * as Updates from "expo-updates";
import { useCallback, useEffect, useState } from "react";
import { Alert, AppState, type AppStateStatus } from "react-native";

interface UpdateState {
  isChecking: boolean;
  isDownloading: boolean;
}

export function useEasUpdate() {
  const [state, setState] = useState<UpdateState>({
    isChecking: false,
    isDownloading: false,
  });

  const checkForUpdate = useCallback(async () => {
    // 開発モードではスキップ
    if (__DEV__) {
      console.log("[EAS Update] Skipping update check in development mode");
      return;
    }

    try {
      setState((prev) => ({ ...prev, isChecking: true }));
      console.log("[EAS Update] Checking for updates...");

      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        console.log("[EAS Update] Update available, prompting user");

        Alert.alert(
          "アップデート利用可能",
          "新しいバージョンをダウンロードして再起動します。",
          [
            {
              text: "OK",
              onPress: async () => {
                try {
                  setState((prev) => ({ ...prev, isDownloading: true }));
                  console.log("[EAS Update] Downloading update...");

                  await Updates.fetchUpdateAsync();
                  console.log("[EAS Update] Download complete, reloading...");

                  await Updates.reloadAsync();
                } catch (error) {
                  console.error("[EAS Update] Download failed:", error);
                  Alert.alert(
                    "エラー",
                    "アップデートのダウンロードに失敗しました。",
                  );
                } finally {
                  setState((prev) => ({ ...prev, isDownloading: false }));
                }
              },
            },
          ],
        );
      } else {
        console.log("[EAS Update] No updates available");
      }
    } catch (error) {
      console.error("[EAS Update] Check failed:", error);
    } finally {
      setState((prev) => ({ ...prev, isChecking: false }));
    }
  }, []);

  useEffect(() => {
    // アプリ起動時にチェック
    checkForUpdate();

    // フォアグラウンドに戻った時にチェック
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          checkForUpdate();
        }
      },
    );

    return () => subscription?.remove();
  }, [checkForUpdate]);

  return {
    ...state,
    checkForUpdate,
  };
}
