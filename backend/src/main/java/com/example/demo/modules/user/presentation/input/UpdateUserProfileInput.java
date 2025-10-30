package com.example.demo.modules.user.presentation.input;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "UpdateUserProfileRequest", description = "既存ユーザーのプロフィールを更新するためのリクエストペイロードです")
public class UpdateUserProfileInput {
    @Schema(description = "ユーザーのメールアドレス", example = "jane.doe@example.com")
    private String email;
    @Schema(description = "ユーザーの表示名", example = "Jane Doe")
    private String name;

    public UpdateUserProfileInput() {
    }

    public UpdateUserProfileInput(final String email, final String name) {
        this.email = email;
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(final String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }
}
