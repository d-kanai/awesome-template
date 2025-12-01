# Backend

コーディング規約は [doc/code_rule.md](doc/code_rule.md) を参照。

## 技術スタック

### コア技術
- **言語・ランタイム**: Java 25
- **ビルドツール**: Gradle 8.x
- **フレームワーク**: Spring Boot 4.0
  - Spring Web
  - Spring Security
  - Spring Boot Actuator
  - Spring Modulith

### データベース
- **本番環境**: PostgreSQL
- **テスト環境**: H2 Database (in-memory)
- **クエリビルダー**: jOOQ
- **マイグレーション**: Flyway

### API設計
- **ドキュメント生成**: SpringDoc OpenAPI
- **認証**: JWT (JSON Web Token)

### テスティング
- **テストフレームワーク**: JUnit 5
- **カバレッジ**: JaCoCo

### コード品質
- **リンター**: Checkstyle (Google Java Style準拠)
- **フォーマッター**: Spotless (Google Java Format)

## アーキテクチャ

### モジュラーモノリス + DDD風レイヤードアーキテクチャ

Spring Modulithを使用してモジュール境界を強制。各モジュールは独立したドメインを表現。

> **Note**: 将来に備えて `public/` と `internal/` を分離しているが、現時点では `internal` 同士のアクセスを許容している（`ApplicationModule.Type.OPEN`）。システムが大きくなったら `internal` の公開をやめて整理する。

```
com.example.demo/
├── features/           # 機能モジュール群
│   ├── auth/          # 認証モジュール
│   ├── user/          # ユーザーモジュール
│   └── test/          # E2Eテスト支援モジュール
└── shared/            # 共通コンポーネント（他モジュールに依存しない）
```

### モジュール依存ルール

- `shared` は他のモジュールに依存してはならない
- 各 feature モジュールは `shared` と許可されたモジュールのみに依存可能
- モジュール間の依存は `package-info.java` で明示的に宣言

```java
@ApplicationModule(
    type = ApplicationModule.Type.OPEN,
    allowedDependencies = {"shared", "features.user"})
package com.example.demo.features.auth;
```

### 各モジュールのレイヤー構成

```
features/xxx/
├── package-info.java      # モジュール設定
├── XxxApi.java           # 公開API（他モジュールから参照可能）
└── internal/             # 内部実装（他モジュールからアクセス不可）
    ├── application/
    │   ├── command/      # 更新系ユースケース
    │   └── query/        # 参照系ユースケース
    ├── domain/
    │   ├── model/        # ドメインモデル
    │   ├── valueobject/  # 値オブジェクト
    │   └── repository/   # リポジトリインターフェース
    ├── infrastructure/
    │   └── repository/   # リポジトリ実装
    └── presentation/
        ├── rest/         # REST API
        └── job/          # バッチ処理
```

### モジュール境界の検証

`ModularityTest` で以下を自動検証：
- モジュール間の不正な依存
- 循環依存の検出
- `internal` パッケージへの外部アクセス
- `shared` が他モジュールに依存していないこと

## プロジェクト構造

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/example/demo/
│   │   │   ├── DemoApplication.java
│   │   │   ├── features/
│   │   │   │   └── user/
│   │   │   │       └── db/migration/  # モジュールごとのマイグレーション
│   │   │   └── shared/
│   │   │       └── jooq/              # jOOQ生成コード（Git管理）
│   │   └── resources/
│   └── test/
│       └── java/com/example/demo/
│           ├── ModularityTest.java
│           ├── testsupport/
│           │   └── databuilder/
│           └── features/
├── build.gradle
├── doc/
│   └── code_rule.md
└── README.md
```

### DBマイグレーション

各モジュールが自身のテーブルを管理。マイグレーションファイルはタイムスタンプ形式で命名。

```
features/user/db/migration/V20241128000000__create_users_table.sql
features/auth/db/migration/V20241202120000__create_sessions_table.sql
```

## OpenAPI

- **生成**: `./gradlew generateOpenApiDocs`
- **出力先**: `openapi/openapi.json`
- **UIアクセス**: `http://localhost:8080/swagger-ui.html`

## テスト戦略

- **TestA**: Controller in-out Test (内部クラス・DBモックなし、外部連携のみモック)
- **TestB**: Domain Model all patterns Test
