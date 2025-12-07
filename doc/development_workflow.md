開発プロセスは以下を遵守してください

### common

- コマンドはMakefileを確認して利用すること
- commitは可能な限り細かく実施すること
- lefthookによるcommit hookが動いていることは常に確認し、無視せず、fixしてから進むこと

### native E2E test

- E2EテストがFailした場合はbackend log, native log, screenshot全てを確認してからアクションを考えること
- E2Eテストの前提プロセスは make native-start, make backend-start-test を使うこと

### backend

- APIのIF定義(OPEN API定義)を変更した場合は make openapi-client で定義更新をすること
- 変更した場合はbackend-utを実行確認すること
- Command/Query/Consumerを追加・変更した場合は対応するシーケンス図(puml)を更新すること
  - 配置場所: `features/{module}/doc/{feature}-sequence.puml`
  - ルール: `backend/doc/puml_rule.md` を参照

### frontend-native

- 変更した場合はnative-utを実行確認すること