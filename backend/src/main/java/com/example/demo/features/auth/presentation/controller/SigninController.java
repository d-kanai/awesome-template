package com.example.demo.features.auth.presentation.controller;

import com.example.demo.features.auth.application.command.SigninCommand;
import com.example.demo.features.auth.presentation.input.SigninInput;
import com.example.demo.features.auth.presentation.output.SigninOutput;
import com.example.demo.shared.jwt.JwtCookieProperties;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
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
@RequestMapping(value = "/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class SigninController {

  private final SigninCommand signinCommand;
  private final JwtCookieProperties jwtCookieProperties;

  public SigninController(
      final SigninCommand signinCommand, final JwtCookieProperties jwtCookieProperties) {
    this.signinCommand = signinCommand;
    this.jwtCookieProperties = jwtCookieProperties;
  }

  @Operation(summary = "サインイン", description = "メールアドレスとパスワードでサインインします。")
  @ApiResponses({
    @ApiResponse(
        responseCode = "200",
        description = "サインインに成功しました。",
        content =
            @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = SigninOutput.class))),
    @ApiResponse(
        responseCode = "400",
        description = "メールアドレスまたはパスワードが正しくありません。",
        content = @Content)
  })
  @PostMapping(value = "/signin", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<SigninOutput> execute(
      @Valid @RequestBody final SigninInput input, final HttpServletResponse response) {
    try {
      final SigninOutput output = signinCommand.execute(input);

      // Set httpOnly Cookie for web clients (frontend_web)
      // Keep accessToken in response body for backward compatibility (frontend_native)
      setAuthCookie(response, output.getAccessToken());

      return ResponseEntity.ok(output);
    } catch (final IllegalArgumentException e) {
      return ResponseEntity.badRequest().build();
    }
  }

  /**
   * 認証トークンをhttpOnly Cookieとして設定する.
   *
   * @param response HttpServletResponse
   * @param token JWT access token
   */
  private void setAuthCookie(final HttpServletResponse response, final String token) {
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
