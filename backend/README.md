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

### モジュラーモノリス + Multiアクター + DDD風レイヤードアーキテクチャ

Spring Modulithを使用してモジュール境界を強制。各モジュールは独立したドメインを表現。

### モジュール依存関係ルール

依存方向は**上から下への一方向のみ**許可。逆方向の依存は禁止。

```
┌─────────────────────────────────────────────────────────┐
│                   Actor Module                          │
│         (customer/auth, customer/user, admin/auth)      │
└───────┬─────────────────┬───────────────────┬───────────┘
        │                 │                   │
        ▼                 ▼                   │
┌───────────────┐ ┌───────────────────────┐   │
│  Actor Shared │ │    Shared Domain      │   │
│  (customer/   │ │ (notification,         │   │
│   shared,     │ │  featureflag)          │   │
│   admin/      │ └───────────┬───────────┘   │
│   shared)     │             │               │
└───────┬───────┘             │               │
        │                     │               │
        └──────────┬──────────┘               │
                   ▼                          ▼
              ┌────────────────────────────────┐
              │            shared              │
              │        (共通インフラ層)         │
              └────────────────────────────────┘
```

**依存ルール**:

| From | To | 許可 |
|------|-----|------|
| Actor Module | Shared Domain | ✅ |
| Actor Module | Actor Shared（同Actor） | ✅ |
| Actor Module | shared | ✅ |
| Actor Shared | shared | ✅ |
| Shared Domain | shared | ✅ |
| Shared Domain | Actor Module | ❌ |
| Shared Domain | Actor Shared | ❌ |
| Actor Shared | Actor Module | ❌ |
| Actor Module | 他Actor Module | ❌ |
| Actor Shared | 他Actor Shared | ❌ |
| shared | 上位モジュール | ❌ |

**具体例**:
- `customer/auth` → `customer/shared` ✅
- `customer/auth` → `featureflag/expose` ✅
- `customer/auth` → `shared` ✅
- `customer/auth` → `admin/auth` ❌（Actor間依存禁止）
- `customer/shared` → `admin/shared` ❌（Actor間依存禁止）
- `featureflag` → `customer/shared` ❌（循環依存防止）
- `notification` → `admin/auth` ❌（循環依存防止）

**expose パッケージ**:
- Shared Domain が外部に公開するインターフェースは `expose/` パッケージに配置
- Actor Module は Shared Domain の `expose/` パッケージのみ参照可能

### ディレクトリ構造

featureモジュールは以下の構造を持つ。

```
features/{actor}/{module}/
├── db/
│   └── migration/          # Flywayマイグレーション
├── doc/                    # PlantUML等のドキュメント
├── expose/                 # 他モジュール公開インターフェース
├── internal/
│   ├── application/
│   │   ├── command/        # 更新系ユースケース
│   │   └── query/          # 参照系ユースケース
│   ├── domain/
│   │   ├── model/          # Entity, Aggregate
│   │   ├── repository/     # Repositoryインターフェース
│   │   ├── valueobject/    # ValueObject
│   │   └── event/          # DomainEvent
│   ├── infrastructure/
│   │   └── repository/     # Repository実装
│   └── presentation/
│       ├── rest/           # REST API
│       ├── job/            # バッチジョブ
│       └── consumer/       # Kafkaコンシューマ
└── package-info.java       # モジュール定義
```

### Actor別構造

```
features/
├── customer/               # Customer向け機能
│   ├── auth/               # 認証 (signup, signin, me)
│   └── user/               # ユーザー管理
├── admin/                  # Admin向け機能
│   └── auth/               # Admin認証 (signin, me)
├── notification/           # 共通通知機能
└── test/                   # E2Eテスト支援
```

### DBマイグレーション

各モジュールが自身のテーブルを管理。マイグレーションファイルはタイムスタンプ形式で命名。

```
features/customer/user/db/migration/V20241128000000__create_users_table.sql
features/admin/auth/db/migration/V20241202120000__create_admins_table.sql
```

## OpenAPI

- **生成**: `./gradlew generateOpenApiDocs`
- **出力先**: `openapi/openapi.json`
- **UIアクセス**: `http://localhost:8080/swagger-ui.html`

## テスト戦略

- **TestA**: Controller in-out Test (内部クラス・DBモックなし、外部連携のみモック)
- **TestB**: Domain Model all patterns Test
