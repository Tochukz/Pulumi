import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();
const stack = pulumi.getStack();
const org = config.require("org");

const stackRef = new pulumi.StackReference(`${org}/shopping-cloud/${stack}`);

export const shoppingUrl = stackRef.getOutput("url");
