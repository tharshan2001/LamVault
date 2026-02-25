import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';

export class FileProcessorStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Cognito
    const userPool = new cognito.UserPool(this, 'LamVaultUsers', {
      selfSignUpEnabled: true,
      signInAliases: { email: true }
    });

    const userPoolClient = new cognito.UserPoolClient(this, 'LamVaultClient', {
      userPool,
      authFlows: { userPassword: true }
    });

    // S3 Bucket
    const uploadBucket = new s3.Bucket(this, 'UploadBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });

    // DynamoDB Table
    const fileTable = new dynamodb.Table(this, 'FilesMetadata', {
      partitionKey: { name: 'fileId', type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY
    });

    // Lambda: Generate Presigned URL
    const presignedLambda = new lambda.Function(this, 'GeneratePresignedURL', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/generatePresignedURL'),
      environment: { BUCKET_NAME: uploadBucket.bucketName }
    });
    uploadBucket.grantPut(presignedLambda);

    // Lambda: File Processor
    const processorLambda = new lambda.Function(this, 'FileProcessor', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/fileProcessor'),
      timeout: Duration.minutes(5),
      environment: {
        BUCKET_NAME: uploadBucket.bucketName,
        TABLE_NAME: fileTable.tableName
      }
    });
    uploadBucket.grantReadWrite(processorLambda);
    fileTable.grantReadWriteData(processorLambda);

    // S3 triggers Lambda
    uploadBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED_PUT,
      new s3n.LambdaDestination(processorLambda)
    );

    // API Gateway
    const api = new apigateway.RestApi(this, 'FileAPI');
    const presignedIntegration = new apigateway.LambdaIntegration(presignedLambda);

    const apiResource = api.root.addResource('getPresignedUrl');
    apiResource.addMethod('POST', presignedIntegration, {
      authorizationType: apigateway.AuthorizationType.COGNITO,
      authorizer: new apigateway.CognitoUserPoolsAuthorizer(this, 'Authorizer', { cognitoUserPools: [userPool] })
    });

    this.uploadBucket = uploadBucket;
    this.fileTable = fileTable;
    this.apiUrl = api.url;
    this.userPoolId = userPool.userPoolId;
    this.userPoolClientId = userPoolClient.userPoolClientId;
  }
}