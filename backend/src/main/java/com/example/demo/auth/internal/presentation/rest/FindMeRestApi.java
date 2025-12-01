package com.example.demo.auth.internal.presentation.rest;

import com.example.demo.shared.jwt.JwtClaims;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "認証", description = "ユーザー認証・登録に関連する操作です")
@RestController
@RequestMapping(value = "/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class FindMeRestApi {

  @Operation(summary = "認証済みユーザー情報取得", description = "現在認証されているユーザーの情報を取得します。")
  @ApiResponses({
    @ApiResponse(
        responseCode = "200",
        description = "ユーザー情報の取得に成功しました。",
        content =
            @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = Output.class))),
    @ApiResponse(responseCode = "401", description = "認証されていません。", content = @Content)
  })
  @GetMapping(value = "/me")
  public ResponseEntity<Output> execute() {
    final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    final JwtClaims claims = (JwtClaims) authentication.getPrincipal();
    return ResponseEntity.ok(Output.from(claims));
  }

  @Schema(name = "MeResponse", description = "認証済みユーザーの情報を表します")
  public record Output(
      @Schema(description = "ユーザーの一意な識別子", type = "string", format = "uuid") UUID id,
      @Schema(description = "ユーザーのメールアドレス", example = "jane.doe@example.com") String email) {

    public static Output from(final JwtClaims claims) {
      return new Output(UUID.fromString(claims.userId()), claims.email());
    }
  }
}
