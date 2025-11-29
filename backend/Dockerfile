# ビルドステージ: Gradle でアプリケーションをビルド
# Alpine は ARM64 で不安定なので、Debian ベースを使用
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

# Gradle Wrapper と依存関係定義をコピー
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./

# 依存関係をダウンロード（キャッシュ効率化）
RUN ./gradlew dependencies --no-daemon || return 0

# ソースコードをコピー（jOOQ 生成コードを含む）
COPY src src

# アプリケーションをビルド（jOOQ コード生成と Flyway マイグレーションをスキップ）
RUN ./gradlew bootJar --no-daemon -x generateJooq -x flywayMigrate

# 実行ステージ: 軽量な JRE イメージで実行
FROM eclipse-temurin:21-jre

WORKDIR /app

# 非rootユーザーを作成
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# ビルドステージから JAR ファイルをコピー
COPY --from=builder /app/build/libs/*.jar app.jar

# ファイルの所有者を変更
RUN chown -R appuser:appgroup /app

# 非rootユーザーに切り替え
USER appuser

# ヘルスチェック用の actuator を有効化
EXPOSE 8080

# アプリケーション起動
ENTRYPOINT ["java", "-jar", "app.jar"]
