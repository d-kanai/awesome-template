package com.example.demo.features.user.internal.presentation.rest.customer;

import static com.example.demo.features.user.internal.presentation.rest.customer.CustomerUserApiPath.BASE;

import com.example.demo.features.user.internal.application.query.FindMeQuery;
import com.example.demo.features.user.internal.domain.model.User;
import com.example.demo.shared.jwt.AuthPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "ユーザー", description = "ユーザー情報に関連する操作です")
@RestController
@RequestMapping(value = BASE, produces = MediaType.APPLICATION_JSON_VALUE)
public class FindMeRestApi {

  public static final String ENDPOINT = "/me";

  private final FindMeQuery findMeQuery;

  public FindMeRestApi(final FindMeQuery findMeQuery) {
    this.findMeQuery = findMeQuery;
  }

  @Operation(operationId = "findMe", summary = "現在のユーザー情報取得", description = "現在ログイン中のユーザー情報を取得します。")
  @ApiResponses({
    @ApiResponse(
        responseCode = "200",
        description = "ユーザー情報を返します。",
        content =
            @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = Output.class))),
    @ApiResponse(responseCode = "401", description = "認証が必要です。", content = @Content)
  })
  @GetMapping(ENDPOINT)
  public ResponseEntity<Output> execute(@AuthenticationPrincipal final AuthPrincipal principal) {
    final FindMeQuery.Output result = findMeQuery.execute(principal.userId(), principal.email());
    return ResponseEntity.ok(Output.from(result));
  }

  @Schema(name = "FindMeResponse", description = "現在のユーザー情報を表します")
  public record Output(
      @Schema(description = "ユーザーの一意な識別子", type = "string", format = "uuid") UUID id,
      @Schema(description = "ユーザーのメールアドレス", example = "jane.doe@example.com") String email,
      @Schema(description = "ユーザーの作成日時", type = "string", format = "date-time")
          LocalDateTime createdAt,
      @Schema(description = "ユーザーの最終更新日時", type = "string", format = "date-time")
          LocalDateTime updatedAt,
      @Schema(
              description = "有効な機能フラグ",
              type = "object",
              additionalProperties = Schema.AdditionalPropertiesValue.TRUE,
              example = "{\"showVersionInfo\": true}")
          Map<String, Boolean> featureFlags) {

    public static Output from(final FindMeQuery.Output result) {
      final User user = result.user();
      return new Output(
          user.getId().getValue(),
          user.getEmail(),
          user.getCreatedAt(),
          user.getUpdatedAt(),
          result.featureFlags());
    }
  }
}
