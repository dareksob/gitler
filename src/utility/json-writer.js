const fs = require('fs');

/**
 * call shell script
 *
 * @todo not correct mechanic to use promise, a spawn is a steam of data
 * @param cmd
 * @param args
 * @returns {Promise<any>}
 */
module.exports = function jsonWriter(path, data) {
  return new Promise((resolve, reject) => {

    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFile(path, jsonString, error => {
      if (error) {
        return reject(error);
      }

      resolve({
        path,
        data,
      });
    });
  });
}