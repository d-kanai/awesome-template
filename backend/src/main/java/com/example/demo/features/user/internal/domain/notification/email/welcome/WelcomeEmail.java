package com.example.demo.features.user.internal.domain.notification.email.welcome;

import com.example.demo.features.notification.expose.SendEmailCommandEventInput;
import com.example.demo.features.user.internal.domain.model.User;
import com.example.demo.shared.email.EmailTemplate;
import java.util.Map;
import org.springframework.stereotype.Component;

/**
 * Welcome メール定義.
 *
 * <p>ユーザー登録完了時に送信されるメール。 メール内容（件名、本文テンプレート）をこのディレクトリに凝集。
 */
@Component
public class WelcomeEmail extends EmailTemplate {

  private static final String SUBJECT = "ようこそ！ご登録ありがとうございます";
  private static final String EMAIL_TYPE = "welcome_email";

  public WelcomeEmail() {
    super("WelcomeEmailBody.html");
  }

  /**
   * ユーザー情報から SendEmailCommandEventInput コマンドを生成.
   *
   * @param user 対象ユーザー
   * @return メール送信コマンド
   */
  public SendEmailCommandEventInput create(final User user) {
    final String body = renderBody(Map.of("email", user.getEmail()));
    return SendEmailCommandEventInput.of(
        user.getId().getValue(), user.getEmail(), SUBJECT, body, EMAIL_TYPE);
  }
}
