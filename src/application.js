const path = require('path');
const packagePath = path.resolve('package.json');
const PackageGit = require('./package-git');
module.exports = new PackageGit(packagePath);