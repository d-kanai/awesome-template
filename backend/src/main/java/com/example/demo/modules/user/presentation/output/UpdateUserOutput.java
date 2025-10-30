package com.example.demo.modules.user.presentation.output;

import com.example.demo.modules.user.domain.model.User;
import com.example.demo.modules.user.domain.value_object.UserId;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(name = "ユーザー更新レスポンス", description = "更新後のユーザーを表します")
public class UpdateUserOutput {
    private final UserId id;
    private final String email;
    private final String name;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public UpdateUserOutput(UserId id, String email, String name, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static UpdateUserOutput from(User user) {
        return new UpdateUserOutput(
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
