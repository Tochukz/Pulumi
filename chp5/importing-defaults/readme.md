# Importing Defaults.

The pforject imports default resources such as default security group and security group rules.

### Importing

**Importing default security group**

```
$ pulumi import aws:ec2/securityGroup:SecurityGroup DefaultSg sg-0a08029fea883893f
```

Copy the generated code into the `index.ts` file and save the file.  
Run pulumi up

```
$ pulumi up
```
