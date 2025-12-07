package com.example.demo.features.test.internal.presentation.rest;

import com.example.demo.features.test.internal.application.command.SetupDataCommand;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "E2Eテスト支援", description = "E2Eテストで利用するデータセットアップの補助APIです")
@Profile("test")
@RestController
@RequestMapping("/e2e")
public class SetupDataRestApi {

  private final SetupDataCommand setupDataCommand;

  public SetupDataRestApi(final SetupDataCommand setupDataCommand) {
    this.setupDataCommand = setupDataCommand;
  }

  @Operation(
      operationId = "createData",
      summary = "テストデータをセットアップ",
      description = "指定されたテーブルにテストデータを1レコード作成します。")
  @PostMapping("/create_data")
  public ResponseEntity<Void> execute(@RequestBody final Input input) {
    setupDataCommand.execute(new SetupDataCommand.Input(input.table()));
    return ResponseEntity.noContent().build();
  }

  @Schema(name = "SetupDataRequest", description = "テストデータセットアップのリクエストです")
  public record Input(@Schema(description = "セットアップ対象のテーブル名", example = "users") String table) {}
}
