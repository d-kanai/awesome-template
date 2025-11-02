package com.example.demo.modules.auth.presentation.output;

import com.example.demo.modules.user.domain.model.User;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.UUID;

@Schema(name = "SigninResponse", description = "サインインしたユーザーを表します")
public class SigninOutput {
  private final UUID id;
  private final String email;
  private final LocalDateTime createdAt;
  private final LocalDateTime updatedAt;

  public SigninOutput(
      final UUID id,
      final String email,
      final LocalDateTime createdAt,
      final LocalDateTime updatedAt) {
    this.id = id;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static SigninOutput from(final User user) {
    return new SigninOutput(
        user.getId().getValue(), user.getEmail(), user.getCreatedAt(), user.getUpdatedAt());
  }

  @Schema(description = "ユーザーの一意な識別子", type = "string", format = "uuid")
  public UUID getId() {
    return id;
  }

  @Schema(description = "ユーザーのメールアドレス", example = "jane.doe@example.com")
  public String getEmail() {
    return email;
  }

  @Schema(description = "ユーザーの作成日時", type = "string", format = "date-time")
  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  @Schema(description = "ユーザーの最終更新日時", type = "string", format = "date-time")
  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }
}
