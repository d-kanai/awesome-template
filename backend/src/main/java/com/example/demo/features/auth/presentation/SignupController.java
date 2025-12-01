package com.example.demo.features.auth.presentation;

import com.example.demo.features.auth.application.command.SignupCommand;
import com.example.demo.features.user.domain.model.User;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "認証", description = "ユーザー認証・登録に関連する操作です")
@RestController
@RequestMapping(value = "/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class SignupController {

  private final SignupCommand signupCommand;

  public SignupController(final SignupCommand signupCommand) {
    this.signupCommand = signupCommand;
  }

  @Operation(summary = "ユーザー登録", description = "指定した情報で新しいユーザーを登録します。")
  @ApiResponses({
    @ApiResponse(
        responseCode = "201",
        description = "ユーザーの登録に成功しました。",
        content =
            @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = Output.class))),
    @ApiResponse(responseCode = "400", description = "リクエストペイロードが不正です。", content = @Content)
  })
  @PostMapping(value = "/signup", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Output> execute(@Valid @RequestBody final Input input) {
    try {
      final SignupCommand.Output result =
          signupCommand.execute(new SignupCommand.Input(input.email(), input.password()));
      return ResponseEntity.status(HttpStatus.CREATED).body(Output.from(result));
    } catch (final IllegalArgumentException e) {
      return ResponseEntity.badRequest().build();
    }
  }

  @Schema(name = "SignupRequest", description = "新しいユーザーを登録するためのリクエストペイロードです")
  public record Input(
      @NotBlank(message = "メールアドレスは必須です")
          @Email(message = "有効なメールアドレスを入力してください")
          @Schema(description = "ユーザーのメールアドレス", example = "jane.doe@example.com")
          String email,
      @NotBlank(message = "パスワードは必須です")
          @Schema(description = "ユーザーのパスワード", example = "SecurePassword123")
          String password) {}

  @Schema(name = "SignupResponse", description = "新しく作成されたユーザーを表します")
  public record Output(
      @Schema(description = "ユーザーの一意な識別子", type = "string", format = "uuid") UUID id,
      @Schema(description = "ユーザーのメールアドレス", example = "jane.doe@example.com") String email,
      @Schema(description = "ユーザーの作成日時", type = "string", format = "date-time")
          LocalDateTime createdAt,
      @Schema(description = "ユーザーの最終更新日時", type = "string", format = "date-time")
          LocalDateTime updatedAt) {

    public static Output from(final SignupCommand.Output result) {
      final User user = result.user();
      return new Output(
          user.getId().getValue(), user.getEmail(), user.getCreatedAt(), user.getUpdatedAt());
    }
  }
}
