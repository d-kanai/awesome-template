package com.example.demo.modules.auth.presentation.controller;

import com.example.demo.modules.auth.application.command.SigninCommand;
import com.example.demo.modules.auth.application.command.SignupCommand;
import com.example.demo.modules.auth.presentation.input.SigninInput;
import com.example.demo.modules.auth.presentation.input.SignupInput;
import com.example.demo.modules.auth.presentation.output.MeOutput;
import com.example.demo.modules.auth.presentation.output.SigninOutput;
import com.example.demo.modules.auth.presentation.output.SignupOutput;
import com.example.demo.modules.shared.jwt.JwtClaims;
import com.example.demo.modules.shared.jwt.JwtCookieProperties;
import com.example.demo.modules.user.domain.model.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "認証", description = "ユーザー認証・登録に関連する操作です")
@RestController
@RequestMapping(value = "/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthController {

  private final SignupCommand signupCommand;
  private final SigninCommand signinCommand;
  private final JwtCookieProperties jwtCookieProperties;

  public AuthController(
      final SignupCommand signupCommand,
      final SigninCommand signinCommand,
      final JwtCookieProperties jwtCookieProperties) {
    this.signupCommand = signupCommand;
    this.signinCommand = signinCommand;
    this.jwtCookieProperties = jwtCookieProperties;
  }

  @Operation(summary = "ユーザー登録", description = "指定した情報で新しいユーザーを登録します。")
  @ApiResponses({
    @ApiResponse(
        responseCode = "201",
        description = "ユーザーの登録に成功しました。",
        content =
            @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = SignupOutput.class))),
    @ApiResponse(responseCode = "400", description = "リクエストペイロードが不正です。", content = @Content)
  })
  @PostMapping(value = "/signup", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<SignupOutput> signup(@Valid @RequestBody final SignupInput input) {
    try {
      final User user = signupCommand.execute(input);
      return ResponseEntity.status(HttpStatus.CREATED).body(SignupOutput.from(user));
    } catch (final IllegalArgumentException e) {
      return ResponseEntity.badRequest().build();
    }
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
  public ResponseEntity<SigninOutput> signin(
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

  @Operation(summary = "認証済みユーザー情報取得", description = "現在認証されているユーザーの情報を取得します。")
  @ApiResponses({
    @ApiResponse(
        responseCode = "200",
        description = "ユーザー情報の取得に成功しました。",
        content =
            @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = MeOutput.class))),
    @ApiResponse(responseCode = "401", description = "認証されていません。", content = @Content)
  })
  @GetMapping(value = "/me")
  public ResponseEntity<MeOutput> me() {
    // Get authenticated user claims from SecurityContext
    final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // Principal is JwtClaims (type-safe!)
    final JwtClaims claims = (JwtClaims) authentication.getPrincipal();

    // Return user info directly from JWT claims (no DB query needed)
    return ResponseEntity.ok(MeOutput.from(claims));
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
