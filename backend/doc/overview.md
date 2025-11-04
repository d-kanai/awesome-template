# Backend Overview

## 技術スタック

### コア技術
- **言語・ランタイム**: Java 21
- **ビルドツール**: Gradle 8.5
- **フレームワーク**: Spring Boot 3.2.0
  - Spring Web
  - Spring Security
  - Spring Boot Actuator

### データベース
- **本番環境**: ???
- **テスト環境**: H2 Database (in-memory)
- **ORM・クエリビルダー**: JOOQ
- **マイグレーション**: Flyway

### API設計
- **ドキュメント生成**: SpringDoc OpenAPI
- **認証**: JWT (JSON Web Token)

### 機能管理
- **フィーチャーフラグ**: Unleash

### テスティング
- **テストフレームワーク**: JUnit 5
- **カバレッジ**: JaCoCo

### コード品質
- **リンター**: Checkstyle (Google Java Style準拠)
  - メソッド30行以内
  - ローカル変数・パラメータは基本final宣言
- **フォーマッター**: Spotless (Google Java Format)
- **静的コード解析**: SonarQube
  - メソッド30行以内
  - 認知・循環複雑度15以内
  - deep nest 2以内

### エラーモニタリング
- **エラートラッキング**: Sentry

## アーキテクチャパターン

### DDD風レイヤードアーキテクチャ + モジュラーモノリス風dir structure

#### レイヤー構成

各モジュールは以下の4層で構成されます：

```
Presentation Layer (プレゼンテーション層)
    ↓
Application Layer (アプリケーション層)
    ↓
Domain Layer (ドメイン層)
    ↓
Infrastructure Layer (インフラストラクチャ層)
```

##### 1. Presentation Layer (`presentation/`)
- **責務**: HTTPリクエスト/レスポンスの処理、入力検証、OpenAPI定義
- **構成要素**:
  - `controller/`: REST APIエンドポイント
  - `input/`: リクエストDTO
  - `output/`: レスポンスDTO

##### 2. Application Layer (`application/`)
- **責務**: ユースケースの実装、トランザクション制御
- **構成要素**:
  - `command/`: 更新系処理（Create, Update, Delete）
  - `query/`: 参照系処理（Read）
- **原則**: 1クラス1publicメソッド（code_rule.mdに準拠）

##### 3. Domain Layer (`domain/`)
- **責務**: ビジネスロジック、ドメインルール、エンティティ
- **構成要素**:
  - `model/`: ドメインモデル（エンティティ）
  - `valueobject/`: 値オブジェクト
  - `repository/`: リポジトリインターフェース

##### 4. Infrastructure Layer (`infrastructure/`)
- **責務**: 外部システムとの接続、永続化の実装
- **構成要素**:
  - `persistence/`: リポジトリの実装（JOOQ使用）

#### モジュール構成

ドメインごとに独立したモジュールとして整理：

```
modules/
├── auth/          # 認証・認可
├── user/          # ユーザー管理
└── shared/        # 共通コンポーネント
```

## プロジェクト構造

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/example/demo/
│   │   │   ├── DemoApplication.java
│   │   │   ├── infrastructure/
│   │   │   │   └── jooq/           # JOOQ生成コード（Git管理）
│   │   │   └── modules/
│   │   │       ├── auth/
│   │   │       │   ├── application/
│   │   │       │   │   └── command/
│   │   │       │   ├── domain/
│   │   │       │   ├── infrastructure/
│   │   │       │   └── presentation/
│   │   │       │       ├── controller/
│   │   │       │       ├── input/
│   │   │       │       └── output/
│   │   │       ├── user/
│   │   │       │   └── (同様の構成)
│   │   │       └── shared/
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-test.yml
│   │       └── db/migration/       # Flywayマイグレーション
│   └── test/
│       └── java/com/example/demo/
│           ├── testsupport/
│           └── modules/
├── build.gradle
└── doc/
    ├── code_rule.md
    └── overview.md (本ドキュメント)
```

## 主要コンポーネント

### フィーチャーフラグ (Unleash)

- **用途**: デプロイとリリースの分離・機能の段階的リリースなど

### OpenAPI仕様

- **生成方法**: `./gradlew generateOpenApiDocs`
- **出力先**: `build/openapi/openapi.json`
- **UIアクセス**: `http://localhost:8080/swagger-ui.html`
- **クライアント生成**: フロントエンドで Orval により自動生成

## テスト戦略

- TestA: Controller in-out Test (内部クラス・DBモックなし、外部連携のみモック)
- TestB: Domain Model all patterns Test

## Done の定義

### コード品質
- メソッド30行以内
- ローカル変数・パラメータは基本final宣言
- 基本全ての変数にfinalを付ける
- 認知・循環複雑度15以内
- deep nest 2以内

### アーキテクチャ
- Application層のcommand/queryは1クラス1publicメソッド

### テスト
- テストメソッド名は日本語でテストの意図が明確な名前にする
- Given-When-Thenコメントを挿入してフェーズを見やすくする
- カバレッジ90%以上（対象外ファイルは都度追加）
  - 除外対象: JOOQ生成コード、DemoApplication
