package com.example.demo.features.customer.user.internal.presentation.rest;

import static com.example.demo.shared.constants.ApiPath.CUSTOMER_USERS;

import com.example.demo.features.customer.user.internal.application.query.FindAllUsersQuery;
import com.example.demo.features.customer.user.internal.domain.model.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "ユーザー", description = "ユーザーを管理するための操作です")
@RestController
@RequestMapping(value = CUSTOMER_USERS, produces = MediaType.APPLICATION_JSON_VALUE)
public class FindAllUsersRestApi {

  private final FindAllUsersQuery findAllUsersQuery;

  public FindAllUsersRestApi(final FindAllUsersQuery findAllUsersQuery) {
    this.findAllUsersQuery = findAllUsersQuery;
  }

  @Operation(
      operationId = "getAllUsers",
      summary = "ユーザー一覧を取得",
      description = "登録されているすべてのユーザーを取得します。",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "ユーザーの取得に成功しました。",
            content =
                @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = Output.class)))
      })
  @GetMapping
  public ResponseEntity<Output> execute() {
    final FindAllUsersQuery.Output result = findAllUsersQuery.execute();
    return ResponseEntity.ok(Output.from(result));
  }

  @Schema(name = "FindAllUsersResponse", description = "登録済みユーザーの一覧を表します")
  public record Output(
      @ArraySchema(
              schema = @Schema(implementation = UserItem.class),
              arraySchema = @Schema(description = "ユーザーの一覧です"))
          List<UserItem> users) {

    public static Output from(final FindAllUsersQuery.Output result) {
      final List<UserItem> items =
          result.users().stream().map(UserItem::from).collect(Collectors.toList());
      return new Output(items);
    }
  }

  @Schema(name = "UserListItem", description = "一覧レスポンス内のユーザー情報です")
  public record UserItem(
      @Schema(
              description = "ユーザーの一意な識別子",
              type = "string",
              format = "uuid",
              requiredMode = Schema.RequiredMode.REQUIRED)
          UUID id,
      @Schema(
              description = "ユーザーのメールアドレス",
              example = "jane.doe@example.com",
              requiredMode = Schema.RequiredMode.REQUIRED)
          String email,
      @Schema(
              description = "ユーザーの作成日時",
              type = "string",
              format = "date-time",
              requiredMode = Schema.RequiredMode.REQUIRED)
          LocalDateTime createdAt,
      @Schema(
              description = "ユーザーの最終更新日時",
              type = "string",
              format = "date-time",
              requiredMode = Schema.RequiredMode.REQUIRED)
          LocalDateTime updatedAt) {

    public static UserItem from(final User user) {
      return new UserItem(
          user.getId().getValue(), user.getEmail(), user.getCreatedAt(), user.getUpdatedAt());
    }
  }
}
