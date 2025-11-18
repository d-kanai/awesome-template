Feature: 認証機能
  ユーザーのサインアップ、サインイン

  Scenario: 新規ユーザーのサインアップ
    Given サインアップページにアクセス
    When サインアップページのメールアドレスに "newuser@example.com" を入力
    And サインアップページのパスワードに "password123" を入力
    And サインアップボタンをクリック
    Then サインインページに遷移

  Scenario: 既存ユーザーのサインイン
    Given サインインページにアクセス
    When サインインページのメールアドレスに "test@example.com" を入力
    And サインインページのパスワードに "TestPassword123" を入力
    And サインインボタンをクリック
    Then ユーザー画面に遷移

  Scenario: 無効なメールアドレスでのサインイン失敗
    Given サインインページにアクセス
    When サインインページのメールアドレスに "invalid-email" を入力
    And サインインページのパスワードに "password123" を入力
    Then バリデーションエラーを表示
