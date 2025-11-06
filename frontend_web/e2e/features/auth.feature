Feature: 認証機能
  ユーザーのサインアップ、サインイン、サインアウト

  Scenario: 新規ユーザーのサインアップ
    Given サインアップページにアクセス
    When メールアドレスに "newuser@example.com" を入力
    And パスワードに "password123" を入力
    And サインアップボタンをクリック
    Then サインインページに遷移

  Scenario: 既存ユーザーのサインイン
    Given サインインページにアクセス
    When メールアドレスに "test@example.com" を入力
    And パスワードに "TestPassword123" を入力
    And サインインボタンをクリック
    Then ユーザー画面に遷移

  Scenario: 無効なメールアドレスでのサインイン失敗
    Given サインインページにアクセス
    When メールアドレスに "invalid-email" を入力
    And パスワードに "password123" を入力
    Then バリデーションエラーを表示
