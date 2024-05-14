import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();
const frontendPort = config.requireNumber("frontendPort");
const backendPort = config.requireNumber("backendPort");
const mongoPort = config.requireNumber("mongoPort");
const mongoHost = config.require("mongoHost");
const mongoUsername = config.require("mongoUsername");
const mongoPassword = config.requireSecret("mongoPassword");
const database = config.require("database");
const nodeEnvironment = config.require("nodeEnvironment");
const protocol = config.require("protocol");

export default {
  frontendPort,
  backendPort,
  mongoPort,
  mongoHost,
  mongoUsername,
  mongoPassword,
  database,
  nodeEnvironment,
  protocol,
};
