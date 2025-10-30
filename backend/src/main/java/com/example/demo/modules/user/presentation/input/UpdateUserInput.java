package com.example.demo.modules.user.presentation.input;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ユーザー更新リクエスト", description = "既存ユーザーを更新するためのリクエストペイロードです")
public class UpdateUserInput {
    @Schema(description = "ユーザーのメールアドレス", example = "jane.doe@example.com")
    private String email;
    @Schema(description = "ユーザーの表示名", example = "Jane Doe")
    private String name;

    public UpdateUserInput() {
    }

    public UpdateUserInput(String email, String name) {
        this.email = email;
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
