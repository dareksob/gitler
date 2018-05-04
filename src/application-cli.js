#!/usr/bin/env node
const application = require('./application');
const commandFunctions = [
  'tag',
  'version',
  'versionRecommendation',
  'status',
  'updatePackage'
];

function execute(command, arg) {
  if (typeof application[command] === 'function') {
    application[command]().then(result => {
      if (result && typeof result === 'object') {
        if (arg && result[arg]) {
          return console.log(result[arg]);
        }
      }

      console.log(result);
    });
    return true;
  } else {
    console.warn(`Unknow command, ${command}`);
  }
  return false;
}

if (process.argv.length > 2) {
  const command = process.argv[2];
  execute(command, process.argv[3]);
} else {
  const stdin = process.openStdin();

  console.log(`
Gitler Help

Available commands:
${commandFunctions.join(',')}

Tip:
Use the gitler command directly as second argument`);

  stdin.addListener('data', input => {
    const command = input.toString().trim();
    const result = execute(command);

    if (result === false) {
      process.exit();
    }
  });
}
