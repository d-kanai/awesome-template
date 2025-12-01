package com.example.demo.features.auth.presentation.controller;

import com.example.demo.features.auth.presentation.output.MeOutput;
import com.example.demo.shared.jwt.JwtClaims;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "認証", description = "ユーザー認証・登録に関連する操作です")
@RestController
@RequestMapping(value = "/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class FindMeController {

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
  public ResponseEntity<MeOutput> execute() {
    // Get authenticated user claims from SecurityContext
    // Security filter ensures authentication, so no null check needed
    final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    // Principal is JwtClaims (type-safe!)
    final JwtClaims claims = (JwtClaims) authentication.getPrincipal();

    // Return user info directly from JWT claims (no DB query needed)
    return ResponseEntity.ok(MeOutput.from(claims));
  }
}
