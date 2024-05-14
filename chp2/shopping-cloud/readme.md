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

__Deployment__  
Make sure that Docker desktop is running because Docker is the chosen provider in this program.
Run `pulumi up` to deploy the resources
```bash
$ pulumi up
```
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
