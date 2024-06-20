
npm run build
echo "In the build.sh"
cat .env
cp package.json dist/package.json
ls ./src/utils/Email/templates && cp -r src/utils/Email/templates dist/utils/Email/  && rm -f ./dist/utils/Email/templates/index.ts  && ls ./dist/utils/Email/templates
cp newrelic.js ./dist/newrelic.js
if [-f "./.env"]; then 
  cp .env ./dist/.env
  echo ".env file found and copied"
else
  echo ".env file does not exist"
fi
rm -rf dist.zip
zip -r dist.zip dist
