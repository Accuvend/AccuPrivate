const fs = require('fs');

// Function to read and parse the contents of a .env file
function parseEnvFile(filePath) {
  const contents = fs.readFileSync(filePath, 'utf8');
  const lines = contents.split('\n');
  const keyValuePairs = {};
  lines.forEach((line) => {
    const [key, value] = line.split('=');
    if (key && value) {
      keyValuePairs[key.trim()] = value.trim();
    }
  });
  return keyValuePairs;
}

// Function to compare two .env files
function compareEnvFiles(fileAPath, fileBPath) {
  const envA = parseEnvFile(fileAPath);
  const envB = parseEnvFile(fileBPath);
  const missingKeys = [];
  // Check if each key in file A exists in file B
  Object.keys(envA).forEach((key) => {
    if (!(key in envB)) {
      missingKeys.push(key);
    }
  });
  return missingKeys;
}

// Usage example
const fileAPath = './1.env';
const fileBPath = './.env';
const missingKeys = compareEnvFiles(fileAPath, fileBPath);
console.log(missingKeys)
if (missingKeys.length === 0) {
  console.log('All content in file A is also present in file B.');
} else {
  console.log('The following keys from file A are missing in file B:', missingKeys);
}