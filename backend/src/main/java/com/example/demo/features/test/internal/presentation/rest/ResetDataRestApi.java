package com.example.demo.features.test.internal.presentation.rest;

import com.example.demo.features.test.internal.application.command.ResetDatabaseCommand;
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
public class ResetDataRestApi {

  private final ResetDatabaseCommand resetDatabaseCommand;

  public ResetDataRestApi(final ResetDatabaseCommand resetDatabaseCommand) {
    this.resetDatabaseCommand = resetDatabaseCommand;
  }

  @Operation(summary = "DBをリセット", description = "アプリケーションが管理するテーブルからデータをすべて削除します。")
  @PostMapping("/reset_data")
  public ResponseEntity<Void> execute() {
    resetDatabaseCommand.execute();
    return ResponseEntity.noContent().build();
  }
}
