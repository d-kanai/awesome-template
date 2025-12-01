package com.example.demo.features.test.presentation.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "TestTokenResponse", description = "E2Eテスト用トークン")
public record TestTokenResponse(
    @Schema(description = "JWTトークン", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
        String token) {}
