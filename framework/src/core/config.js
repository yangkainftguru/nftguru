const fs = require('fs');
const dotenv = require('dotenv');

const envDir = __dirname.replace('src/core', `dev.example.env`);
console.log(envDir);
const env = dotenv.parse(fs.readFileSync(envDir));

module.exports = env;
