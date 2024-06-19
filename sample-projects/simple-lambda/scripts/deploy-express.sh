#!/bin/bash
# Filename: deploy-express.sh
# Description: Deploy Lambda function code to S3
# To upload and deploy only lambda function but not the layer, ./deploy-express.sh 0.0.1 --nolayer 

version=$1
nolayer=$2

if test -z "$version"
then
  echo "Please supply a version number as the first argument for the script e.g ./deploy-express.sh 0.0.1 --nolayer"
  exit
fi 

functionName="SimpleLambda-5ea4767"
layerName="SimpleLayer"
bucketName=local-dev-workspace

cd ../../../sample-apps/express-app

zip -q -r express.zip . -x ".*" "node_modules/*" "migrations/*" "resources/*" "seeders/*" "tmp/*" "sql/*" "output/*"

if [ -z "$nolayer" ] 
then
  mkdir nodejs
  cp package.json nodejs/
  cd nodejs
  npm install --omit=dev
  cd ../
  zip -q -r express_nodejs.zip nodejs
else
  echo "No packaging of node_modules"
fi

appSize=$(wc -c "./express.zip" | awk '{print $1}')
echo "Copying express.zip ($appSize) to S3 bucket with key: v$version/express.zip" 
aws s3 cp express.zip s3://$bucketName/v$version/express.zip 

echo "Updating lambda function..."  
aws lambda update-function-code --function-name $functionName --s3-key v$version/express.zip --s3-bucket $bucketName > express-lambda-func.json
rm express.zip

if [ -z "$nolayer" ]; then
  moduleSize=$(wc -c "./express_nodejs.zip" | awk '{print $1}')
  echo "Copying express_nodejs.zip ($moduleSize) to S3 bucket with key: v$version/express_nodejs.zip" 
  aws s3 cp express_nodejs.zip s3://$bucketName/v$version/express_nodejs.zip 

  echo "Publishing lambda layer version..."
  LayerVersionArnWithQuotes=$(aws lambda publish-layer-version --layer-name $layerName --content S3Bucket=$bucketName,S3Key=v$version/express_nodejs.zip --query LayerVersionArn)
  LayerVersionArn=$(sed -e 's/^"//' -e 's/"$//' <<<"$LayerVersionArnWithQuotes") 
  echo "LayerVersionArn=${LayerVersionArn}"

  rm -r nodejs
  rm express_nodejs.zip

  echo "Updating lambda configuration..."
  aws lambda update-function-configuration --function-name $functionName  --layers $LayerVersionArn > /dev/null  
else 
  echo "No updating of lambda layer"
fi

