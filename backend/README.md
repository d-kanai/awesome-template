# Backend

コーディング規約は [doc/code_rule.md](doc/code_rule.md) を参照。

## 技術スタック

### コア技術
- **言語・ランタイム**: Java 21
- **ビルドツール**: Gradle 8
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

### モジュラーモノリス + Domain First + DDD風レイヤードアーキテクチャ

Spring Modulithを使用してモジュール境界を強制。各モジュールは独立したドメインを表現。

### モジュール構成

```
features/
├── authadmin/      # Admin認証ドメイン
├── authcustomer/   # Customer認証ドメイン
├── user/           # ユーザードメイン
├── notification/   # 通知ドメイン
├── featureflag/    # 機能フラグドメイン
└── test/           # テストユーティリティ
```

### モジュール依存関係

```
┌───────────────────────────────────────────────────────┐
│              Feature Modules                          │
│  (authadmin, authcustomer, user, notification, etc.)  │
└───────────────┬───────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────┐
│              shared                                   │
│         (共通インフラ層)                                │
└───────────────────────────────────────────────────────┘
```

**依存ルール**:

| From | To | 許可 |
|------|-----|------|
| Feature Module | shared | ✅ |
| Feature Module | 他Feature Module (expose) | ✅ |
| shared | Feature Module | ❌ |

**expose パッケージ**:
- 他モジュールに公開するインターフェースは `expose/` パッケージに配置
- 他モジュールは `expose/` パッケージのみ参照可能

### ディレクトリ構造

featureモジュールは以下の構造を持つ。

```
features/{domain}/
├── db/
│   └── migration/              # Flywayマイグレーション
├── expose/                     # 他モジュール公開インターフェース
├── internal/                   # モジュール内部実装（外部アクセス禁止）
│   ├── domain/
│   │   ├── model/              # Entity, Aggregate
│   │   ├── repository/         # Repositoryインターフェース
│   │   ├── valueobject/        # ValueObject
│   │   └── event/              # DomainEvent
│   ├── application/
│   │   ├── {actor}/            # Actor別ユースケース
│   │   │   ├── command/        # 更新系
│   │   │   └── query/          # 参照系
│   │   └── command/, query/    # 共通ユースケース
│   ├── infrastructure/
│   │   └── repository/         # Repository実装
│   ├── presentation/
│   │   ├── rest/
│   │   │   ├── admin/          # Admin向けAPI (/admin/...)
│   │   │   └── customer/       # Customer向けAPI (/customer/...)
│   │   ├── job/                # バッチジョブ
│   │   └── consumer/           # Kafkaコンシューマ
└── package-info.java           # モジュール定義
```

**パッケージ構成**:
- `expose/`: 他モジュールに公開するインターフェース（@NamedInterface）
- `internal/`: モジュール内部実装（Spring Modulithが外部アクセスを禁止）
- `db/`: Flywayマイグレーションファイル

**Actor分離**:
- REST APIは `internal/presentation/rest/{actor}/` で分離
- ユースケースは `internal/application/{actor}/` で分離（必要な場合）

### DBマイグレーション

各モジュールが自身のテーブルを管理。マイグレーションファイルはタイムスタンプ形式で命名。

```
features/authadmin/db/migration/V20251207140309__create_admins_table.sql
features/user/db/migration/V20241128000000__create_users_table.sql
```

## OpenAPI

Actor別にAPI定義を分割して出力。

- **生成**: `./gradlew generateOpenApiDocs`
- **出力先**:
  - `openapi/customer-api.json` - Customer向けAPI (`/customer/**`)
  - `openapi/admin-api.json` - Admin向けAPI (`/admin/**`)
- **UIアクセス**: `http://localhost:8080/swagger-ui.html`
  - グループ選択で admin-api / customer-api を切り替え可能

## テスト戦略

- **TestA**: Controller in-out Test (内部クラス・DBモックなし、外部連携のみモック)
- **TestB**: Domain Model all patterns Test
