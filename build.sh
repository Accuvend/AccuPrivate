
npm run build
cp package.json dist/package.json
ls ./src/utils/Email/templates && cp -r src/utils/Email/templates dist/utils/Email/  && rm -f ./dist/utils/Email/templates/index.ts  && ls ./dist/utils/Email/templates
cp newrelic.js ./dist/newrelic.js
rm -rf dist.zip
zip -r dist.zip dist