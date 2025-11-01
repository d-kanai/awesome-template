package com.example.demo.modules.user.presentation.output;

import com.example.demo.modules.user.domain.model.User;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Schema(name = "FindAllUsersResponse", description = "登録済みユーザーの一覧を表します")
public class FindAllUsersOutput {
  private final List<UserItem> users;

  public FindAllUsersOutput(final List<UserItem> users) {
    this.users = users;
  }

  public static FindAllUsersOutput from(final List<User> users) {
    final List<UserItem> items = users.stream().map(UserItem::from).collect(Collectors.toList());
    return new FindAllUsersOutput(items);
  }

  @ArraySchema(
      schema = @Schema(implementation = UserItem.class),
      arraySchema = @Schema(description = "ユーザーの一覧です"))
  public List<UserItem> getUsers() {
    return users;
  }

  @Schema(name = "UserListItem", description = "一覧レスポンス内のユーザー情報です")
  public static class UserItem {
    private final UUID id;
    private final String email;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public UserItem(
        final UUID id,
        final String email,
        final LocalDateTime createdAt,
        final LocalDateTime updatedAt) {
      this.id = id;
      this.email = email;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }

    public static UserItem from(final User user) {
      return new UserItem(
          user.getId().getValue(), user.getEmail(), user.getCreatedAt(), user.getUpdatedAt());
    }

    @Schema(description = "ユーザーの一意な識別子", type = "string", format = "uuid")
    public UUID getId() {
      return id;
    }

    @Schema(description = "ユーザーのメールアドレス", example = "jane.doe@example.com")
    public String getEmail() {
      return email;
    }

    @Schema(description = "ユーザーの作成日時", type = "string", format = "date-time")
    public LocalDateTime getCreatedAt() {
      return createdAt;
    }

    @Schema(description = "ユーザーの最終更新日時", type = "string", format = "date-time")
    public LocalDateTime getUpdatedAt() {
      return updatedAt;
    }
  }
}
