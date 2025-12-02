package com.example.demo.features.test.internal.presentation.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "E2Eテスト支援", description = "E2Eテストで利用するデータセットアップの補助APIです")
@Profile("test")
@RestController
@RequestMapping("/e2e")
public class TriggerErrorRestApi {

  @Operation(summary = "500エラーを発生", description = "500エラーログのテスト用。意図的に例外を発生させます。")
  @PostMapping("/trigger_error")
  public ResponseEntity<Void> execute() {
    throw new RuntimeException("Intentional test error for 500 logging verification");
  }
}
