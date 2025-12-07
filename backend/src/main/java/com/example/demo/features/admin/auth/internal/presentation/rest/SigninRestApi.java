package com.example.demo.features.admin.auth.internal.presentation.rest;

import static com.example.demo.shared.constants.ApiPath.ADMIN_AUTH;

import com.example.demo.features.admin.auth.internal.application.command.SigninCommand;
import com.example.demo.features.admin.auth.internal.domain.model.Admin;
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

@Tag(name = "Admin認証", description = "Admin認証に関連する操作です")
@RestController("adminSigninRestApi")
@RequestMapping(value = ADMIN_AUTH, produces = MediaType.APPLICATION_JSON_VALUE)
public class SigninRestApi {

  private static final String ADMIN_COOKIE_NAME = "adminAccessToken";

  private final SigninCommand signinCommand;
  private final AppProperties appProperties;

  public SigninRestApi(final SigninCommand signinCommand, final AppProperties appProperties) {
    this.signinCommand = signinCommand;
    this.appProperties = appProperties;
  }

  @Operation(
      operationId = "adminSignin",
      summary = "Adminサインイン",
      description = "Admin管理者としてサインインします")
  @ApiResponses({
    @ApiResponse(
        responseCode = "200",
        description = "サインインに成功しました",
        content = @Content(schema = @Schema(implementation = Output.class))),
    @ApiResponse(responseCode = "400", description = "リクエストが不正です", content = @Content),
    @ApiResponse(responseCode = "401", description = "認証に失敗しました", content = @Content)
  })
  @PostMapping(value = "/signin", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Output> execute(
      @Valid @RequestBody final Input input, final HttpServletResponse response) {
    final SigninCommand.Output result =
        signinCommand.execute(new SigninCommand.Input(input.email(), input.password()));

    // Set httpOnly cookie for admin
    setAdminAuthCookie(response, result.accessToken());

    return ResponseEntity.ok(Output.from(result.admin(), result.accessToken()));
  }

  private void setAdminAuthCookie(final HttpServletResponse response, final String token) {
    final var cookieConfig = appProperties.getJwt().getCookie();
    final String sameSite = cookieConfig.getSameSite() != null ? cookieConfig.getSameSite() : "Lax";

    final ResponseCookie cookie =
        ResponseCookie.from(ADMIN_COOKIE_NAME, token)
            .httpOnly(cookieConfig.isHttpOnly())
            .secure(cookieConfig.isSecure())
            .sameSite(sameSite)
            .maxAge(cookieConfig.getMaxAgeSeconds())
            .path("/")
            .build();

    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
  }

  @Schema(name = "AdminSigninRequest", description = "Adminサインインリクエスト")
  public record Input(
      @NotBlank(message = "メールアドレスは必須です")
          @Email(message = "有効なメールアドレスを入力してください")
          @Schema(description = "メールアドレス", example = "admin@example.com")
          String email,
      @NotBlank(message = "パスワードは必須です") @Schema(description = "パスワード", example = "adminPassword123")
          String password) {}

  @Schema(name = "AdminSigninResponse", description = "Adminサインインレスポンス")
  public record Output(
      @Schema(description = "Admin ID", type = "string", format = "uuid") UUID id,
      @Schema(description = "メールアドレス", example = "admin@example.com") String email,
      @Schema(description = "アクセストークン") String accessToken,
      @Schema(description = "作成日時", type = "string", format = "date-time")
          LocalDateTime createdAt) {

    public static Output from(final Admin admin, final String accessToken) {
      return new Output(admin.getId().value(), admin.getEmail(), accessToken, admin.getCreatedAt());
    }
  }
}
