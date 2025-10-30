package com.example.demo.modules.user.presentation.output;

import com.example.demo.modules.user.domain.model.User;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.UUID;

@Schema(name = "UpdateUserProfileResponse", description = "更新後のユーザーを表します")
public class UpdateUserProfileOutput {
    private final UUID id;
    private final String email;
    private final String name;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public UpdateUserProfileOutput(final UUID id, final String email, final String name, final LocalDateTime createdAt, final LocalDateTime updatedAt) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static UpdateUserProfileOutput from(final User user) {
        return new UpdateUserProfileOutput(
            user.getId().getValue(),
            user.getEmail(),
            user.getName(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }

    @Schema(description = "ユーザーの一意な識別子", type = "string", format = "uuid")
    public UUID getId() {
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
