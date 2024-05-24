# Importing resources

### Description
This configuration demonstrates how to import existing resources into a Pulumi project.

### Setup
__Import using the Pulumi CLI__  
This is for resources in a single stacked program.  
Create resource with AWS CLI
```bash
$ aws s3 mb s3://simple-storage-bucket-1349
```

Import the resource into Pulumi using `pulumi import` command
```
$ pulumi import aws:s3/bucket:Bucket simple-bucket simple-storage-bucket-1349
```  
The resource will automatically be added to the state of the selected stack.   
Copy the generated code into your `index.ts` file.


__Importing using Code__  
This is for resources of the same type in multiple Stacks.  
Create the resource using AWS CLI
```bash
$  aws sns create-topic --name simple-messages
```
Write the resource code and include the import option
```ts
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

Run Pulumi up
```
$ pulumi up
```
You can then remove the import options or set it to null.  
The next `pulumi up` operation will show no changes.  
