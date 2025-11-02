import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as apprunner from 'aws-cdk-lib/aws-apprunner';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ECR リポジトリの作成
    const repository = new ecr.Repository(this, 'BackendRepository', {
      repositoryName: 'awesome-template-backend',
      removalPolicy: cdk.RemovalPolicy.DESTROY, // 開発環境用：スタック削除時にリポジトリも削除
      emptyOnDelete: true, // リポジトリ削除時にイメージも削除
      imageScanOnPush: true, // イメージプッシュ時に脆弱性スキャン
    });

    // App Runner 用の IAM ロール（ECR からイメージを pull するため）
    const accessRole = new iam.Role(this, 'AppRunnerAccessRole', {
      assumedBy: new iam.ServicePrincipal('build.apprunner.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSAppRunnerServicePolicyForECRAccess'),
      ],
    });

    // App Runner サービスの作成
    const service = new apprunner.CfnService(this, 'BackendService', {
      serviceName: 'awesome-template-backend-test',
      sourceConfiguration: {
        authenticationConfiguration: {
          accessRoleArn: accessRole.roleArn,
        },
        autoDeploymentsEnabled: true, // ECR への新しいイメージプッシュで自動デプロイ
        imageRepository: {
          imageIdentifier: `${repository.repositoryUri}:latest`,
          imageRepositoryType: 'ECR',
          imageConfiguration: {
            port: '8080',
            runtimeEnvironmentVariables: [
              {
                name: 'SPRING_PROFILES_ACTIVE',
                value: 'test',
              },
            ],
          },
        },
      },
      instanceConfiguration: {
        cpu: '1 vCPU',
        memory: '2 GB',
      },
      healthCheckConfiguration: {
        protocol: 'HTTP',
        path: '/actuator/health',
        interval: 20,
        timeout: 10,
        healthyThreshold: 1,
        unhealthyThreshold: 10,
      },
    });

    // Outputs: 後で GitHub Actions や Maestro から使う URL
    new cdk.CfnOutput(this, 'BackendUrl', {
      value: `https://${service.attrServiceUrl}`,
      description: 'App Runner service URL for backend',
      exportName: 'BackendTestUrl',
    });

    new cdk.CfnOutput(this, 'RepositoryUri', {
      value: repository.repositoryUri,
      description: 'ECR repository URI',
      exportName: 'BackendRepositoryUri',
    });
  }
}
