# Simple S3 Backend

### Description
This configuration demonstrates how to setup a local state management for your Pulumi project.

### Setup
The Backend configuration is already setup in the `Pulumi.yaml` file to use the `local` folder in the root of the project to store the state files.   
```yaml
backend:
  url: file://local
```  
The `.pulumi` has also been added to `.gitignore` file to prevent the state files from being commited to source control by accident.  
