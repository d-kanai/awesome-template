# ビルドステージ: Gradle でアプリケーションをビルド
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Gradle Wrapper と依存関係定義をコピー
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./

# 依存関係をダウンロード（キャッシュ効率化）
RUN ./gradlew dependencies --no-daemon || return 0

# ソースコードをコピー
COPY src src

# アプリケーションをビルド
RUN ./gradlew bootJar --no-daemon

# 実行ステージ: 軽量な JRE イメージで実行
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# ビルドステージから JAR ファイルをコピー
COPY --from=builder /app/build/libs/*.jar app.jar

# ヘルスチェック用の actuator を有効化
EXPOSE 8080

# アプリケーション起動
ENTRYPOINT ["java", "-jar", "app.jar"]
