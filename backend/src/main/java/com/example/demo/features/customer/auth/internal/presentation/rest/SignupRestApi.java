package com.example.demo.features.customer.auth.internal.presentation.rest;

import static com.example.demo.features.customer.auth.internal.presentation.rest.CustomerAuthApiPath.BASE;

import com.example.demo.features.customer.auth.internal.application.command.SignupCommand;
import com.example.demo.features.customer.user.expose.ExposedUser;
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
@RequestMapping(value = BASE, produces = MediaType.APPLICATION_JSON_VALUE)
public class SignupRestApi {

  public static final String ENDPOINT = "/signup";

  private final SignupCommand signupCommand;

  public SignupRestApi(final SignupCommand signupCommand) {
    this.signupCommand = signupCommand;
  }

  @Operation(operationId = "signup", summary = "ユーザー登録", description = "指定した情報で新しいユーザーを登録します。")
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
  @PostMapping(value = ENDPOINT, consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Output> execute(@Valid @RequestBody final Input input) {
    final SignupCommand.Output result =
        signupCommand.execute(new SignupCommand.Input(input.email(), input.password()));
    return ResponseEntity.status(HttpStatus.CREATED).body(Output.from(result));
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
          LocalDateTime updatedAt,
      @Schema(description = "外部API検証結果 (検証済みかどうか)") Boolean verified,
      @Schema(description = "外部API検証ID") String verificationId,
      @Schema(description = "外部API検証メッセージ") String verificationMessage) {

    public static Output from(final SignupCommand.Output result) {
      final ExposedUser user = result.user();
      return new Output(
          user.id(),
          user.email(),
          user.createdAt(),
          user.updatedAt(),
          result.verificationResult().verified(),
          result.verificationResult().verificationId(),
          result.verificationResult().message());
    }
  }
}
