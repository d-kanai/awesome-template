package com.example.demo.modules.auth.presentation.controller;

import com.example.demo.modules.auth.application.command.SignupCommand;
import com.example.demo.modules.auth.presentation.input.SignupInput;
import com.example.demo.modules.auth.presentation.output.SignupOutput;
import com.example.demo.modules.user.domain.model.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
public class AuthController {

  private final SignupCommand signupCommand;

  public AuthController(final SignupCommand signupCommand) {
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
}
