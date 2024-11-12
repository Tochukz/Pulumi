import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const DefaultSg = new aws.ec2.SecurityGroup(
  "DefaultSg",
  {
    description: "default VPC security group",
    egress: [
      {
        cidrBlocks: ["0.0.0.0/0"],
        fromPort: 0,
        protocol: "-1",
        toPort: 0,
      },
    ],
    ingress: [
      {
        fromPort: 0,
        protocol: "-1",
        self: true,
        toPort: 0,
      },
    ],
    name: "default",
    vpcId: "vpc-097728e00a72ac827",
  },
  {
    protect: true,
  }
);
