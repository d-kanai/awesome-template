package com.example.demo.features.customer.auth.internal.presentation.rest;

import static com.example.demo.shared.constants.ApiPath.CUSTOMER_AUTH;

import com.example.demo.features.customer.auth.internal.application.command.SigninCommand;
import com.example.demo.features.customer.user.internal.domain.model.User;
import com.example.demo.shared.config.AppProperties;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "認証", description = "ユーザー認証・登録に関連する操作です")
@RestController
@RequestMapping(value = CUSTOMER_AUTH, produces = MediaType.APPLICATION_JSON_VALUE)
public class SigninRestApi {

  private final SigninCommand signinCommand;
  private final AppProperties appProperties;

  public SigninRestApi(final SigninCommand signinCommand, final AppProperties appProperties) {
    this.signinCommand = signinCommand;
    this.appProperties = appProperties;
  }

  @Operation(operationId = "signin", summary = "サインイン", description = "メールアドレスとパスワードでサインインします。")
  @ApiResponses({
    @ApiResponse(
        responseCode = "200",
        description = "サインインに成功しました。",
        content =
            @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = Output.class))),
    @ApiResponse(
        responseCode = "400",
        description = "メールアドレスまたはパスワードが正しくありません。",
        content = @Content)
  })
  @PostMapping(value = "/signin", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Output> execute(
      @Valid @RequestBody final Input input, final HttpServletResponse response) {
    final SigninCommand.Output result =
        signinCommand.execute(new SigninCommand.Input(input.email(), input.password()));

    setAuthCookie(response, result.accessToken());

    return ResponseEntity.ok(Output.from(result));
  }

  private void setAuthCookie(final HttpServletResponse response, final String token) {
    final var cookieConfig = appProperties.getJwt().getCookie();
    final String sameSite = cookieConfig.getSameSite() != null ? cookieConfig.getSameSite() : "Lax";

    final ResponseCookie cookie =
        ResponseCookie.from(cookieConfig.getName(), token)
            .httpOnly(cookieConfig.isHttpOnly())
            .secure(cookieConfig.isSecure())
            .sameSite(sameSite)
            .maxAge(cookieConfig.getMaxAgeSeconds())
            .path("/")
            .build();

    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
  }

  @Schema(name = "SigninRequest", description = "ユーザーがサインインするためのリクエストペイロードです")
  public record Input(
      @NotBlank(message = "メールアドレスは必須です")
          @Email(message = "有効なメールアドレスを入力してください")
          @Schema(description = "ユーザーのメールアドレス", example = "jane.doe@example.com")
          String email,
      @NotBlank(message = "パスワードは必須です")
          @Schema(description = "ユーザーのパスワード", example = "SecurePassword123")
          String password) {}

  @Schema(name = "SigninResponse", description = "サインインしたユーザーを表します")
  public record Output(
      @Schema(description = "ユーザーの一意な識別子", type = "string", format = "uuid") UUID id,
      @Schema(description = "ユーザーのメールアドレス", example = "jane.doe@example.com") String email,
      @Schema(description = "JWT認証トークン", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
          String accessToken,
      @Schema(description = "ユーザーの作成日時", type = "string", format = "date-time")
          LocalDateTime createdAt,
      @Schema(description = "ユーザーの最終更新日時", type = "string", format = "date-time")
          LocalDateTime updatedAt) {

    public static Output from(final SigninCommand.Output result) {
      final User user = result.user();
      return new Output(
          user.getId().getValue(),
          user.getEmail(),
          result.accessToken(),
          user.getCreatedAt(),
          user.getUpdatedAt());
    }
  }
}
