/**
 * parse string value to version description model
 *
 * @param string
 * @returns {{full, fullVersion, prefix, version, productionIndex, sprintIndex,
 *   releaseIndex, data}} | null
 */

const pattern = new RegExp('^((v)?(([0-9]+).([0-9]+).([0-9]+)))([a-z0-9-]+)?');

module.exports = function getTagVersion(string) {
  string = String(string).trim();
  const match = String(string).match(pattern);
  if (!match) {
    return null;
  }
  const [
    full,
    fullVersion,
    prefix,
    version,
    productionIndex,
    sprintIndex,
    releaseIndex,
    data
  ] = match;
  return {
    full,
    fullVersion,
    prefix,
    version,
    productionIndex,
    sprintIndex,
    releaseIndex,
    data
  };
};
