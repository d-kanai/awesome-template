# Tekton CI

## ディレクトリ構成

```
infra/tekton/
├── README.md
├── setup-local.sh           # ローカル環境セットアップ (kind)
├── taskruns/
│   └── web-build.yaml       # Next.js ビルド TaskRun
└── secrets/
    ├── local.yaml           # ローカル用 Secret
    ├── aws-secretstore.yaml # AWS Secrets Manager 接続設定
    └── prod.yaml            # 本番用 ExternalSecret
```

## ローカル開発

```bash
# 1. セットアップ (初回のみ)
make tekton-setup

# 2. Secret 作成
kubectl apply -f infra/tekton/secrets/local.yaml

# 3. ビルド実行
make tekton-web-build

# 4. ログ確認
make tekton-logs

# 5. Dashboard
make tekton-dashboard
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
kubectl apply -f infra/tekton/secrets/aws-secretstore.yaml

# 3. ExternalSecret 作成 (自動で K8s Secret が生成される)
kubectl apply -f infra/tekton/secrets/prod.yaml

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
