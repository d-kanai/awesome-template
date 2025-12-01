package com.example.demo.features.test.presentation.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "テストデータセットアップリクエスト")
public record SetupDataRequest(
    @Schema(description = "テーブル名 (例: user)", example = "user") String table) {}
