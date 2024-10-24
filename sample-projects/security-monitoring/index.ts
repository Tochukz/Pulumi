import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();

const Env = config.require("Env");
const notificationEmail = config.require("notificationEmail");
const accountId = aws
  .getCallerIdentity()
  .then((identity) => identity.accountId);
const region = aws.getRegion().then((region) => region.name);
const partition = aws.getPartition().then((item) => item.partition);

const trailName = `${Env}SecurityTrail`;
const dev = Env.toLowerCase();

const cloudWatchLogGroup = new aws.cloudwatch.LogGroup(
  `${Env}CloudWatchLogGroup`,
  {
    name: `/aws/cloudtrail/${Env}SecurityAuditLogs`,
    retentionInDays: 90,
  }
);

const cloudTrailRole = new aws.iam.Role(`${Env}CloudTrailRole`, {
  name: `${Env}CloudTrailRole`,
  assumeRolePolicy: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Effect: "Allow",
        Principal: {
          Service: "cloudtrail.amazonaws.com",
        },
      },
    ],
  },
});

const cloudTrailPolicy = new aws.iam.Policy(`${Env}CloudTrailPolicy`, {
  name: `${Env}CloudTrailPolicy`,
  policy: cloudWatchLogGroup.arn.apply((logGroupArn) =>
    JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: ["logs:CreateLogStream", "logs:PutLogEvents"],
          Resource: logGroupArn,
        },
        {
          Action: [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents",
          ],
          Effect: "Allow",
          Resource: "*",
        },
      ],
    })
  ),
});

new aws.iam.RolePolicyAttachment("CloudTrailPolicyAttachment", {
  policyArn: cloudTrailPolicy.arn,
  role: cloudTrailRole.name,
});

const securityTopic = new aws.sns.Topic(`${Env}SecurityNotification`, {
  name: `${Env}SecurityNotification`,
});

new aws.sns.TopicSubscription(`${Env}SecurityNotificationSubscription`, {
  topic: securityTopic.arn,
  protocol: "email",
  endpoint: notificationEmail,
});

const cloudTrailStorage = new aws.s3.Bucket(`${Env}CloudTrailStorage`, {
  bucket: `${dev}-cloudtrail-storage`,
  forceDestroy: true,
});

const cloudTrailArn = pulumi.interpolate`arn:${partition}:cloudtrail:${region}:${accountId}:trail/${trailName}`;

new aws.s3.BucketPolicy(`${Env}CloudTrailStoragePolicy`, {
  bucket: cloudTrailStorage.bucket,
  policy: pulumi
    .all([cloudTrailStorage.arn, partition, region, accountId])
    .apply(([bucketArn, _partition, _region, _accountId]) => {
      const cloudTrailArn = `arn:${_partition}:cloudtrail:${_region}:${_accountId}:trail/${trailName}`;

      return JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "AWSCloudTrailAclCheck",
            Effect: "Allow",
            Principal: {
              Service: "cloudtrail.amazonaws.com",
            },
            Action: "s3:GetBucketAcl",
            Resource: bucketArn,
            Condition: {
              StringEquals: {
                "aws:SourceArn": cloudTrailArn,
              },
            },
          },
          {
            Sid: "AWSCloudTrailWrite",
            Effect: "Allow",
            Principal: {
              Service: "cloudtrail.amazonaws.com",
            },
            Action: "s3:PutObject",
            // Resource: `${bucketArn}/AWSLogs/${_accountId}/CloudTrail/*`,
            Resource: `${bucketArn}/AWSLogs/${_accountId}/CloudTrail/*`,
            Condition: {
              StringEquals: {
                "aws:SourceArn": cloudTrailArn,
              },
            },
          },
        ],
      });
    }),
});

new aws.cloudtrail.Trail(`${Env}SecurityTrail`, {
  name: trailName,
  s3BucketName: cloudTrailStorage.bucket,
  cloudWatchLogsGroupArn: pulumi.interpolate`${cloudWatchLogGroup.arn}:*`,
  cloudWatchLogsRoleArn: cloudTrailRole.arn,
  includeGlobalServiceEvents: true,
});

const unAuthorizedApiCalls = new aws.cloudwatch.LogMetricFilter(
  `${Env}UnAuthorizedApiCallsFilter`,
  {
    name: `${Env}UnAuthorizedApiCalls`,
    logGroupName: cloudWatchLogGroup.name,
    pattern:
      '{ ($.errorCode = "*UnauthorizedOperation") || ($.errorCode = "AccessDenied*") }',
    metricTransformation: {
      name: "UnAuthorizedApiCalls",
      namespace: "CloudTrailMetrics",
      value: "1",
    },
  }
);

const rootUserLogin = new aws.cloudwatch.LogMetricFilter(
  `${Env}RootUserLoginFilter`,
  {
    name: `${Env}RootUserLogin`,
    logGroupName: cloudWatchLogGroup.name,
    pattern: "{ $.userIdentity.type = Root }",
    metricTransformation: {
      name: "RootUserLogin",
      namespace: "CloudTrailMetrics",
      value: "1",
    },
  }
);

new aws.cloudwatch.MetricAlarm(`${Env}UnAuthorizedApiCallsAlarm`, {
  name: `${Env}UnAuthorizedApiCall`,
  comparisonOperator: "GreaterThanOrEqualToThreshold",
  evaluationPeriods: 1,
  threshold: 1,
  metricName: unAuthorizedApiCalls.metricTransformation.name,
  namespace: unAuthorizedApiCalls.metricTransformation.namespace,
  statistic: "Sum",
  period: 300,
  alarmActions: [securityTopic.arn],
});

new aws.cloudwatch.MetricAlarm(`${Env}RootUserLoginAlarm`, {
  name: `${Env}RootUserLogin`,
  comparisonOperator: "GreaterThanOrEqualToThreshold",
  evaluationPeriods: 1,
  threshold: 1,
  metricName: rootUserLogin.metricTransformation.name,
  namespace: rootUserLogin.metricTransformation.namespace,
  statistic: "Sum",
  period: 300,
  alarmActions: [securityTopic.arn],
});

export const securityTopicArn = securityTopic.arn;
