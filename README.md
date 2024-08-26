# Pulumi  
[Docs](https://www.pulumi.com/docs/)  
[CLI Reference](https://www.pulumi.com/docs/cli/)  
[Pulumi vs Terraform](https://www.pulumi.com/docs/concepts/vs/terraform/)  
[Pulumi and AWS](https://www.pulumi.com/docs/clouds/aws/)  
[Index of AWS services](https://www.pulumi.com/docs/clouds/aws/guides/aws-index-of-services/)
[Learning Pathways](https://www.pulumi.com/learn/)  
[Pulumi AWS Guide](https://www.pulumi.com/docs/clouds/aws/guides/)  
[List of AWS Services](https://www.pulumi.com/docs/clouds/aws/guides/aws-index-of-services/)  

__Basic CLI Operations__  

Operation              | Command
-----------------------|---------
Login to Pulimu Cloud  | `pulumi logout`
Logout of Pulumi Cloud | `pulumi logout`
Set default org        | `pulumi org set-default chucks-company`
View default org       | `pulumi org get-default`  
Create a stack (prompt)| `pulumi stack init`
Create a stack direct  | `pulumi stack init chucks-company/network-staging`
List stacks            | `pulumi stack ls`
Select a Stack         | `pulumi stack select chucks-company/network-dev`
Show stack output      | `pulumi stack output`
Rename current stack   | `pulumi stack rename chucks-company/network-dev`
Delete a stack         | `pulumi stack rm chucks-company/database-prod`
Set config param       | `pulumi config set database:dbName app_db`
Set config secret      | `pulumi config set database:dbPassword --secret `
Preview stack          | `pulumi preview`
Preview with policy    | `pulumi preview --policy-pack ./simple-policy`
Deploy a stack         | `pulumi up`
Deploy with policy     | `pulumi up --policy-pack ./simple-policy`
Publish a policy       | `pulumi policy publish chucks-company`

## Chapter 1: Getting started
Pulumi optionally pairs with the [_Pulumi Cloud_](https://www.pulumi.com/docs/pulumi-cloud/) to make managing infrastructure secure, reliable, and hassle-free.
To learn more about getting started with various providers, see [Getting Started](https://www.pulumi.com/docs/get-started/)   

### Getting started with AWS
[Get started with Pulumi & AWS](https://www.pulumi.com/docs/clouds/aws/get-started/)  
__Install Pulumi__  
For Mac
```
$ brew install pulumi/tap/pulumi
```
For Windows
```
> choco install pulumi
```
For  Linux
```
$ curl -fsSL https://get.pulumi.com | sh
```

__Install Language Runtime__   
Install the runtime for your chosen language.
Supported languages includes TypeScript, JavaScript, Python, Go, C#, Java and YAML.

__Configure Pulumi to access your AWS account__  
If you already configured AWS CLI, no further action is required,
otherwise, you need to export variables as follows:
```
$ export AWS_ACCESS_KEY_ID=<YOUR_ACCESS_KEY_ID>
$ export AWS_SECRET_ACCESS_KEY=<YOUR_SECRET_ACCESS_KEY>
```
With your AWS access key id and secret access key.  

__Create new project__
```
$ mkdir getting-started
$ cd getting-started
$ pulumi new aws-typescript  
```  
If you do not want to go through the login process, use the  `--generate-only` flag.  

You can also use `pulumi new` and follow the prompts to create a new Pulumi project.  

__Provision resources__  
Now to deploy your resources
```
$ pulumi up
```

If you use the `--generate-only` flag then you will need to install dependencies and run `stack init` manually
```
$ npm install
$ pulumi stack init
```

After deployment, you can access the outputs of you stack by running the `stack output` COMMAND
```
$ pulumi stack output [property-name]
```

__Clean up__  
To tear down all provisioned resources run the `destory` command.  
```
$ pulumi destroy
```
To delete the stack itself, run the `stack rm` command.
```
$ pulumi stack rm
```
This removes the stack entirely from _Pulumi Cloud_, along with all of its update history.  

__Resource__  
[Pulumi next step](https://www.pulumi.com/docs/clouds/aws/get-started/next-steps/)  
[How to Guide](https://www.pulumi.com/registry/packages/aws/how-to-guides/)  
[Pulumi Blog](https://www.pulumi.com/blog/tag/aws/)

## Chapter 2: Pulumi Fundamental Concepts
[Pulumi Fundamentals](https://www.pulumi.com/learn/pulumi-fundamentals/)    
[pulumi concepts](https://www.pulumi.com/docs/concepts/)    

## Chapter 3: Programs, Stacks, Stack References and Secrets
[Building with Pulumi](https://www.pulumi.com/learn/building-with-pulumi/)


## Chapter 4: State Management
[Managing state & backend options](https://www.pulumi.com/docs/concepts/state)

### Pulumi Login  
__Login to Pulumi Cloud for CLI access login credential__  
To login to your backend
```bash
$ pulumi login
```
This will login to the default Pulumi cloud backend.

__Login to S3 backend for CLI access__  
To login to a specific backend such as s3
```bash
# Create the S3 bucket
$ aws s3 mb s3://pulumi-dev-states
# Login to the S3
$ pulumi login s3://pulumi-dev-states
```

Alternatively, you can set the `PULUMI_BACKEND_URL` environment variable to the s3 bucket _s3://pulumi-dev-states_.  
Or set backend property in the project `Pulumi.yaml` config file as below:
```yaml
....
backend:
  url: s3://pulumi-dev-states
....
```
After logging in, your credentials are recorded in the `~/.pulumi/credentials.json` file, and all subsequent operations will use the chosen backend.

To see what user is logged in and what backend is currently being used:
```bash
$ pulumi whoami -v
```

The `pulumi login` command takes the backend endpoint as an argument.
The backend endpoint format for common backends are as follows:

Backend              | Endpoint format
---------------------|---------------
AWS S3               | `s3://bucket-path`
Azure Blob Storage   | `azblob://container-path`
Google Cloud Storage | `gs://bucket-path`
Local File System    | `file://fs-path`

Checkpoint files are stored in a relative `.pulumi` directory in the root of the storage.  

__Login to Pulumi Cloud for CLI using Access Token__  
You can login to Pulumi using access token.
Go to your [account tokens page](app.pulumi.com/account/tokens) to generate an access token.    
Use the access token to login on your terminal:  
```bash
$ export PULUMI_ACCESS_TOKEN=<your-access-token>
$ pulumi login
```  
To persist the access token across terminal sessions, you can add the export command to your shell’s configuration file:
* For Bash: Add the line to ~/.bashrc or ~/.bash_profile.
* For Zsh: Add the line to ~/.zshrc.

__Local Filesystem__  
You can use the `--local` flag to login for local backend
```bash
$ pulumi login --local
```
In this case, your state will be stored in `~/.pulumi` default directory.

To store state files in an alternative location, specify a an absolute file path
```
$ pulumi login file:///app/data
```
This will store your state in the path `/app/data`.

You can also use a path relative to your current directory.
```bash
$ pulumi login file://./einstein
```
This will store your states in `einstein` folder in your current directory.

__AWS S3__  
```
$ pulumi login s3://bucket-name
```
The bucket-name value can include multiple folders, such as my-bucket/app/project1.
```bash
$ pulumi login s3://bucket-name/app/project1
```
This is useful when storing multiple projects’ state in the same bucket.

__Azure Blob Storage__  
To use the Azure Blob Storage backend, pass the azblob://<container-path> as your <backend-url>
```
$ pulumi login azblob://<container-path>
```
To tell Pulumi what Azure storage account to use, set the `AZURE_STORAGE_ACCOUNT` environment variable. Also, set either `AZURE_STORAGE_KEY` or `AZURE_STORAGE_SAS_TOKEN` to authorize access.

As of Pulumi CLI v3.41.1, instead of the environment variables above, Azure CLI authentication may be used by specifying the storage account in the URL like so after using az login:
```bash
$ pulumi login azblob://container-path?storage_account=account_name
```
The Azure account must have the Storage Blob Data Contributor role or an equivalent role with permissions to read, write, and delete blobs.

### Migrating Between State Backends
Moving a stack between backends isn’t as simple as merely copying its state file because the state file includes information about its backend as well as other unique information such as its encryption provider.  
Pulumi also supports migrating stacks between backends using the `pulumi stack export` and `pulumi stack import` commands.

To migrate a stack named `my-app-production` from a self-managed backend to the Pulumi Cloud backend:
```bash
# switch to the backend/stack we want to export
$ pulumi login --local
$ pulumi stack select my-app-production

# export the stack's state to a local file
$ pulumi stack export --show-secrets --file my-app-production.stack.json

# logout and login to the desired new backend
$ pulumi logout
$ pulumi login # default to Pulumi Cloud

# create a new stack with the same name on pulumi.com
$ pulumi stack init my-app-production

# import the new existing state into pulumi.com
$ pulumi stack import --file my-app-production.stack.json
````

### Checkpoints
Pulumi state is usually stored in a transactional snapshot called a checkpoint. Pulumi records checkpoints early and often as it executes so that Pulumi can operate reliably, similar to how database transactions work.
Self-managed backends may have more trouble recovering from these situations as they typically store a singular Pulumi state file.  

### Exporting and Importing State
The `pulumi stack export` and `pulumi stack import` commands can be used to export the latest or a specific version of a stack’s state. This can be used to inspect or even manually edit the contents for advanced use cases.

### State encryption salt
Pulumi may generate a _encryptionsalt_ in a stack configuration file for example in `Pulumi.dev.yaml` file. Should this be commited to source control?
Checkout the following answers:  
[Should I commit Pulumi stack files to git?](https://stackoverflow.com/questions/78154479/should-i-commit-pulumi-stack-files-to-git)  

### Pulumi Logout
To log out of your current state
```bash
$ pulumi logout
```
This will remove all credentials information from `~/.pulumi/credentials.json` and you will need to log in again before performing any subsequent stack or state operations.

## Chapter 5: Importing resources
There are two ways to impotrt existing resources into a Pulumi project:
1. Using the `pulumi import` CLI command.  
This method is suitable for projects having only one stack.
2. Using `import resource option` in code.  
This approach may be preferable in scenarios that call for importing multiple resources of the same type across multiple stacks and/or deployment environments.  

__Import using pulumi import CLI command__  
First we create a resource outside of Pulumi using AWS CLI
```bash
$ aws s3 mb s3://simple-storage-bucket-1349
```
We import the resource into Pulumi using `pulumi import` command
```bash
$ pulumi import aws:s3/bucket:Bucket simple-bucket simple-storage-bucket-1349
```  
This will add the S3 bucket resource to the state of the current stack.  
It will also generate code describing the resource’s current configuration on the terminal.
You can then copy the code into you Pulumi project.  


__Import using resource option in code__  
Let us create a resource outside of Pulumi using AWS CLI
```bash
$  aws sns create-topic --name simple-messages
```
Next, create the resource in your Pulumi code using the `import resource option`
```ts
import * as aws from "@pulumi/aws";

const simpleTopic = new aws.sns.Topic(
  "simple-topic",
  {
    name: "simple-messages",
  },
  {
    import: "arn:aws:sns:eu-west-2:665778208875:simple-messages",
    protect: true,
  }
);
```  
In this case, the `import option` in the resource configuration references the ARN of the SNS topic.   
Next, we run `pulumi up` to import the resource.  

After successfully importing a resource, you can delete the _import option_ or set it to _undefined_ if you like, then re-run `pulumi up`, and all subsequent operations will now behave as though Pulumi had provisioned the imported resource from the outset.  
If you wish to ensure that an imported resource survives through `pulumi destroy`, consider using the `retainOnDelete resource option`.

__Note__: Using the `import resource option` does not modify the state of the current stack but rather it delegates that responsibility to the program to be handled as part of the normal infrastructure lifecycle — for example, on the next `pulumi up`.   

__Destroy__  
To destroy the stack, you must do the following
1. remove the `resource protect options` or set it to false for each of the resource
2. run `pulumi up`
3. run `pulumi destory`.  

## Chapter 6: Pulumi Cross Guard  
[pulumi CrossGuard](https://www.pulumi.com/docs/using-pulumi/crossguard/)   
CrossGuard is Pulumi’s Policy as Code offering. CrossGuard empowers you to set guardrails to enforce compliance for resources so developers within an organization can provision their own infrastructure while sticking to best practices and security compliance.

### AWSGuard policies
[AWS CrossGuard](https://www.pulumi.com/docs/using-pulumi/crossguard/awsguard/)   
__Setup__  
1. Create a new `aws-typescript` project
```bash
$ mkdir simple-project
$ cd simple-project
$ pulumi new aws-typescript
```
2. Create a new `awsguard` policy pack
```bash
$ mkdir simple-policy
$ cd simple-policy
$ pulumi policy new awsguard-typescript
```
3. Modify the policy configuration as needed in `simple-policy/index.ts` file
4. Run a `preview` on you project using the policy pack
```bash
$ cd simple-project
$ pulumi preview --policy-pack ../simple-policy
```

## Architecture
[Pulumi Templates](https://www.pulumi.com/templates/)  
[Container Service Templates](https://www.pulumi.com/templates/container-service/)  
