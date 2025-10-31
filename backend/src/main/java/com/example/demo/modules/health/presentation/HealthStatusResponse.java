package com.example.demo.modules.health.presentation;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "ヘルスチェックのレスポンス")
public record HealthStatusResponse(
    @Schema(description = "サービスの現在の状態", example = "UP") String status) {}
