Let me outline key CloudTrail metrics that you should monitor for security purposes.



```hcl
# IAM Related Security Metrics
resource "aws_cloudwatch_log_metric_filter" "iam_policy_changes" {
  name           = "iam-policy-changes"
  pattern        = "{ $.eventName = DeleteGroupPolicy || $.eventName = DeleteRolePolicy || $.eventName = DeleteUserPolicy || $.eventName = PutGroupPolicy || $.eventName = PutRolePolicy || $.eventName = PutUserPolicy || $.eventName = CreatePolicy || $.eventName = DeletePolicy || $.eventName = CreatePolicyVersion || $.eventName = DeletePolicyVersion || $.eventName = AttachRolePolicy || $.eventName = DetachRolePolicy || $.eventName = AttachUserPolicy || $.eventName = DetachUserPolicy || $.eventName = AttachGroupPolicy || $.eventName = DetachGroupPolicy }"
  log_group_name = aws_cloudwatch_log_group.cloudtrail_log_group.name

  metric_transformation {
    name      = "IAMPolicyChanges"
    namespace = "SecurityMetrics"
    value     = "1"
  }
}

# Network Security Changes
resource "aws_cloudwatch_log_metric_filter" "security_group_changes" {
  name           = "security-group-changes"
  pattern        = "{ $.eventName = AuthorizeSecurityGroupIngress || $.eventName = RevokeSecurityGroupIngress || $.eventName = AuthorizeSecurityGroupEgress || $.eventName = RevokeSecurityGroupEgress }"
  log_group_name = aws_cloudwatch_log_group.cloudtrail_log_group.name

  metric_transformation {
    name      = "SecurityGroupChanges"
    namespace = "SecurityMetrics"
    value     = "1"
  }
}

# Console Sign-in Failures
resource "aws_cloudwatch_log_metric_filter" "console_signin_failures" {
  name           = "console-signin-failures"
  pattern        = "{ $.eventName = ConsoleLogin && $.errorMessage = \"Failed authentication\" }"
  log_group_name = aws_cloudwatch_log_group.cloudtrail_log_group.name

  metric_transformation {
    name      = "ConsoleSignInFailures"
    namespace = "SecurityMetrics"
    value     = "1"
  }
}

# Root Account Usage
resource "aws_cloudwatch_log_metric_filter" "root_account_usage" {
  name           = "root-account-usage"
  pattern        = "{ $.userIdentity.type = Root && $.userIdentity.invokedBy NOT EXISTS && $.eventType != AwsServiceEvent }"
  log_group_name = aws_cloudwatch_log_group.cloudtrail_log_group.name

  metric_transformation {
    name      = "RootAccountUsage"
    namespace = "SecurityMetrics"
    value     = "1"
  }
}

# CloudTrail Changes
resource "aws_cloudwatch_log_metric_filter" "cloudtrail_changes" {
  name           = "cloudtrail-changes"
  pattern        = "{ $.eventName = CreateTrail || $.eventName = UpdateTrail || $.eventName = DeleteTrail || $.eventName = StartLogging || $.eventName = StopLogging }"
  log_group_name = aws_cloudwatch_log_group.cloudtrail_log_group.name

  metric_transformation {
    name      = "CloudTrailChanges"
    namespace = "SecurityMetrics"
    value     = "1"
  }
}

# KMS Key Deletion
resource "aws_cloudwatch_log_metric_filter" "kms_key_deletion" {
  name           = "kms-key-deletion"
  pattern        = "{ $.eventSource = kms.amazonaws.com && $.eventName = ScheduleKeyDeletion }"
  log_group_name = aws_cloudwatch_log_group.cloudtrail_log_group.name

  metric_transformation {
    name      = "KMSKeyDeletion"
    namespace = "SecurityMetrics"
    value     = "1"
  }
}

# S3 Bucket Policy Changes
resource "aws_cloudwatch_log_metric_filter" "s3_bucket_policy_changes" {
  name           = "s3-bucket-policy-changes"
  pattern        = "{ $.eventSource = s3.amazonaws.com && ($.eventName = PutBucketAcl || $.eventName = PutBucketPolicy || $.eventName = PutBucketCors || $.eventName = PutBucketLifecycle || $.eventName = PutBucketReplication || $.eventName = DeleteBucketPolicy || $.eventName = DeleteBucketCors || $.eventName = DeleteBucketLifecycle || $.eventName = DeleteBucketReplication) }"
  log_group_name = aws_cloudwatch_log_group.cloudtrail_log_group.name

  metric_transformation {
    name      = "S3BucketPolicyChanges"
    namespace = "SecurityMetrics"
    value     = "1"
  }
}

# VPC Changes
resource "aws_cloudwatch_log_metric_filter" "vpc_changes" {
  name           = "vpc-changes"
  pattern        = "{ $.eventName = CreateVpc || $.eventName = DeleteVpc || $.eventName = ModifyVpcAttribute || $.eventName = AcceptVpcPeeringConnection || $.eventName = CreateVpcPeeringConnection || $.eventName = DeleteVpcPeeringConnection || $.eventName = RejectVpcPeeringConnection || $.eventName = AttachInternetGateway || $.eventName = DetachInternetGateway || $.eventName = DeleteInternetGateway }"
  log_group_name = aws_cloudwatch_log_group.cloudtrail_log_group.name

  metric_transformation {
    name      = "VPCChanges"
    namespace = "SecurityMetrics"
    value     = "1"
  }
}

# Example CloudWatch Alarms for these metrics
resource "aws_cloudwatch_metric_alarm" "iam_changes_alarm" {
  alarm_name          = "iam-changes-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "IAMPolicyChanges"
  namespace           = "SecurityMetrics"
  period             = "300"
  statistic          = "Sum"
  threshold          = "0"
  alarm_description  = "This metric monitors IAM policy changes"
  alarm_actions      = [aws_sns_topic.security_alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "console_signin_failures_alarm" {
  alarm_name          = "console-signin-failures-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "ConsoleSignInFailures"
  namespace           = "SecurityMetrics"
  period             = "300"
  statistic          = "Sum"
  threshold          = "3"
  alarm_description  = "This metric monitors failed console login attempts"
  alarm_actions      = [aws_sns_topic.security_alerts.arn]
}

```

Here are the key security metrics to monitor, categorized by their security impact:

1. Identity and Access Management (IAM):
   - IAM policy changes
   - Root account usage
   - Console sign-in failures
   - Users/roles/groups creation or deletion

2. Network Security:
   - Security group changes
   - Network ACL changes
   - VPC changes
   - Internet Gateway modifications
   - VPC peering connections

3. Data Security:
   - S3 bucket policy changes
   - KMS key deletion or modification
   - CloudTrail changes
   - Encryption settings modifications

4. Infrastructure Changes:
   - EC2 instance launches/terminations
   - Route table modifications
   - API Gateway changes
   - Lambda function changes

5. Authentication/Authorization:
   - Failed API calls
   - Access denied events
   - Authentication failures
   - Authorization failures

Best practices for setting up these alarms:

1. Set appropriate thresholds:
   - For critical changes (like IAM policy modifications), set threshold to 0
   - For login failures, consider a threshold of 3-5 attempts
   - For routine changes, set based on your normal activity patterns

2. Configure different notification channels:
   - Critical changes: Immediate SMS/phone alerts
   - Important changes: Email notifications
   - Routine changes: Daily/weekly summaries

3. Implement response procedures:
   - Document response steps for each alert type
   - Assign responsible teams/individuals
   - Set up escalation paths

Would you like me to explain any specific metric pattern in more detail or help you set up specific thresholds for your use case?