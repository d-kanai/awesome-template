package com.example.demo.modules.health.presentation;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "ヘルスチェック", description = "サービスの健全性を確認します")
@RestController
public class HealthController {

    @Operation(
        summary = "サービスの稼働状況",
        description = "サービスの現在の状態を返します。",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "サービスは正常です。",
                content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = HealthStatusResponse.class)
                )
            )
        }
    )
    @GetMapping(value = "/health", produces = MediaType.APPLICATION_JSON_VALUE)
    public HealthStatusResponse health() {
        return new HealthStatusResponse("UP");
    }
}
