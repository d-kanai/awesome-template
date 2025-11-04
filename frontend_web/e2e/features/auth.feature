Feature: 認証機能
  ユーザーがサインアップ、サインイン、サインアウトできること

  Scenario: 新規ユーザーのサインアップ
    Given サインアップページにアクセスする
    When メールアドレスに "test@example.com" を入力する
    And パスワードに "password123" を入力する
    And サインアップボタンをクリックする
    Then サインインページに遷移する

  Scenario: 既存ユーザーのサインイン
    Given サインインページにアクセスする
    When メールアドレスに "test@example.com" を入力する
    And パスワードに "password123" を入力する
    And サインインボタンをクリックする
    Then ユーザー画面に遷移する

  Scenario: 無効なメールアドレスでのサインイン失敗
    Given サインインページにアクセスする
    When メールアドレスに "invalid-email" を入力する
    And パスワードに "password123" を入力する
    Then バリデーションエラーが表示される
