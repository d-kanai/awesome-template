package com.example.demo.modules.user.presentation.output;

import com.example.demo.modules.user.domain.model.User;
import com.example.demo.modules.user.domain.value_object.UserId;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Schema(name = "ユーザー一覧レスポンス", description = "登録済みユーザーの一覧を表します")
public class FindAllUsersOutput {
    private final List<UserItem> users;

    public FindAllUsersOutput(List<UserItem> users) {
        this.users = users;
    }

    public static FindAllUsersOutput from(List<User> users) {
        List<UserItem> items = users.stream()
            .map(UserItem::from)
            .collect(Collectors.toList());
        return new FindAllUsersOutput(items);
    }

    @ArraySchema(schema = @Schema(implementation = UserItem.class), arraySchema = @Schema(description = "ユーザーの一覧です"))
    public List<UserItem> getUsers() {
        return users;
    }

    @Schema(name = "ユーザー一覧項目", description = "一覧レスポンス内のユーザー情報です")
    public static class UserItem {
        private final UserId id;
        private final String email;
        private final String name;
        private final LocalDateTime createdAt;
        private final LocalDateTime updatedAt;

        public UserItem(UserId id, String email, String name, LocalDateTime createdAt, LocalDateTime updatedAt) {
            this.id = id;
            this.email = email;
            this.name = name;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
        }

        public static UserItem from(User user) {
            return new UserItem(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getCreatedAt(),
                user.getUpdatedAt()
            );
        }

        @Schema(description = "ユーザーの一意な識別子", type = "string", format = "uuid")
        public UserId getId() {
            return id;
        }

        @Schema(description = "ユーザーのメールアドレス", example = "jane.doe@example.com")
        public String getEmail() {
            return email;
        }

        @Schema(description = "ユーザーの表示名", example = "Jane Doe")
        public String getName() {
            return name;
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
