package com.example.demo.modules.auth.presentation.output;

import com.example.demo.modules.shared.jwt.JwtClaims;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

@Schema(name = "MeResponse", description = "認証済みユーザーの情報を表します")
public class MeOutput {
  private final UUID id;
  private final String email;

  public MeOutput(final UUID id, final String email) {
    this.id = id;
    this.email = email;
  }

  /**
   * Create MeOutput from JwtClaims (without DB query).
   *
   * @param claims JWT claims containing user information
   * @return MeOutput with id and email from claims
   */
  public static MeOutput from(final JwtClaims claims) {
    return new MeOutput(UUID.fromString(claims.userId()), claims.email());
  }

  @Schema(description = "ユーザーの一意な識別子", type = "string", format = "uuid")
  public UUID getId() {
    return id;
  }

  @Schema(description = "ユーザーのメールアドレス", example = "jane.doe@example.com")
  public String getEmail() {
    return email;
  }
}
