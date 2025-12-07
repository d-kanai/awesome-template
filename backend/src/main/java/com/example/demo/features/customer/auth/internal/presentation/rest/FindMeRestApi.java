package com.example.demo.features.customer.auth.internal.presentation.rest;

import static com.example.demo.shared.constants.ApiPath.CUSTOMER_AUTH;

import com.example.demo.features.customer.auth.internal.application.query.FindMeQuery;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "認証", description = "ユーザー認証・登録に関連する操作です")
@RestController
@RequestMapping(value = CUSTOMER_AUTH, produces = MediaType.APPLICATION_JSON_VALUE)
public class FindMeRestApi {

  private final FindMeQuery findMeQuery;

  public FindMeRestApi(final FindMeQuery findMeQuery) {
    this.findMeQuery = findMeQuery;
  }

  @Operation(operationId = "me", summary = "認証済みユーザー情報取得", description = "現在認証されているユーザーの情報を取得します。")
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
    final FindMeQuery.Output result = findMeQuery.execute();
    return ResponseEntity.ok(Output.from(result));
  }

  @Schema(name = "MeResponse", description = "認証済みユーザーの情報を表します")
  public record Output(
      @Schema(description = "ユーザーの一意な識別子", type = "string", format = "uuid") UUID id,
      @Schema(description = "ユーザーのメールアドレス", example = "jane.doe@example.com") String email) {

    public static Output from(final FindMeQuery.Output result) {
      return new Output(result.userId(), result.email());
    }
  }
}
