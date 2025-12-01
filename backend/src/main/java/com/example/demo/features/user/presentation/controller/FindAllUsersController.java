package com.example.demo.features.user.presentation.controller;

import com.example.demo.features.user.application.query.FindAllUsersQuery;
import com.example.demo.features.user.domain.model.User;
import com.example.demo.features.user.presentation.output.FindAllUsersOutput;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "ユーザー", description = "ユーザーを管理するための操作です")
@RestController
@RequestMapping(value = "/users", produces = MediaType.APPLICATION_JSON_VALUE)
public class FindAllUsersController {

  private final FindAllUsersQuery findAllUsersQuery;

  public FindAllUsersController(final FindAllUsersQuery findAllUsersQuery) {
    this.findAllUsersQuery = findAllUsersQuery;
  }

  @Operation(
      summary = "ユーザー一覧を取得",
      description = "登録されているすべてのユーザーを取得します。",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "ユーザーの取得に成功しました。",
            content =
                @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = FindAllUsersOutput.class)))
      })
  @GetMapping
  public ResponseEntity<FindAllUsersOutput> execute() {
    final List<User> users = findAllUsersQuery.execute();
    return ResponseEntity.ok(FindAllUsersOutput.from(users));
  }
}
