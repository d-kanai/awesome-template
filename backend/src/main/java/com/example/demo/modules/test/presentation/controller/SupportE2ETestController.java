package com.example.demo.modules.test.presentation.controller;

import com.example.demo.modules.shared.jwt.JwtTokenProvider;
import com.example.demo.modules.test.application.command.ResetDatabaseCommand;
import com.example.demo.modules.test.application.command.SetupDataCommand;
import com.example.demo.modules.test.presentation.dto.SetupDataRequest;
import com.example.demo.modules.test.presentation.dto.TestTokenResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
public class SupportE2ETestController {

  private static final Logger logger = LoggerFactory.getLogger(SupportE2ETestController.class);

  /** E2Eテスト用の固定ユーザーID (SetupDataCommandで作成されるユーザーと一致). */
  private static final String E2E_TEST_USER_ID = "00000000-0000-0000-0000-000000000000";

  /** E2Eテスト用の固定メールアドレス. */
  private static final String E2E_TEST_EMAIL = "e2e-test@example.com";

  private final ResetDatabaseCommand resetDatabaseCommand;
  private final SetupDataCommand setupDataCommand;
  private final JwtTokenProvider jwtTokenProvider;

  public SupportE2ETestController(
      final ResetDatabaseCommand resetDatabaseCommand,
      final SetupDataCommand setupDataCommand,
      final JwtTokenProvider jwtTokenProvider) {
    this.resetDatabaseCommand = resetDatabaseCommand;
    this.setupDataCommand = setupDataCommand;
    this.jwtTokenProvider = jwtTokenProvider;
  }

  @Operation(summary = "DBをリセット", description = "アプリケーションが管理するテーブルからデータをすべて削除します。")
  @PostMapping("/reset_data")
  public ResponseEntity<Void> resetData() {
    logger.info("Database reset requested");
    resetDatabaseCommand.execute();
    logger.info("Database reset completed successfully");
    return ResponseEntity.noContent().build();
  }

  @Operation(summary = "テストデータをセットアップ", description = "指定されたテーブルにテストデータを1レコード作成します。")
  @PostMapping("/create_data")
  public ResponseEntity<Void> createData(@RequestBody final SetupDataRequest request) {
    logger.info("Test data setup requested for table: {}", request.table());
    setupDataCommand.execute(request.table());
    logger.info("Test data setup completed for table: {}", request.table());
    return ResponseEntity.noContent().build();
  }

  @Operation(summary = "E2Eテスト用トークン生成", description = "E2Eテストでauth guardをバイパスするためのダミートークンを生成します。")
  @PostMapping("/dummy_token")
  public ResponseEntity<TestTokenResponse> generateDummyToken() {
    logger.info("Test token generation requested");
    // E2E テスト用の固定ユーザー情報でトークンを生成
    final String token = jwtTokenProvider.generateToken(E2E_TEST_USER_ID, E2E_TEST_EMAIL);
    logger.info("Test token generated successfully");
    return ResponseEntity.ok(new TestTokenResponse(token));
  }
}
