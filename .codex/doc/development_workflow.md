開発プロセスは以下を遵守してください

### common

- コマンドはMakefileを確認して利用すること

### native E2E test

- E2EテストがFailした場合はbackend log, native log, screenshot全てを確認してからアクションを考えること
- E2Eテストの前提プロセスは make native-start, make backend-start-test を使うこと

### backend

- APIのIF定義(OPEN API定義)を変更した場合は make openapi-client で定義更新をすること
- 変更した場合はbackend-utを実行確認すること

### frontend-native

- 変更した場合はnative-utを実行確認すること
