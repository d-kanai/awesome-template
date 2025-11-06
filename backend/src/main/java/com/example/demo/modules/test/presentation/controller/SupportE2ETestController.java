package com.example.demo.modules.test.presentation.controller;

import com.example.demo.modules.shared.jwt.JwtCookieProperties;
import com.example.demo.modules.shared.jwt.JwtTokenProvider;
import com.example.demo.modules.test.application.command.ResetDatabaseCommand;
import com.example.demo.modules.test.application.command.SetupDataCommand;
import com.example.demo.modules.test.presentation.dto.SetupDataRequest;
import com.example.demo.modules.test.presentation.dto.TestTokenResponse;
import com.example.demo.modules.user.domain.valueobject.UserEmail;
import com.example.demo.modules.user.domain.valueobject.UserId;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "E2Eテスト支援", description = "E2Eテストで利用するデータセットアップの補助APIです")
@Profile("test")
@RestController
@RequestMapping("/e2e")
public class SupportE2ETestController {

  private static final Logger logger = LoggerFactory.getLogger(SupportE2ETestController.class);

  /** E2Eテスト用の固定ユーザーID (SetupDataCommandで作成されるユーザーと一致). */
  private static final String E2E_TEST_USER_ID = "00000000-0000-0000-0000-000000000000";

  /** E2Eテスト用の固定メールアドレス. */
  private static final String E2E_TEST_EMAIL = "e2e-test@example.com";

  private final ResetDatabaseCommand resetDatabaseCommand;
  private final SetupDataCommand setupDataCommand;
  private final JwtTokenProvider jwtTokenProvider;
  private final JwtCookieProperties jwtCookieProperties;

  public SupportE2ETestController(
      final ResetDatabaseCommand resetDatabaseCommand,
      final SetupDataCommand setupDataCommand,
      final JwtTokenProvider jwtTokenProvider,
      final JwtCookieProperties jwtCookieProperties) {
    this.resetDatabaseCommand = resetDatabaseCommand;
    this.setupDataCommand = setupDataCommand;
    this.jwtTokenProvider = jwtTokenProvider;
    this.jwtCookieProperties = jwtCookieProperties;
  }

  @Operation(summary = "DBをリセット", description = "アプリケーションが管理するテーブルからデータをすべて削除します。")
  @PostMapping("/reset_data")
  public ResponseEntity<Void> resetData() {
    logger.info("Database reset requested");
    resetDatabaseCommand.execute();
    logger.info("Database reset completed successfully");
    return ResponseEntity.noContent().build();
  }

  @Operation(summary = "テストデータをセットアップ", description = "指定されたテーブルにテストデータを1レコード作成します。")
  @PostMapping("/create_data")
  public ResponseEntity<Void> createData(@RequestBody final SetupDataRequest request) {
    logger.info("Test data setup requested for table: {}", request.table());
    setupDataCommand.execute(request.table());
    logger.info("Test data setup completed for table: {}", request.table());
    return ResponseEntity.noContent().build();
  }

  @Operation(
      summary = "E2Eテスト用トークン生成",
      description =
          "E2Eテストでauth guardをバイパスするためのダミートークンを生成します。"
              + "setCookie=trueの場合、httpOnly Cookieとしても設定します。")
  @PostMapping("/dummy_token")
  public ResponseEntity<TestTokenResponse> generateDummyToken(
      @RequestParam(required = false, defaultValue = "false") final boolean setCookie,
      final HttpServletResponse response) {
    logger.info("Test token generation requested (setCookie={})", setCookie);
    // E2E テスト用の固定ユーザー情報でトークンを生成
    final UserId userId = UserId.fromString(E2E_TEST_USER_ID);
    final UserEmail userEmail = UserEmail.of(E2E_TEST_EMAIL);
    final String token = jwtTokenProvider.generateToken(userId, userEmail);

    // オプションでhttpOnly Cookieとして設定
    if (setCookie) {
      setTestAuthCookie(response, token);
      logger.info("Test token set as httpOnly Cookie");
    }

    logger.info("Test token generated successfully");
    return ResponseEntity.ok(new TestTokenResponse(token));
  }

  /**
   * E2Eテスト用の認証トークンをhttpOnly Cookieとして設定する.
   *
   * @param response HttpServletResponse
   * @param token JWT access token
   */
  private void setTestAuthCookie(final HttpServletResponse response, final String token) {
    final String sameSite =
        jwtCookieProperties.getSameSite() != null ? jwtCookieProperties.getSameSite() : "Lax";

    final ResponseCookie cookie =
        ResponseCookie.from(jwtCookieProperties.getName(), token)
            .httpOnly(jwtCookieProperties.isHttpOnly())
            .secure(jwtCookieProperties.isSecure())
            .sameSite(sameSite)
            .maxAge(jwtCookieProperties.getMaxAgeSeconds())
            .path("/")
            .build();

    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
  }
}
