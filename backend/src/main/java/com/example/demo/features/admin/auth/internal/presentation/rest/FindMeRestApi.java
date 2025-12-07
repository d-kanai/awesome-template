package com.example.demo.features.admin.auth.internal.presentation.rest;

import static com.example.demo.shared.constants.ApiPath.ADMIN_AUTH;

import com.example.demo.features.admin.auth.internal.application.query.FindMeQuery;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Admin認証", description = "Admin認証に関連する操作です")
@RestController("adminFindMeRestApi")
@RequestMapping(value = ADMIN_AUTH, produces = MediaType.APPLICATION_JSON_VALUE)
@SecurityRequirement(name = "bearerAuth")
public class FindMeRestApi {

  private final FindMeQuery findMeQuery;

  public FindMeRestApi(final FindMeQuery findMeQuery) {
    this.findMeQuery = findMeQuery;
  }

  @Operation(operationId = "adminMe", summary = "現在のAdmin情報取得", description = "認証済みAdminの情報を取得します")
  @ApiResponses({
    @ApiResponse(
        responseCode = "200",
        description = "Admin情報の取得に成功しました",
        content = @Content(schema = @Schema(implementation = Output.class))),
    @ApiResponse(responseCode = "401", description = "認証が必要です", content = @Content)
  })
  @GetMapping("/me")
  public ResponseEntity<Output> execute() {
    final FindMeQuery.Output result = findMeQuery.execute();
    return ResponseEntity.ok(Output.from(result));
  }

  @Schema(name = "AdminFindMeResponse", description = "現在のAdmin情報レスポンス")
  public record Output(
      @Schema(description = "Admin ID", type = "string", format = "uuid") UUID id,
      @Schema(description = "メールアドレス", example = "admin@example.com") String email,
      @Schema(
              description = "有効な機能フラグ",
              type = "object",
              additionalProperties = Schema.AdditionalPropertiesValue.TRUE,
              example = "{\"showVersionInfo\": true}")
          Map<String, Boolean> featureFlags) {

    public static Output from(final FindMeQuery.Output result) {
      return new Output(result.adminId(), result.email(), result.featureFlags());
    }
  }
}
