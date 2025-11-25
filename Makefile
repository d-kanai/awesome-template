################################################################################
#
#  Awesome Template - Makefile
#
#  フロントエンドWeb開発用のコマンド集
#  使い方: make help でコマンド一覧を表示
#
################################################################################

SHELL := /bin/bash
ROOT_DIR := $(CURDIR)

.PHONY: help \
        install \
        web-install web-dev web-dev-mock web-build web-lint web-typecheck web-generate-api web-ut web-ut-coverage web-e2e web-e2e-mock web-podman-build web-podman-run \
        lefthook-install

################################################################################
# ヘルプ
################################################################################

help:
	@printf "\n"
	@printf "\033[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\033[0m\n"
	@printf "\033[1m  Awesome Template - 開発コマンド一覧\033[0m\n"
	@printf "\033[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\033[0m\n"
	@printf "\n"
	@printf "\033[1;32m【セットアップ】\033[0m\n"
	@printf "  make install              全体セットアップ（Lefthook + 依存関係）\n"
	@printf "  make lefthook-install     Git hooksをインストール\n"
	@printf "\n"
	@printf "\033[1;32m【開発サーバー】\033[0m\n"
	@printf "  make web-install          依存関係をインストール (pnpm install)\n"
	@printf "  make web-dev              開発サーバー起動 (localhost:3000)\n"
	@printf "  make web-dev-mock         モックAPIで開発サーバー起動\n"
	@printf "\n"
	@printf "\033[1;32m【ビルド】\033[0m\n"
	@printf "  make web-build            本番用ビルド\n"
	@printf "  make web-generate-api     APIクライアント生成 (orval)\n"
	@printf "\n"
	@printf "\033[1;32m【コード品質】\033[0m\n"
	@printf "  make web-lint             リント・フォーマットチェック (Biome)\n"
	@printf "  make web-typecheck        型チェック (TypeScript)\n"
	@printf "\n"
	@printf "\033[1;32m【テスト】\033[0m\n"
	@printf "  make web-ut               ユニットテスト (Vitest)\n"
	@printf "  make web-ut-coverage      ユニットテスト + カバレッジ\n"
	@printf "  make web-e2e              E2Eテスト (Playwright + Cucumber)\n"
	@printf "  make web-e2e-mock         モックAPIでE2Eテスト\n"
	@printf "\n"
	@printf "\033[1;32m【コンテナ】\033[0m\n"
	@printf "  make web-podman-build     コンテナイメージをビルド\n"
	@printf "  make web-podman-run       コンテナを起動 (localhost:3000)\n"
	@printf "\n"
	@printf "\033[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\033[0m\n"
	@printf "\n"

################################################################################
# セットアップ
################################################################################

# 全体セットアップ: Git hooksと依存関係をインストール
install: lefthook-install web-install
	@printf "\033[32m✓ セットアップ完了\033[0m\n"

# Git hooks (Lefthook) をインストール
# pre-commit: リント・フォーマット・型チェック
lefthook-install:
	@printf "\033[36mGit hooksをインストール中...\033[0m\n"
	@chmod +x tools/lefthook/lefthook tools/lefthook/run-hook.sh
	@mkdir -p .git/hooks
	@for hook in pre-commit prepare-commit-msg; do \
		cp tools/lefthook/run-hook.sh ".git/hooks/$$hook"; \
		chmod +x ".git/hooks/$$hook"; \
	done
	@printf "\033[32m✓ Git hooksインストール完了\033[0m\n"

################################################################################
# フロントエンドWeb - 開発
################################################################################

# 依存関係をインストール
web-install:
	@printf "\033[36m依存関係をインストール中...\033[0m\n"
	cd frontend_web && pnpm install

# 開発サーバー起動 (実APIに接続)
web-dev:
	@printf "\033[36m開発サーバーを起動中... (http://localhost:3000)\033[0m\n"
	cd frontend_web && pnpm dev

# 開発サーバー起動 (モックAPI)
web-dev-mock:
	@printf "\033[36m開発サーバーを起動中 (モックAPI)... (http://localhost:3000)\033[0m\n"
	cd frontend_web && pnpm dev:mock

################################################################################
# フロントエンドWeb - ビルド
################################################################################

# 本番用ビルド
web-build:
	@printf "\033[36m本番用ビルドを実行中...\033[0m\n"
	cd frontend_web && pnpm build

# APIクライアント生成 (OpenAPI → TypeScript)
web-generate-api:
	@printf "\033[36mAPIクライアントを生成中...\033[0m\n"
	cd frontend_web && pnpm generate:api

################################################################################
# フロントエンドWeb - コード品質
################################################################################

# リント・フォーマットチェック (Biome)
web-lint:
	@printf "\033[36mリント・フォーマットチェック中...\033[0m\n"
	cd frontend_web && pnpm lint

# 型チェック (TypeScript)
web-typecheck:
	@printf "\033[36m型チェック中...\033[0m\n"
	cd frontend_web && pnpm typecheck

################################################################################
# フロントエンドWeb - テスト
################################################################################

# ユニットテスト (Vitest)
web-ut:
	@printf "\033[36mユニットテストを実行中...\033[0m\n"
	cd frontend_web && pnpm test

# ユニットテスト + カバレッジレポート
web-ut-coverage:
	@printf "\033[36mユニットテスト (カバレッジ付き) を実行中...\033[0m\n"
	cd frontend_web && pnpm test:coverage

# E2Eテスト (Playwright + Cucumber)
web-e2e:
	@printf "\033[36mE2Eテストを実行中...\033[0m\n"
	cd frontend_web && pnpm test:e2e

# E2Eテスト (モックAPI)
web-e2e-mock:
	@printf "\033[36mE2Eテスト (モックAPI) を実行中...\033[0m\n"
	cd frontend_web && pnpm test:e2e:mock

################################################################################
# フロントエンドWeb - コンテナ
################################################################################

# コンテナイメージをビルド (Podman)
web-podman-build:
	@printf "\033[36mコンテナイメージをビルド中...\033[0m\n"
	cd frontend_web && pnpm podman:build

# コンテナを起動 (Podman)
web-podman-run:
	@printf "\033[36mコンテナを起動中... (http://localhost:3000)\033[0m\n"
	cd frontend_web && pnpm podman:run
