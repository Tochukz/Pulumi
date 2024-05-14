pulumi stack select dev

pulumi config set frontendPort 3001
pulumi config set backendPort 3000
pulumi config set mongoPort 27017
pulumi config set mongoHost mongodb://mongo:27017
pulumi config set database cart
pulumi config set nodeEnvironment development
pulumi config set protocol http://
pulumi config set mongoHost mongo
pulumi config set mongoUsername admin
pulumi config set --secret mongoPassword userPassword