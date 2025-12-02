package com.example.demo.features.test.internal.presentation.rest;

import com.example.demo.shared.config.AppProperties;
import com.example.demo.shared.jwt.JwtTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "E2Eテスト支援", description = "E2Eテストで利用するデータセットアップの補助APIです")
@Profile("test")
@RestController
@RequestMapping("/e2e")
public class GenerateDummyTokenRestApi {

  /** E2Eテスト用の固定ユーザーID (SetupDataCommandで作成されるユーザーと一致). */
  private static final String E2E_TEST_USER_ID = "00000000-0000-0000-0000-000000000000";

  /** E2Eテスト用の固定メールアドレス. */
  private static final String E2E_TEST_EMAIL = "e2e-test@example.com";

  private final JwtTokenProvider jwtTokenProvider;
  private final AppProperties appProperties;

  public GenerateDummyTokenRestApi(
      final JwtTokenProvider jwtTokenProvider, final AppProperties appProperties) {
    this.jwtTokenProvider = jwtTokenProvider;
    this.appProperties = appProperties;
  }

  @Operation(
      summary = "E2Eテスト用トークン生成",
      description =
          "E2Eテストでauth guardをバイパスするためのダミートークンを生成します。"
              + "setCookie=trueの場合、httpOnly Cookieとしても設定します。")
  @PostMapping("/dummy_token")
  public ResponseEntity<Output> execute(
      @RequestParam(required = false, defaultValue = "false") final boolean setCookie,
      final HttpServletResponse response) {
    final String token = jwtTokenProvider.generateToken(E2E_TEST_USER_ID, E2E_TEST_EMAIL);

    if (setCookie) {
      setTestAuthCookie(response, token);
    }

    return ResponseEntity.ok(new Output(token));
  }

  private void setTestAuthCookie(final HttpServletResponse response, final String token) {
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

  @Schema(name = "TestTokenResponse", description = "E2Eテスト用トークンのレスポンスです")
  public record Output(
      @Schema(description = "JWT認証トークン", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
          String token) {}
}
