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

### 2. 非同期通信（DomainEvent / CommandEvent）

他モジュールに**通知・依頼**する場合に使用。

| 種類 | 用途 | 購読者数 | Payload 定義者 | 命名 |
|------|------|----------|----------------|------|
| **DomainEvent** | 事実の通知（〜した） | 1:N（複数） | 発行側 | `XxxEvent` |
| **CommandEvent** | 処理の依頼（〜しろ） | 1:1（単一） | 受信側 | `XxxCommandEventInput` |

---

## DomainEvent vs CommandEvent

### 共通の EventMetadata

両方のイベントで共通のメタデータを使用:

```java
public record EventMetadata(UUID eventId, OffsetDateTime eventAt) {
  public static EventMetadata create() {
    return new EventMetadata(UUID.randomUUID(), AppClock.nowOffsetDateTime());
  }
}
```

---

### DomainEvent（ドメインイベント）

**「何が起きたか」という事実を通知**

```java
// 過去形で命名、発行側が Payload を定義
public record UserSignedUpEvent(EventMetadata metadata, UUID userId, String email)
    implements DomainEvent {

  public static UserSignedUpEvent of(UUID userId, String email) {
    return new UserSignedUpEvent(EventMetadata.create(), userId, email);
  }

  @Override
  public UUID eventId() { return metadata.eventId(); }

  @Override
  public OffsetDateTime eventAt() { return metadata.eventAt(); }

  @Override
  public DomainEventName domainEventName() { return UserEventEnum.USER_SIGNED_UP; }
}
```

**DomainEvent インターフェース**:
```java
public interface DomainEvent {
  UUID eventId();
  OffsetDateTime eventAt();
  DomainEventName domainEventName();
}
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

### CommandEvent（コマンドイベント）

**「何をしてほしいか」という指示を送信**

```java
// 受信側が Payload を定義、処理内容を表す名前
public record SendEmailCommandEventInput(
    EventMetadata metadata,
    UUID userId,
    List<String> to,
    String subject,
    String body,
    String emailType,
    ...)
    implements CommandEvent {

  public static SendEmailCommandEventInput of(...) {
    return new SendEmailCommandEventInput(EventMetadata.create(), ...);
  }

  @Override
  public UUID eventId() { return metadata.eventId(); }

  @Override
  public OffsetDateTime eventAt() { return metadata.eventAt(); }

  @Override
  public CommandEventName commandEventName() {
    return NotificationCommandEventEnum.SEND_EMAIL;
  }
}
```

**CommandEvent インターフェース**:
```java
public interface CommandEvent {
  UUID eventId();
  OffsetDateTime eventAt();
  CommandEventName commandEventName();
}
```

**特徴**:
- 実行者は1つのサービスのみ
- 処理に必要な情報をすべて含む
- インフラ系サービス向け
- 受信側モジュールの `expose/` に配置
  - 例: `com.example.demo.features.notification.expose.SendEmailCommandEventInput`

**購読者の例**:
- Notification Service（メール/SMS/Push送信）
- Payment Service（決済処理）
- Report Service（レポート生成）

---

## なぜ分けるのか？

### Notification Service の例

**NG: DomainEvent を購読する場合**

```
UserSignedUpEvent → Notification Service
OrderPlacedEvent  → Notification Service
PaymentFailedEvent → Notification Service

問題: Notification が各ドメインの文脈を知る必要がある
　　　→ 肥大化、密結合
```

**OK: CommandEvent を購読する場合**

```
User Module:
  1. UserSignedUpEvent を発行（内部/分析用）
  2. SendEmailCommandEventInput を発行（通知用、メール内容込み）

Notification Service:
  - SendEmailCommandEventInput だけを購読
  - 「送れ」と言われたら送る
  - ビジネスロジックを知らない
```

---

## 実装方法

### モジュラモノリス（現在）

**Spring ApplicationEvent を使用**

```java
// Publisher
@Service
public class SignupCommand {
  private final EventPublisher kafkaPublisher;
  private final EventPublisher springPublisher;

  @Transactional
  public void execute(Input input) {
    User user = User.signup(input.email(), input.password());
    userRepository.insert(user);

    // DomainEvent（分析・監査用）- Kafka + Spring Event 両方
    kafkaPublisher.publishAllDomainEvents(user.getDomainEvents());
    springPublisher.publishAllDomainEvents(user.getDomainEvents());

    // CommandEvent（通知用）- Kafka + Spring Event 両方
    SendEmailCommandEventInput emailCommand = welcomeEmail.create(user);
    kafkaPublisher.publishCommandEvent(emailCommand);
    springPublisher.publishCommandEvent(emailCommand);
  }
}

// DomainEvent Consumer（複数可）
@Component
public class AnalyticsDomainEventConsumer {
  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  public void consume(UserSignedUpEvent event) {
    // 分析データ記録
  }
}

