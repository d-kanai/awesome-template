package com.example.demo.modules.test.presentation.controller;

import com.example.demo.modules.test.application.command.ResetDatabaseCommand;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "E2Eテスト支援", description = "E2Eテストで利用するデータセットアップの補助APIです")
@Profile("test")
@RestController
@RequestMapping("/test")
public class TestDataSetupController {

  private static final Logger logger = LoggerFactory.getLogger(TestDataSetupController.class);

  private final ResetDatabaseCommand resetDatabaseCommand;

  public TestDataSetupController(final ResetDatabaseCommand resetDatabaseCommand) {
    this.resetDatabaseCommand = resetDatabaseCommand;
  }

  @Operation(summary = "DBをリセット", description = "アプリケーションが管理するテーブルからデータをすべて削除します。")
  @PostMapping("/reset")
  public ResponseEntity<Void> reset() {
    logger.info("Database reset requested");
    resetDatabaseCommand.execute();
    logger.info("Database reset completed successfully");
    return ResponseEntity.noContent().build();
  }
}
