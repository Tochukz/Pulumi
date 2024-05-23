import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const config = new pulumi.Config();
const configApiEndpoint = config.require("apiEndpoint");
const configApiKey = config.requireSecret("apiKey");

// Create an AWS resources
const bucket = new aws.s3.Bucket("simple-s3-storage");

// Export outputs
export const bucketName = bucket.id;
export const apiEndpoint = configApiEndpoint;
export const apiKey = configApiKey;
