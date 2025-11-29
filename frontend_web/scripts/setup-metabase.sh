#!/bin/bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 📊 Metabase自動セットアップスクリプト
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

METABASE_URL="http://localhost:3001"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="Admin123!"

echo "⏳ Metabaseの起動を待機中..."
until curl -s "$METABASE_URL/api/health" | grep -q "ok"; do
  sleep 2
done
echo "✅ Metabase起動完了"

# セットアップトークン取得
echo "🔑 セットアップトークン取得中..."
SETUP_TOKEN=$(curl -s "$METABASE_URL/api/session/properties" | grep -o '"setup-token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$SETUP_TOKEN" ]; then
  echo "ℹ️  セットアップ済みです。ログインを試みます..."

  # ログイン
  SESSION=$(curl -s -X POST "$METABASE_URL/api/session" \
    -H "Content-Type: application/json" \
    -d "{\"username\": \"$ADMIN_EMAIL\", \"password\": \"$ADMIN_PASSWORD\"}" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

  if [ -z "$SESSION" ]; then
    echo "❌ ログイン失敗。手動でセットアップしてください。"
    exit 1
  fi
else
  echo "🚀 初期セットアップ実行中..."

  # 初期セットアップ
  RESPONSE=$(curl -s -X POST "$METABASE_URL/api/setup" \
    -H "Content-Type: application/json" \
    -d "{
      \"token\": \"$SETUP_TOKEN\",
      \"user\": {
        \"email\": \"$ADMIN_EMAIL\",
        \"password\": \"$ADMIN_PASSWORD\",
        \"first_name\": \"Admin\",
        \"last_name\": \"User\",
        \"site_name\": \"Awesome Template Analytics\"
      },
      \"prefs\": {
        \"site_name\": \"Awesome Template Analytics\",
        \"site_locale\": \"ja\",
        \"allow_tracking\": false
      }
    }")

  SESSION=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
  echo "✅ 初期セットアップ完了"
fi

echo "🔌 ClickHouse接続を追加中..."

# ClickHouse接続追加
curl -s -X POST "$METABASE_URL/api/database" \
  -H "Content-Type: application/json" \
  -H "X-Metabase-Session: $SESSION" \
  -d '{
    "engine": "clickhouse",
    "name": "ClickHouse Logs",
    "details": {
      "host": "clickhouse",
      "port": 8123,
      "dbname": "logs",
      "user": "default",
      "password": "clickhouse123",
      "ssl": false
    }
  }' > /dev/null

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ セットアップ完了!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Metabase: $METABASE_URL"
echo "👤 Email: $ADMIN_EMAIL"
echo "🔑 Password: $ADMIN_PASSWORD"
echo ""
