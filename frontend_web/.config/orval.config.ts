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
	サインインリクエスト: "SigninRequest",
	サインインレスポンス: "SigninResponse",
};

export default defineConfig({
	// React Query Hooks用（Client Components用）
	awesomeTemplateHooks: {
		input: OPENAPI_SPEC_PATH,
		output: {
			target: "../features/shared/api/generated/hooks.ts",
			schemas: "../features/shared/api/generated/model",
			client: "react-query",
			httpClient: "fetch",
			clean: true,
			override: {
				mutator: {
					path: "../features/shared/api/fetcher.ts",
					name: "fetcher",
				},
			},
			// @ts-ignore - schemaNameは実行時に使用されるが型定義に含まれていない
			schemaName: (name: string) => schemaNameMap[name] ?? name,
		},
		hooks: {
			afterAllFilesWrite:
				"pnpm biome check --config-path .config/biome.json --write features/shared/api/generated",
		},
	},
	// Pure Functions用（Server Components/Server Actions用）
	awesomeTemplateFunctions: {
		input: OPENAPI_SPEC_PATH,
		output: {
			target: "../features/shared/api/generated/functions.ts",
			schemas: "../features/shared/api/generated/model",
			client: "fetch",
			httpClient: "fetch",
			clean: false, // hooks.tsと同じschema/modelを共有するためcleanしない
			override: {
				mutator: {
					path: "../features/shared/api/fetcher.ts",
					name: "fetcher",
				},
			},
			// @ts-ignore - schemaNameは実行時に使用されるが型定義に含まれていない
			schemaName: (name: string) => schemaNameMap[name] ?? name,
		},
	},
});
