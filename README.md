# Pulumi  
[Docs](https://www.pulumi.com/docs/)  
[Pulumi vs Terraform](https://www.pulumi.com/docs/concepts/vs/terraform/)  

## Getting started
Pulumi optionally pairs with the [_Pulumi Cloud_](https://www.pulumi.com/docs/pulumi-cloud/) to make managing infrastructure secure,
reliable, and hassle-free.
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
Install you the runtime for your chosen language.
Supported languages includes TypeScript, JavaScript, Python, Go, C#, Java and YAML.

__Configure Pulumi to access your AWS account__  
If you already configured AWS CLI, no further action is required,
otherwise, you need to export variables as follows:
```
$ export AWS_ACCESS_KEY_ID=<YOUR_ACCESS_KEY_ID>
$ export AWS_SECRET_ACCESS_KEY=<YOUR_SECRET_ACCESS_KEY>
```
With you AWS access key id and secret access key.  

__Create new project__
```
$ mkdir getting-started
$ cd getting-started
$ pulumi new aws-typescript  
```  
If you do not use want to go through the login process, use the  `--generate-only` flag.  
Now to deploy your resources
```
$ pulumi up
```

If you user the `--generate-only` flag then you will need to install dependencies and run initialize a stack manually
```
$ npm install
$ pulumi stack init
```
