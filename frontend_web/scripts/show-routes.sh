#!/bin/bash
# 画面遷移の一覧を出力するスクリプト

echo "画面遷移一覧"
echo ""

grep -rn "router\.push\|redirect(" --include="*.tsx" --include="*.ts" features app 2>/dev/null \
  | grep -v node_modules \
  | grep -v ".spec." \
  | grep -v ".test." \
  | sed 's/:/ → /' \
  | sort

echo ""