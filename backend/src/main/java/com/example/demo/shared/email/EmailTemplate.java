package com.example.demo.shared.email;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

/**
 * メールテンプレートの基底クラス.
 *
 * <p>HTMLテンプレートファイルを読み込み、変数を置換する共通処理を提供。 各メール定義クラスはこのクラスを継承して使用する。
 */
public abstract class EmailTemplate {

  private final String templateContent;

  /**
   * 同一パッケージ内のテンプレートファイルを読み込む.
   *
   * @param templateFileName テンプレートファイル名（例: "WelcomeEmailBody.html"）
   */
  protected EmailTemplate(final String templateFileName) {
    this.templateContent = loadTemplate(templateFileName);
  }

  /**
   * テンプレートに変数を埋め込んで本文を生成.
   *
   * @param variables 変数マップ（キー: ${変数名} の変数名部分）
   * @return 変数置換後の本文
   */
  protected String renderBody(final Map<String, Object> variables) {
    String result = templateContent;
    for (final Map.Entry<String, Object> entry : variables.entrySet()) {
      result = result.replace("${" + entry.getKey() + "}", String.valueOf(entry.getValue()));
    }
    return result;
  }

  private String loadTemplate(final String templateFileName) {
    try (InputStream is = getClass().getResourceAsStream(templateFileName)) {
      if (is == null) {
        throw new IllegalStateException("Template not found: " + templateFileName);
      }
      return new String(is.readAllBytes(), StandardCharsets.UTF_8);
    } catch (final IOException e) {
      throw new IllegalStateException("Failed to load template: " + templateFileName, e);
    }
  }
}
