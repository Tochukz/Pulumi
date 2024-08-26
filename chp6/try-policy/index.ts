import { AwsGuard } from "@pulumi/awsguard";

// new AwsGuard({ all: "advisory" });
new AwsGuard({ all: "mandatory" });
