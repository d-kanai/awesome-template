import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ECR リポジトリの作成
    const repository = new ecr.Repository(this, 'BackendRepository', {
      repositoryName: 'awesome-template-backend',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      emptyOnDelete: true,
      imageScanOnPush: true,
    });

    // VPC作成（パブリックサブネットのみ）
    const vpc = new ec2.Vpc(this, 'BackendVpc', {
      maxAzs: 2,
      natGateways: 0, // コスト削減のためNAT Gatewayなし
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    // ECS クラスター
    const cluster = new ecs.Cluster(this, 'BackendCluster', {
      vpc,
      clusterName: 'awesome-template-backend-cluster',
    });

    // CloudWatch Logs
    const logGroup = new logs.LogGroup(this, 'BackendLogGroup', {
      logGroupName: '/ecs/awesome-template-backend',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      retention: logs.RetentionDays.ONE_WEEK,
    });

    // Fargate タスク定義
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'BackendTaskDef', {
      memoryLimitMiB: 2048,
      cpu: 1024,
    });

    // コンテナ定義
    const container = taskDefinition.addContainer('BackendContainer', {
      image: ecs.ContainerImage.fromEcrRepository(repository, 'latest'),
      environment: {
        SPRING_PROFILES_ACTIVE: 'test',
      },
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'backend',
        logGroup,
      }),
    });

    container.addPortMappings({
      containerPort: 8080,
      protocol: ecs.Protocol.TCP,
    });

    // セキュリティグループ（ポート8080を公開）
    const serviceSecurityGroup = new ec2.SecurityGroup(this, 'BackendServiceSecurityGroup', {
      vpc,
      description: 'Security group for backend ECS service',
      allowAllOutbound: true,
    });

    serviceSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(8080),
      'Allow HTTP traffic on port 8080'
    );

    // Fargate サービス（ALBなし、パブリックIPで直接アクセス）
    const fargateService = new ecs.FargateService(this, 'BackendService', {
      cluster,
      taskDefinition,
      desiredCount: 1,
      assignPublicIp: true,
      serviceName: 'awesome-template-backend-service',
      securityGroups: [serviceSecurityGroup],
    });

    // Outputs
    new cdk.CfnOutput(this, 'ServiceName', {
      value: fargateService.serviceName,
      description: 'ECS Service name (use AWS CLI to get task public IP)',
      exportName: 'BackendServiceName',
    });

    new cdk.CfnOutput(this, 'ClusterName', {
      value: cluster.clusterName,
      description: 'ECS Cluster name',
      exportName: 'BackendClusterName',
    });

    new cdk.CfnOutput(this, 'RepositoryUri', {
      value: repository.repositoryUri,
      description: 'ECR repository URI',
      exportName: 'BackendRepositoryUri',
    });

    new cdk.CfnOutput(this, 'LogGroupName', {
      value: logGroup.logGroupName,
      description: 'CloudWatch Log Group name',
      exportName: 'BackendLogGroupName',
    });
  }
}
