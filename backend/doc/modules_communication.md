# モジュール間通信ガイド

## 概要

モジュラモノリスにおけるモジュール間通信のパターンと、マイクロサービスへの移行を見据えた設計指針。

---

## 通信パターンの種類

### 1. 同期通信（Public API 経由）

他モジュールのデータを**取得**する場合に使用。

```java
// user module の public API
public interface UserApi {
  UserDto findById(UUID userId);
}

// 他モジュールから利用
@Service
public class OrderService {
  private final UserApi userApi;

  public void createOrder(UUID userId) {
    UserDto user = userApi.findById(userId);  // 直接呼び出し
  }
}
```

**マイクロサービス移行時**: HTTP/gRPC 呼び出しに置き換え

---

### 2. 非同期通信（Event / Command）

他モジュールに**通知・依頼**する場合に使用。

| 種類 | 用途 | 購読者数 | 命名 |
|------|------|----------|------|
| **Domain Event** | 事実の通知 | 1:N（複数） | 過去形（〜した） |
| **Command** | 処理の依頼 | 1:1（単一） | 命令形（〜しろ） |

---

## Domain Event vs Command

### Domain Event（ドメインイベント）

**「何が起きたか」という事実を通知**

```java
// 過去形で命名
public record UserSignedUpEvent(UUID userId, String email, OffsetDateTime occurredAt) {}
public record OrderPlacedEvent(UUID orderId, BigDecimal amount) {}
public record PaymentCompletedEvent(UUID paymentId) {}
```

**特徴**:
- Publisher は誰が購読するか知らない（疎結合）
- 複数のサービスが購読可能
- ビジネスドメインの文脈を持つ

**購読者の例**:
- Analytics Service（分析）
- Audit Service（監査ログ）
- Recommendation Service（レコメンド更新）

---

### Command（コマンド）

**「何をしてほしいか」という指示を送信**

```java
// 命令形で命名
public record SendEmailCommand(String to, String subject, String body) {}
public record ProcessPaymentCommand(UUID orderId, BigDecimal amount) {}
public record GenerateReportCommand(UUID reportId, ReportType type) {}
```

**特徴**:
- 実行者は1つのサービスのみ
- 処理に必要な情報をすべて含む
- インフラ系サービス向け

**購読者の例**:
- Notification Service（メール/SMS/Push送信）
- Payment Service（決済処理）
- Report Service（レポート生成）

---

## なぜ分けるのか？

### Notification Service の例

**NG: Domain Event を購読する場合**

```
UserSignedUpEvent → Notification Service
OrderPlacedEvent  → Notification Service
PaymentFailedEvent → Notification Service

問題: Notification が各ドメインの文脈を知る必要がある
　　　→ 肥大化、密結合
```

**OK: Command を購読する場合**

```
User Module:
  1. UserSignedUpEvent を発行（内部/分析用）
  2. SendEmailCommand を発行（通知用、メール内容込み）

Notification Service:
  - SendEmailCommand だけを購読
  - 「送れ」と言われたら送る
  - ビジネスロジックを知らない
```

---

## 実装方法

### モジュラモノリス（現在）

**Spring ApplicationEvent + @Async を使用**

```java
// Publisher
@Service
public class SignupCommand {
  private final ApplicationEventPublisher publisher;

  @Transactional
  public void execute(SignupInput input) {
    User user = User.signup(input.email(), input.password());
    userRepository.insert(user);

    // Domain Event（分析・監査用）
    publisher.publishEvent(UserSignedUpEvent.of(user.getId(), user.getEmail()));

    // Command（通知用）
    publisher.publishEvent(new SendEmailCommand(
        user.getEmail(),
        "ようこそ",
        "ご登録ありがとうございます..."
    ));
  }
}

// Event Consumer（複数可）
@Component
public class AnalyticsEventHandler {
  @Async
  @EventListener
  public void handle(UserSignedUpEvent event) {
    // 分析データ記録
  }
}

// Command Consumer（単一）
@Component
public class EmailCommandHandler {
  @Async
  @EventListener
  public void handle(SendEmailCommand command) {
    // メール送信
  }
}
```

---

### マイクロサービス（将来）

**Kafka を使用**

```java
// Publisher
@Service
public class SignupCommand {
  private final KafkaTemplate<String, Object> kafka;

  public void execute(SignupInput input) {
    // ... user 作成 ...

    // Domain Event Topic（複数サービスが購読）
    kafka.send("demo.user.events", UserSignedUpEvent.of(...));

    // Command Topic（Notification のみ購読）
    kafka.send("demo.notification.commands", new SendEmailCommand(...));
  }
}
```

**Consumer Group による制御**:

```java
// Domain Event: サービスごとに別 Group（全員受信）
@KafkaListener(topics = "demo.user.events", groupId = "analytics-service")
@KafkaListener(topics = "demo.user.events", groupId = "audit-service")

// Command: 同一 Group（1つだけ処理）
@KafkaListener(topics = "demo.notification.commands", groupId = "notification-service")
```

---

## Kafka Consumer Group

### 同じ Group = 負荷分散（1人だけ処理）

```
Topic: notification.commands
     │
     ▼
┌─────────────────────────────────┐
│ Group: "notification-service"   │
│   ├─ instance 1 ← 処理          │
│   ├─ instance 2                 │
│   └─ instance 3                 │
└─────────────────────────────────┘
※ 3インスタンス中1つだけが処理
```

### 違う Group = ブロードキャスト（全員処理）

```
Topic: user.events
     │
     ├──→ Group: "analytics"  → 受信
     ├──→ Group: "audit"      → 受信
     └──→ Group: "marketing"  → 受信
※ 全サービスが同じメッセージを受信
```

---

## 技術選択の指針

| 状況 | 推奨 |
|------|------|
| モジュラモノリス、同一プロセス | Spring Event + @Async |
| メッセージを永続化したい | Kafka |
| 再起動後も処理を継続したい | Kafka |
| 複数インスタンス間で共有 | Kafka |
| 外部サービスとの連携 | Kafka |

**原則: YAGNI（必要になるまで Kafka は導入しない）**

---

## まとめ

```
モジュラモノリス
├── データ取得: Public API（直接呼び出し）
├── 事実の通知: Domain Event（Spring Event, 1:N）
├── 処理の依頼: Command（Spring Event, 1:1）
└── 将来: Kafka に置き換え可能な設計を維持

マイクロサービス
├── データ取得: HTTP/gRPC
├── 事実の通知: Domain Event（Kafka, 複数 Consumer Group）
└── 処理の依頼: Command（Kafka, 単一 Consumer Group）
```
