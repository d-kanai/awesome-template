import { defineConfig } from "orval";

const OPENAPI_SPEC_PATH = "../backend/build/openapi/openapi.json";

const schemaNameMap: Record<string, string> = {
  "ID 検索レスポンス": "FindUserByIdResponse",
  メールアドレス検索レスポンス: "FindUserByEmailResponse",
  ユーザープロフィール更新リクエスト: "UpdateUserProfileRequest",
  ユーザープロフィール更新レスポンス: "UpdateUserProfileResponse",
  ユーザー一覧レスポンス: "FindAllUsersResponse",
  ユーザー一覧項目: "UserListItem",
  ユーザー登録リクエスト: "SignupRequest",
  ユーザー登録レスポンス: "SignupResponse",
};

export default defineConfig({
  awesomeTemplate: {
    input: OPENAPI_SPEC_PATH,
    output: {
      target: "./features/shared/api/generated/index.ts",
      schemas: "./features/shared/api/generated/model",
      client: "react-query",
      httpClient: "fetch",
      clean: true,
      override: {
        mutator: {
          path: "./features/shared/api/fetcher.ts",
          name: "fetcher",
        },
        schemaName: (name: string) => schemaNameMap[name] ?? name,
      },
    },
    reactQuery: {
      version: 5,
      queryKeyBuilderMode: "split",
    },
  },
});
