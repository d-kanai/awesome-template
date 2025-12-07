package com.example.demo.features.customer.user.internal.presentation.rest;

import static com.example.demo.shared.constants.ApiPath.CUSTOMER_USERS;

import com.example.demo.features.customer.user.internal.application.command.ChangePasswordCommand;
import com.example.demo.features.customer.user.internal.domain.model.User;
import com.example.demo.shared.security.customer.CustomerAuthContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "ユーザー", description = "ユーザー管理に関連する操作です")
@RestController
@RequestMapping(value = CUSTOMER_USERS, produces = MediaType.APPLICATION_JSON_VALUE)
public class ChangePasswordRestApi {

  private final ChangePasswordCommand changePasswordCommand;

  public ChangePasswordRestApi(final ChangePasswordCommand changePasswordCommand) {
    this.changePasswordCommand = changePasswordCommand;
  }

  @Operation(
      operationId = "changePassword",
      summary = "パスワード変更",
      description = "認証済みユーザーのパスワードを変更します")
  @ApiResponses({
    @ApiResponse(
        responseCode = "200",
        description = "パスワードの変更に成功しました",
        content = @Content(schema = @Schema(implementation = Output.class))),
    @ApiResponse(responseCode = "400", description = "リクエストが不正です", content = @Content),
    @ApiResponse(responseCode = "401", description = "認証が必要です", content = @Content)
  })
  @PutMapping(value = "/changePassword", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Output> execute(@Valid @RequestBody final Input input) {
    final var userId = CustomerAuthContext.getCurrentUserId();
    final ChangePasswordCommand.Output result =
        changePasswordCommand.execute(
            new ChangePasswordCommand.Input(userId, input.currentPassword(), input.newPassword()));
    return ResponseEntity.ok(Output.from(result));
  }

  @Schema(name = "ChangePasswordRequest", description = "パスワード変更リクエスト")
  public record Input(
      @NotBlank(message = "現在のパスワードは必須です")
          @Schema(description = "現在のパスワード", example = "currentPassword123")
          String currentPassword,
      @NotBlank(message = "新しいパスワードは必須です")
          @Schema(description = "新しいパスワード（8文字以上）", example = "newPassword456")
          String newPassword) {}

  @Schema(name = "ChangePasswordResponse", description = "パスワード変更レスポンス")
  public record Output(
      @Schema(description = "ユーザーID", type = "string", format = "uuid") UUID id,
      @Schema(description = "メールアドレス", example = "user@example.com") String email,
      @Schema(description = "更新日時", type = "string", format = "date-time")
          LocalDateTime updatedAt) {

    public static Output from(final ChangePasswordCommand.Output result) {
      final User user = result.user();
      return new Output(user.getId().getValue(), user.getEmail(), user.getUpdatedAt());
    }
  }
}
