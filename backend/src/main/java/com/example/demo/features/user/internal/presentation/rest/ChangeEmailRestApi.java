package com.example.demo.features.user.internal.presentation.rest;

import com.example.demo.features.user.internal.application.command.ChangeEmailCommand;
import com.example.demo.features.user.internal.domain.model.User;
import com.example.demo.shared.jwt.JwtClaims;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "ユーザー", description = "ユーザー管理に関連する操作です")
@RestController
@RequestMapping(value = "/users", produces = MediaType.APPLICATION_JSON_VALUE)
public class ChangeEmailRestApi {

  private final ChangeEmailCommand changeEmailCommand;

  public ChangeEmailRestApi(final ChangeEmailCommand changeEmailCommand) {
    this.changeEmailCommand = changeEmailCommand;
  }

  @Operation(summary = "メールアドレス変更", description = "認証済みユーザーのメールアドレスを変更します")
  @ApiResponses({
    @ApiResponse(
        responseCode = "200",
        description = "メールアドレスの変更に成功しました",
        content = @Content(schema = @Schema(implementation = Output.class))),
    @ApiResponse(responseCode = "400", description = "リクエストが不正です", content = @Content),
    @ApiResponse(responseCode = "401", description = "認証が必要です", content = @Content)
  })
  @PutMapping(value = "/changeEmail", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Output> execute(@Valid @RequestBody final Input input) {
    final JwtClaims claims =
        (JwtClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    try {
      final ChangeEmailCommand.Output result =
          changeEmailCommand.execute(new ChangeEmailCommand.Input(claims.userId(), input.email()));
      return ResponseEntity.ok(Output.from(result));
    } catch (final IllegalArgumentException e) {
      return ResponseEntity.badRequest().build();
    }
  }

  @Schema(name = "ChangeEmailRequest", description = "メールアドレス変更リクエスト")
  public record Input(
      @NotBlank(message = "メールアドレスは必須です")
          @Email(message = "有効なメールアドレスを入力してください")
          @Schema(description = "新しいメールアドレス", example = "new.email@example.com")
          String email) {}

  @Schema(name = "ChangeEmailResponse", description = "メールアドレス変更レスポンス")
  public record Output(
      @Schema(description = "ユーザーID", type = "string", format = "uuid") UUID id,
      @Schema(description = "メールアドレス", example = "new.email@example.com") String email,
      @Schema(description = "更新日時", type = "string", format = "date-time")
          LocalDateTime updatedAt) {

    public static Output from(final ChangeEmailCommand.Output result) {
      final User user = result.user();
      return new Output(user.getId().getValue(), user.getEmail(), user.getUpdatedAt());
    }
  }
}
