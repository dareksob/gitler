const path = require('path');
const packagePath = path.resolve('package.json');
const package = require(packagePath);

function shell(cmd, args) {
  return new Promise((resolve, reject) => {
    const spawn = require('child_process').spawn;
    const child = spawn(cmd, args);
    child.stdout.on('data', buffer => {
      resolve(buffer.toString());
    });
  });
}

const pattern = new RegExp('^((v)?(([0-9]+).([0-9]+).([0-9]+)))([a-z0-9-]+)?');

function getTagVersion(string) {
  string = String(string).trim();
  const match = String(string).match(pattern);
  if (!match) {
    return null;
  }
  const [full, fullVersion, prefix, version, productionIndex, sprintIndex, releaseIndex, data] = match;
  return { full, fullVersion, prefix, version, productionIndex, sprintIndex, releaseIndex, data };
}

function updatePackage(data) {
  return new Promise((resolve, reject) => {
    const fs = require('fs');
    fs.writeFile(packagePath, JSON.stringify(data, null, 2), error => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}

const git = {
  tags() {
    return shell('git', ['tag'])
      .then(tagStrings => tagStrings.split(/\r?\n/))
      .then(tags => tags.filter(tag => tag != ''));
  },

  tag() {
    return shell('git', ['describe'])
      .then(getTagVersion);
  },
  async version() {
    const tag = await this.tag();
    return tag.version;
  },
  async versionRecommendation() {
    const package = require(packagePath);
    const tag = await this.tag();
    const currentVersion = tag.version;
    tag.releaseIndex++;

    return {
      oldVersion: currentVersion,
      newVersion: `${tag.productionIndex}.${tag.sprintIndex}.${tag.releaseIndex}`,
    };
  },

  async status() {
    const version = await this.version();
    const package = require(packagePath);

    return `
      Git version: ${version}
      Package version: ${package.version}
    `
  },
  async updatePackage() {
    const localPackage = Object.assign({}, package);
    const recommendation = await this.versionRecommendation();
    localPackage.version = `${recommendation.newVersion}`;
    await updatePackage(localPackage);

    return recommendation;
  }
};

function execute(command, arg) {
  if (typeof git[command] === 'function') {
    git[command]().then(result => {
      if (result && typeof result === 'object') {
        if (arg && result[arg]) {
          return console.log(result[arg]);
        }
      }

      console.log(result);
    });
    return true;
  }
  return false;
}

if (process.argv.length > 2) {
  const command = process.argv[2];
  const result = execute(command, process.argv[3]);
}
else {

  const stdin = process.openStdin();

  console.log(`
    Call command:
    ${Object.keys(git).join(' ')}
  `);

  stdin.addListener("data", input => {
    const command = input.toString().trim();
    const result = execute(command);

    if (result === false) {
      process.exit();
    }
  });
}