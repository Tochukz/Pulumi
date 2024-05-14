# Shopping Cloud


### Description
This project configure stacks to support an online store.  
The main resources are Docker images and container and the provider is Docker. No cloud provider is used in the Demo.

### References
[Pulumi Fundamentals Tutorial](https://www.pulumi.com/learn/pulumi-fundamentals/create-a-pulumi-project/)  
[Workload Code](https://github.com/pulumi/tutorial-pulumi-fundamentals)  
[Code Source](https://github.com/shubhambattoo/shopping-cart)  


### Setting up the project
__Prerequisite__  
1. Docker desktop
The resources uses an already existing Docker image.  See the Github repo [Pulumi Fundamental](https://github.com/pulumi/tutorial-pulumi-fundamentals).

__Creating the project__  
```bash
$ mkdir shopping-cloud
$ cd shopping-cloud
$ pulumi new typescript
```  
Follow the prompts.   
If you want to answer yes to all prompt and use default, apply the `-y` flag.  
```bash
$ pulumi new typescript -y
```

__Installing the provider__  
```bash
$ npm install @pulumi/docker
```

__Setting up configuration__  
```bash
$ pulumi config set frontendPort 3001
$ pulumi config set backendPort 3000
$ pulumi config set mongoPort 27017
```
This creates a `Pulumi.dev.yaml` file, if it does not already exist, and adds the configurations to the file.

__Ceating new stacks__  
To create a new stack named _staging_
```bash
$ pulumi stack init staging
# List available stacks
$ pulumi stack ls
```
The newly created stack _staging_ is made the active stack. This is indicated by the astricks next the the stack's name when the stacks are listed.  
To change the active stack back to _dev_  
```
$ pulumi stack select dev
```  

__Deployment__  
Make sure that Docker desktop is running because Docker is the chosen provider in this program.
Run `pulumi up` to deploy the resources
```bash
$ pulumi up
```
If you don't want to be prompted with the yes or no question, you can use the `-y` flag.
After deployment is complete, you can view your Docker image
```bash
$ docker images
```

__Finished product__  
To checkout the application, go to `http://localhost:3001/`

__Adding a product__  
To add a new product to the online store, you can make an API call using curl.  
A bash script is already setup in `add-item.sh` to do just that.
```bash
$ ./add-item.sh
```
__Cleaning up__  
To cleanup all the resources created
```bash
$ pulumi destroy
```  
The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained.
If you want to remove the stack completely, run `stack rm` command.
```bash
$ pulumi stack rm dev
```

### Stack Reference
Stack references allow you to access the outputs of one stack from another stack. Inter-stack dependencies allow one stack to reference the outputs of another stack.  

__Setting up a secret config__  
```
$ pulumi stack select dev

$ pulumi config set mongoUsername admin
$ pulumi config set --secret mongoPassword S3cr37
```
The value of the  _mongoPassword_ will be encrypted.  
List the config to see that _mongoPassword_ is stored as secret
```bash
$ pulumi config
```
You can also see the encrypted password in the configuration file `Pulumi.dev.yaml`.

To display a secret output on the terminal
```bash
$ pulumi stack output mongoDbPassword --show-secrets 
```
