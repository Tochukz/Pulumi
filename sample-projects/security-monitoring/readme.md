# Security Monitoring

### Description

The configuration sets up cloud trail to monitor all unauthorized api calls and all login done using the root account.  
The resources deployed includes CloudTrail, CloudWatch LogGroup, S3 Bucket and SNS notification.
The CloudTrail is configured to Log API calls to CloudWatch and also storge the logs in S3 bucket.
Metric filters are configured the filter unauthorized api calls and root login actions.
The actions that meet the criteria of the metric filter are sent the the SNS topic to notify all sunscribers to the topic.
