const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);
const db = {};
// generate [[name, handler]] pairs
fs.readdirSync(__dirname)
  .filter((file) => file !== basename)
  // .map((file) => [path.basename(file, '.js'), require(`./${file}`)]);
  .forEach((file) => {
    const name = path.basename(file, '.js');
    const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);
    db[nameCapitalized] = require(`./${file}`);
  });

module.exports = db;
