# Simple S3 Backend

### Description
This configuration demonstrates how to setup S3 backup for the management of your Pulumi infrastructure states.

### Setup
The Backend configuration is already setup in the `Pulumi.yaml` file to use AWS S3 as the state backend.  
```yaml
backend:
  url: s3://pulumi-dev-states
```

__Login__  
Login to the backend
```bash
$ pulumi login
```
You will be asked to provide a passphrase that will be used to encrypt your configuration secrets.

You may keep your passphrase safe in a file that should not be commited to source control such as a `dev-env.sh` file.

__Stack Config__  
Set the config variable for the current stack
```bash
$ pulumi config set apiEndpoint https://test.api.com
$ pulumi config set apiKey --secret
```
You will be prompted to enter the _apiKey_ secret variable.  

__Deploy__  
To deploy the infrastructure, run `pulumi up`
```bash
$ pulumi up
```
You will be prompted the provide the passphrase to unencrypt your configuration secrets. You should then provide the passpharse you supplied during the login process.  

__Manage passpharse__  
As a standard operation you can manage your passpharse as follows:
1. Copy the sample-env.sh file
```bash
$ cp sample-env.sh dev-env.sh
```
Set your passpharse to the _PULUMI_CONFIG_PASSPHRASE_ variable in the file.
2. Export the variable by running the script
```bash
$ . ./dev-env.sh
$ echo $PULUMI_CONFIG_PASSPHRASE
```
This should produce the passpharse on the console.

Now you should not be prompted for the passpharse anymore since it is now set in the current terminal session.
3. Deploy you configuration
```bash
$ pulumi up
```  

__Clean up__  
To destroy all the resources you created, run `pulumi down`
```bash
$ pulumi down
```
