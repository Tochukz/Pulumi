import * as pulumi from "@pulumi/pulumi";
import * as docker from "@pulumi/docker";

import config from "./config";
const {
  frontendPort,
  backendPort,
  mongoPort,
  database,
  nodeEnvironment,
  mongoHost,
  protocol,
} = config;

const stack = pulumi.getStack();

const backendImageName = "backend";
const backend = new docker.RemoteImage(`${backendImageName}Image`, {
  name: "pulumi/tutorial-pulumi-fundamentals-backend:latest",
});

const frontendImageName = "frontend";
const frontend = new docker.RemoteImage(`${frontendImageName}Image`, {
  name: "pulumi/tutorial-pulumi-fundamentals-frontend:latest",
});

const mongoImage = new docker.RemoteImage("mongoImage", {
  name: "pulumi/tutorial-pulumi-fundamentals-database-local:latest",
});

const network = new docker.Network("network", {
  name: `services-${stack}`,
});

const mongoContainer = new docker.Container("mongoContainer", {
  name: `mongo-${stack}`,
  image: mongoImage.repoDigest,
  ports: [
    {
      internal: mongoPort,
      external: mongoPort,
    },
  ],
  networksAdvanced: [
    {
      name: network.name,
      aliases: ["mongo"],
    },
  ],
});

const backendContainer = new docker.Container(
  "backendContainer",
  {
    name: `backend-${stack}`,
    image: backend.repoDigest,
    ports: [
      {
        internal: backendPort,
        external: backendPort,
      },
    ],
    envs: [
      `NODE_ENV=${nodeEnvironment}`,
      `DATABASE_HOST=${mongoHost}`,
      `DATABASE_NAME=${database}`,
    ],
    networksAdvanced: [
      {
        name: network.name,
      },
    ],
  },
  { dependsOn: [mongoContainer] }
);

const frontendContainer = new docker.Container("frontendContainer", {
  name: `frontend-${stack}`,
  image: frontend.repoDigest,
  ports: [
    {
      internal: frontendPort,
      external: frontendPort,
    },
  ],
  envs: [
    `PORT=${frontendPort}`,
    `HTTP_PROXY=backend-${stack}:${backendPort}`,
    `PROXY_PROTOCOL=${protocol}`,
  ],
  networksAdvanced: [
    {
      name: network.name,
    },
  ],
});
