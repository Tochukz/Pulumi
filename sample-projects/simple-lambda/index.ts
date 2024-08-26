import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const config = new pulumi.Config();
const variables: any = config.requireObject("variables");
const aliases: string[] = config.requireObject("aliases");

const docsHandlerRole = new aws.iam.Role("SimpleLambdaRole", {
  assumeRolePolicy: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Principal: {
          Service: "lambda.amazonaws.com",
        },
        Effect: "Allow",
      },
    ],
  },
});

new aws.iam.RolePolicyAttachment("SimpleLambdaRoleAttach", {
  role: docsHandlerRole,
  policyArn: aws.iam.ManagedPolicies.AWSLambdaExecute,
});

const appLayer = new aws.lambda.LayerVersion("SimpleLayer", {
  layerName: "SimpleLayr",
  s3Bucket: "local-dev-workspace",
  s3Key: "v0.0.1/express_nodejs.zip",
});

const appFunction = new aws.lambda.Function("SimpleLambda", {
  runtime: "nodejs20.x",
  role: docsHandlerRole.arn,
  handler: "lambda.handler",
  s3Bucket: "local-dev-workspace",
  s3Key: "v0.0.1/express.zip",
  layers: [appLayer.arn],
  environment: {
    variables,
  },
});

const apiGateway = new aws.apigateway.RestApi("SimpleApiGateway", {
  name: "SimpleAp",
});

const path = "simple-resource";
const apiResource = new aws.apigateway.Resource("SimpleResource", {
  restApi: apiGateway.id,
  parentId: apiGateway.rootResourceId,
  pathPart: path,
});

const apiMethod = new aws.apigateway.Method("SimpleMethod", {
  restApi: apiGateway.id,
  resourceId: apiResource.id,
  httpMethod: "GET",
  authorization: "NONE",
});

const integration = new aws.apigateway.Integration("SimpleIntegration", {
  restApi: apiGateway.id,
  resourceId: apiResource.id,
  httpMethod: apiMethod.httpMethod,
  integrationHttpMethod: "POST",
  type: "AWS_PROXY",
  uri: appFunction.invokeArn,
});

new aws.lambda.Permission("SimplePermission", {
  action: "lambda:InvokeFunction",
  function: appFunction.name,
  principal: "apigateway.amazonaws.com",
  sourceArn: pulumi.interpolate`${apiGateway.executionArn}/*/*`,
});

const deployment = new aws.apigateway.Deployment(
  "SimpleDeployment",
  {
    restApi: apiGateway.id,
    stageName: "development",
  },
  { dependsOn: [integration] }
);

export const functionName = appFunction.name;
export const layerName = appLayer.layerName;
export const url = pulumi.interpolate`${deployment.invokeUrl}/${path}`;
