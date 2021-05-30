/** @babel */

import path from 'path';
import fs from 'fs-plus';

export default class CtagsPath {
  constructor() {
    const packageRoot = this.getPackageRoot()
    this.command = path.join(packageRoot, 'vendor', `ctags-${process.platform}`);
    this.args = [`--options=${path.join(packageRoot, 'lib', 'ctags-config')}`];

    const ctagsPath = atom.config.get('symbols-view-plus.plusConfigurations.ctagsPath');
    if (ctagsPath) {
      this.command = ctagsPath;
      this.args = [];
    }

    const extraCommandArguments = atom.config.get('symbols-view-plus.plusConfigurations.extraCommandArguments');
    if (extraCommandArguments) {
      this.args.push(...extraCommandArguments.split(' '));
    }
    this.args.push('--fields=+K');
  }

  getCommand() {
    return this.command
  }

  getArgs() {
    return this.args
  }

  getPackageRoot() {
    const {
      resourcePath
    } = atom.getLoadSettings();
    const currentFileWasRequiredFromSnapshot = !fs.isAbsolute(__dirname);
    const packageRoot = currentFileWasRequiredFromSnapshot ?
      path.join(resourcePath, 'node_modules', 'symbols-view-plus') :
      path.resolve(__dirname, '../..');

    if (path.extname(resourcePath) === '.asar' && packageRoot.indexOf(resourcePath) === 0) {
      return path.join(`${resourcePath}.unpacked`, 'node_modules', 'symbols-view-plus');
    } else {
      return packageRoot;
    }
  }

}