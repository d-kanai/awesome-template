package com.example.demo.modules.user.presentation.input;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(name = "SignupRequest", description = "新しいユーザーを登録するためのリクエストペイロードです")
public class SignupInput {
  @NotBlank(message = "メールアドレスは必須です")
  @Email(message = "有効なメールアドレスを入力してください")
  @Schema(description = "ユーザーのメールアドレス", example = "jane.doe@example.com")
  private String email;

  @NotBlank(message = "名前は必須です")
  @Schema(description = "ユーザーの表示名", example = "Jane Doe")
  private String name;

  public SignupInput() {}

  public SignupInput(final String email, final String name) {
    this.email = email;
    this.name = name;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(final String email) {
    this.email = email;
  }

  public String getName() {
    return name;
  }

  public void setName(final String name) {
    this.name = name;
  }
}
