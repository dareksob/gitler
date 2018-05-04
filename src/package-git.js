/**
 * PackageGit and tool class to modifire and get details about your package and
 * git state
 */

const fs = require('fs');
const util = require('util');
const { shell, getTagVersion, jsonWriter } = require('./utility');

module.exports = class PackageGit {
  /**
   * @param packagePath path to package.json
   */
  constructor(packagePath) {
    this.packagePath = packagePath;
    this.load();
  }

  load() {
    this.package = require(this.packagePath);
  }

  /**
   * return all tags
   *
   * @returns {PromiseLike<Int32Array>}
   */
  tags() {
    return shell('git', ['tag'])
      .catch(console.warn)
      .then(tagStrings => tagStrings.split(/\r?\n/));
    then(tags => tags.filter(tag => tag != ''));
  }

  /**
   * get tag
   * @returns {PromiseLike<T> | Promise<T>}
   */
  tag() {
    return shell('git', ['describe'])
      .then(getTagVersion)
      .catch(console.warn);
  }

  /**
   * return current version
   *
   * @returns {Promise<*>}
   */
  async version() {
    const tag = await this.tag();
    return tag ? tag.version : 'No tag found';
  }

  /**
   * recommendation for current or next version
   *
   * @returns {Promise<{oldVersion : *, newVersion : string}>}
   */
  async versionRecommendation() {
    const tag = await this.tag();
    const currentVersion = tag.version;
    tag.releaseIndex++;

    return {
      oldVersion: currentVersion,
      newVersion: `${tag.productionIndex}.${tag.sprintIndex}.${
        tag.releaseIndex
      }`
    };
  }

  /**
   * return status as string
   *
   * @returns {Promise<string>}
   */
  async status() {
    const version = await this.version();

    return `
Git version: ${version}
Package version: ${this.package.version}
    `;
  }

  /**
   * update package
   *
   * @returns {string} new version
   */
  async updatePackage() {
    const localPackage = Object.assign({}, this.package);
    const recommendation = await this.versionRecommendation();
    localPackage.version = `${recommendation.newVersion}`;

    await jsonWriter(this.packagePath, localPackage);
    this.package = localPackage;

    return localPackage.version;
  }
};
