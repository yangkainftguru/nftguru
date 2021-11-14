const fs = require('fs');
const dotenv = require('dotenv');

const envDir = __dirname.replace('src/libs', `dev.example.env`);
const env = dotenv.parse(fs.readFileSync(envDir));

module.exports = env;
