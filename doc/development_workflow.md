開発プロセスは以下を遵守してください
- コマンドはMakefileを確認して利用すること
- E2EテストがFailした場合はbackend log, native log, screenshot全てを確認してからアクションを考えること
- backend APIのIF定義(OPEN API定義)を変更した場合は make openapi-client で定義更新をすること
- backendを変更した場合はbackend-utを、nativeを変更した場合はnative-utを実行確認すること