package com.example.demo.modules.auth.presentation.input;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(name = "SignupRequest", description = "新しいユーザーを登録するためのリクエストペイロードです")
public class SignupInput {
  @NotBlank(message = "メールアドレスは必須です")
  @Email(message = "有効なメールアドレスを入力してください")
  @Schema(description = "ユーザーのメールアドレス", example = "jane.doe@example.com")
  private String email;

  @NotBlank(message = "パスワードは必須です")
  @Schema(description = "ユーザーのパスワード", example = "SecurePassword123")
  private String password;

  public SignupInput() {}

  public SignupInput(final String email, final String password) {
    this.email = email;
    this.password = password;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(final String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(final String password) {
    this.password = password;
  }
}
