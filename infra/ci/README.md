# Tekton CI

## ディレクトリ構成

```
infra/ci/
├── README.md
├── setup-local.sh           # ローカル環境セットアップ (kind)
├── secrets/
│   ├── local.yaml           # ローカル用 Secret
│   ├── aws-secretstore.yaml # AWS Secrets Manager 接続設定
│   └── prod.yaml            # 本番用 ExternalSecret
├── shared/
│   └── tasks/
│       └── git-clone.yaml   # 共有 git clone タスク
├── web/
│   ├── tasks/
│   │   ├── web-install.yaml           # pnpm install
│   │   ├── web-quality.yaml           # typecheck + biome + lint:deps + knip
│   │   ├── web-test-ut.yaml           # vitest (coverage 90%)
│   │   ├── web-test-e2e-mock.yaml     # Cucumber + Playwright
│   │   ├── web-security-sast.yaml     # Semgrep + Gitleaks + Trivy
│   │   ├── web-build.yaml             # Next.js build + Kaniko
│   │   └── web-security-image-scan.yaml
│   ├── pipelines/
│   │   └── web-ci.yaml
│   └── pipelineruns/
│       └── web-ci.yaml
└── backend/
    ├── tasks/
    │   ├── backend-install.yaml       # Gradle compile
    │   ├── backend-quality.yaml       # Checkstyle + PMD + SpotBugs
    │   ├── backend-test-ut.yaml       # JUnit + JaCoCo (coverage 90%)
    │   ├── backend-security-sast.yaml # Semgrep + Gitleaks + Trivy
    │   ├── backend-build.yaml         # bootJar + Kaniko
    │   └── backend-security-image-scan.yaml
    ├── pipelines/
    │   └── backend-ci.yaml
    ├── pipelineruns/
    │   └── backend-ci.yaml
    └── taskruns/                      # 個別タスク実行用
        ├── backend-quality.yaml
        ├── backend-test-ut.yaml
        └── backend-security-sast.yaml
```

## パイプライン構成

### Web CI

```
                    ┌─── quality ───────┐
clone ─── install ──┼─── test-ut ───────┼── build ── image-scan
                    ├─── test-e2e-mock ─┤
                    └─── security-sast ─┘
```

### Backend CI

```
                    ┌─── quality ───────┐
clone ─── install ──┼─── test-ut ───────┼── build ── image-scan
                    └─── security-sast ─┘
```

## ローカル開発

```bash
# 1. セットアップ (初回のみ)
make tekton-setup

# 2. Web CI パイプライン実行
make tekton-web-ci

# 3. Backend CI パイプライン実行
make tekton-backend-ci

# 4. ログ確認
make tekton-logs

# 5. Dashboard (ブラウザで開く)
make tekton-dashboard

# 6. クラスター削除
make tekton-teardown
```

## 本番環境 (OpenShift on AWS)

### 前提条件
- External Secrets Operator インストール済み
- IRSA または Pod Identity 設定済み

### セットアップ

```bash
# 1. AWS Secrets Manager に Secret 作成
aws secretsmanager create-secret \
  --name prod/awesome-template/web-build \
  --secret-string '{
    "ANALYZE": "false",
    "NEXT_PUBLIC_API_BASE_URL": "https://api.example.com",
    "NEXT_PUBLIC_API_MOCK_MODE": "false"
  }'

# 2. ClusterSecretStore 作成
kubectl apply -f infra/ci/secrets/aws-secretstore.yaml

# 3. ExternalSecret 作成 (自動で K8s Secret が生成される)
kubectl apply -f infra/ci/secrets/prod.yaml

# 4. 確認
kubectl get secret web-build-env -o yaml
```

## Secret の流れ

```
[ローカル]
local.yaml → K8s Secret → TaskRun (envFrom)

[本番]
AWS Secrets Manager → ExternalSecret → K8s Secret → TaskRun (envFrom)
```

TaskRun は同じ `web-build-env` Secret を参照するので、
環境に応じて Secret の作成方法だけ変える。

## タスク詳細

### Web

| Task | 内容 |
|------|------|
| web-quality | typecheck + biome + lint:deps + knip (deadcode) |
| web-test-ut | vitest + coverage 90% + Tekton Results |
| web-test-e2e-mock | Cucumber + Playwright (Mock Mode) |
| web-security-sast | Semgrep + Gitleaks + Trivy fs/config |

### Backend

| Task | 内容 |
|------|------|
| backend-quality | Checkstyle + PMD + SpotBugs |
| backend-test-ut | JUnit + JaCoCo + coverage 90% + Tekton Results |
| backend-security-sast | Semgrep + Gitleaks + Trivy fs/config |

## Tekton Results (Dashboard表示)

`test-ut` タスクは以下の Results を出力:

```yaml
results:
  - name: test-result   # "38/38" 形式
  - name: coverage      # "Lines: 92% | ..." または "Instructions: 95%"
```

これらは Tekton Dashboard で確認可能。
