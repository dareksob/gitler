const { spawn } = require('child_process');

/**
 * call shell script
 *
 * @todo not correct mechanic to use promise, a spawn is a steam of data
 * @param cmd
 * @param args
 * @returns {Promise<any>}
 */
module.exports = function shell(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args);
    child.stdout.on('data', buffer => {
      resolve(buffer.toString());
    });
    child.stderr.on('data', buffer => {
      reject(buffer.toString());
    });
  });
}