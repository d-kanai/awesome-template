# Mockoon 外部APIモック

外部APIをモックするためのMockoon設定。

## 起動

```bash
docker compose up -d mockoon
```

URL: http://localhost:3002

## OpenAPI → Mockoon JSONの流れ

### 1. OpenAPI定義を作成

`openapi/external-api.yaml`にエンドポイント定義を追加:

```yaml
paths:
  /api/v1/users/verify:
    post:
      operationId: verifyUser
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/VerifyUserRequest'
      responses:
        "200":
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/VerifyUserResponse'

components:
  schemas:
    VerifyUserRequest:
      properties:
        email:
          type: string
        name:
          type: string

    VerifyUserResponse:
      properties:
        verified:
          type: boolean
        verificationId:
          type: string
          format: uuid
        message:
          type: string
```

### 2. Mockoon JSONにエンドポイント追加

`mockoon/environments/dev.json`の`routes`配列に追加:

```json
{
  "uuid": "verify-user-api",
  "type": "http",
  "method": "post",
  "endpoint": "api/v1/users/verify",
  "responses": [
    {
      "uuid": "verify-user-success",
      "body": "{\n  \"verified\": true,\n  \"verificationId\": \"00000000-0000-0000-0000-000000000001\",\n  \"message\": \"User verified successfully\"\n}",
      "statusCode": 200,
      "headers": [{ "key": "Content-Type", "value": "application/json" }],
      "default": true
    }
  ],
  "enabled": true
}
```

`rootChildren`にも追加:

```json
{
  "type": "route",
  "uuid": "verify-user-api"
}
```

### 3. Mockoon再起動

```bash
docker compose restart mockoon
```

### 4. 動作確認

```bash
curl -X POST http://localhost:3002/api/v1/users/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

## ディレクトリ構成

```
mockoon/
├── README.md
└── environments/
    └── dev.json          # Mockoon環境設定
```
