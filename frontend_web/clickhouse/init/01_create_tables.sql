-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 📊 Application Logs Table
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Next.js (pino) のログを格納するテーブル

CREATE DATABASE IF NOT EXISTS logs;

CREATE TABLE IF NOT EXISTS logs.app_logs (
    -- 基本情報
    time DateTime DEFAULT now(),
    level String,
    pid UInt32,
    hostname String,

    -- リクエスト情報
    requestId String,
    userId String,
    sessionId String,

    -- ログタイプ別フィールド
    type String,                -- proxy, api_request_mock, click_event, etc.
    method String,
    path String,
    query String,
    status UInt16,
    duration String,

    -- クライアント情報
    userAgent String,
    ip String,

    -- クリックイベント用
    id String,                  -- element id
    label String,
    pathname String,
    timestamp String,

    -- その他 (JSON文字列で格納)
    raw String                  -- 元のJSON全体
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(time)
ORDER BY (time, type, requestId)
TTL time + INTERVAL 30 DAY;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 📈 Materialized Views (集計用)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- リクエスト数/分 集計
CREATE MATERIALIZED VIEW IF NOT EXISTS logs.requests_per_minute
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(minute)
ORDER BY (minute, type, path)
AS SELECT
    toStartOfMinute(time) AS minute,
    type,
    path,
    count() AS request_count,
    countIf(status >= 400) AS error_count
FROM logs.app_logs
WHERE type IN ('proxy', 'api_request_mock')
GROUP BY minute, type, path;
