import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// Import using pulumi import CLI command
const simpleBucket = new aws.s3.Bucket(
  "simple-bucket",
  {
    arn: "arn:aws:s3:::simple-storage-bucket-1349",
    bucket: "simple-storage-bucket-1349",
    hostedZoneId: "Z3GKZC51ZF0DB4",
    requestPayer: "BucketOwner",
    serverSideEncryptionConfiguration: {
      rule: {
        applyServerSideEncryptionByDefault: {
          sseAlgorithm: "AES256",
        },
      },
    },
  },
  {
    protect: false,
  }
);

// Import using resource import options in code
const simpleTopic = new aws.sns.Topic(
  "simple-topic",
  {
    name: "simple-messages",
  },
  {
    import: undefined, // "arn:aws:sns:eu-west-2:665778208875:simple-messages",
    protect: false,
  }
);

export const bucket = simpleBucket.id;
export const topicArn = simpleTopic.arn;
