# Pulumi  
[Docs](https://www.pulumi.com/docs/)  
[GitHub](https://github.com/pulumi/pulumi)  
[Pulumi vs Terraform](https://www.pulumi.com/docs/concepts/vs/terraform/)  

## Chapter 1: Getting started
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

__Provision resources__  
Now to deploy your resources
```
$ pulumi up
```

If you user the `--generate-only` flag then you will need to install dependencies and run `stack init` manually
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
$
```
This removes the stack entirely from _Pulumi Cloud_, along with all of its update history.  

__Resource__  
[Pulumi next step](https://www.pulumi.com/docs/clouds/aws/get-started/next-steps/)  
[How to Guide](https://www.pulumi.com/registry/packages/aws/how-to-guides/)  
[Pulumi Blog](https://www.pulumi.com/blog/tag/aws/)

## Chapter 2: Pulumi Concepts
[Pulumi Fundamentals](https://www.pulumi.com/learn/pulumi-fundamentals/)   
[pulumi concepts](https://www.pulumi.com/docs/concepts/)    


## Architecture
[Pulumi Templates](https://www.pulumi.com/templates/)  
[Container Service Templates](https://www.pulumi.com/templates/container-service/)  