// CommandEvent Consumer（単一）
@Component
public class SendEmailConsumer {
  @EventListener
  public void handle(SendEmailCommandEventInput command) {
    // メール送信
  }
}
```

---

### EventPublisher インターフェース

```java
public interface EventPublisher {
  void publishDomainEvent(DomainEvent event);
  void publishAllDomainEvents(List<DomainEvent> events);
  void publishCommandEvent(CommandEvent event);
}
```

実装:
- `SpringEventPublisher` - Spring ApplicationEvent を使用
- `KafkaEventPublisher` - Kafka を使用
- `NoOpEventPublisher` - Kafka 無効時のダミー実装

---

### マイクロサービス（将来）

**Kafka を使用**

```java
// Publisher
@Service
public class SignupCommand {
  private final KafkaTemplate<String, Object> kafka;

  public void execute(Input input) {
    // ... user 作成 ...

    // DomainEvent Topic（複数サービスが購読）
    kafka.send("demo.user.domain-event", UserSignedUpEvent.of(...));

    // CommandEvent Topic（Notification のみ購読）
    kafka.send("demo.notification.command-event.send-email", SendEmailCommandEventInput.of(...));
  }
}
```

**Consumer Group による制御**:

```java
// DomainEvent: サービスごとに別 Group（全員受信）
@KafkaListener(topics = "demo.user.domain-event", groupId = "analytics-service")
@KafkaListener(topics = "demo.user.domain-event", groupId = "audit-service")

// CommandEvent: 同一 Group（1つだけ処理）
@KafkaListener(topics = "demo.notification.command-event.send-email", groupId = "notification-service")
```

---

## Kafka Consumer Group

### 同じ Group = 負荷分散（1人だけ処理）

```
Topic: notification.command-event.send-email
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
Topic: user.domain-event
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
| モジュラモノリス、同一プロセス | Spring Event |
| メッセージを永続化したい | Kafka |
| 再起動後も処理を継続したい | Kafka |
| 複数インスタンス間で共有 | Kafka |
| 外部サービスとの連携 | Kafka |

**原則: YAGNI（必要になるまで Kafka は導入しない）**

---

## Idempotency（べき等性）

### なぜ必要か？

| 配信保証 | 説明 | Idempotency |
|----------|------|-------------|
| **At-most-once** | 最大1回（Spring Event） | 不要 |
| **At-least-once** | 最低1回（Kafka デフォルト） | **必要** |
| **Exactly-once** | 正確に1回 | 複雑、通常は At-least-once + Idempotency |

Kafka は再送の可能性があるため、同じメッセージが複数回届いても1回だけ処理する仕組みが必要。

---

### 実装パターン

**Advisory Lock + 履歴テーブル（PostgreSQL）**

```java
@Transactional
public void execute(Input input) {
    // 1. ロック取得（同時実行を直列化）
    advisoryLockService.acquireLock(input.userId() + ":" + input.eventType());

    // 2. 処理済みかチェック
    if (historyRepository.existsByUserIdAndEventType(input.userId(), input.eventType())) {
        log.info("Already processed: userId={}, eventType={}", input.userId(), input.eventType());
        return;
    }

    // 3. 処理実行
    doProcess(input);

    // 4. 履歴記録（成功後）
    historyRepository.insert(new History(input.userId(), input.eventType()));
}
```

**ポイント**:
- Lock → Check → Process → Record の順序が重要
- Advisory Lock はトランザクション終了時に自動解放
- 履歴記録は処理成功後（失敗時はロールバック）

---

### Spring Event vs Kafka の選択

| 項目 | Spring Event | Kafka |
|------|-------------|-------|
| 配信保証 | At-most-once | At-least-once |
| Idempotency | 不要 | 必要 |
| 永続化 | なし | あり |
| 再起動後 | 消失 | 継続 |
| 複数インスタンス | 同一プロセス内 | 分散 |

---

## まとめ

```
モジュラモノリス
├── データ取得: Public API（直接呼び出し）
├── 事実の通知: DomainEvent（Spring Event, 1:N）
├── 処理の依頼: CommandEvent（Spring Event, 1:1）
└── 将来: Kafka に置き換え可能な設計を維持

マイクロサービス
├── データ取得: HTTP/gRPC
├── 事実の通知: DomainEvent（Kafka, 複数 Consumer Group）
└── 処理の依頼: CommandEvent（Kafka, 単一 Consumer Group）
```

---

## ファイル配置

```
shared/event/
├── DomainEvent.java           # DomainEvent インターフェース
├── DomainEventName.java       # DomainEvent 名のインターフェース
├── CommandEvent.java          # CommandEvent インターフェース
├── CommandEventName.java      # CommandEvent 名のインターフェース
├── EventMetadata.java         # 共通メタデータ (eventId, eventAt)
├── EventPublisher.java        # Publisher インターフェース
└── SpringEventPublisher.java  # Spring Event 実装

features/user/internal/domain/event/
├── UserSignedUpEvent.java     # DomainEvent 実装
└── UserEventEnum.java         # DomainEventName 実装

features/notification/expose/
├── SendEmailCommandEventInput.java      # CommandEvent 実装
└── NotificationCommandEventEnum.java    # CommandEventName 実装
```
