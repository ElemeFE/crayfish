const path = require('path');
const promisify = require('es6-promisify');
const mkdirp = promisify(require('mkdirp'));
const fs = require('fs');
const writeFile = promisify(fs.writeFile);

const publishMockRoot = require('../../config').publishMockRoot || '';

exports.put = (key, data, mime) => {
  let filePath = path.join(publishMockRoot, key) + '.crayfish';
  let parentPath = path.dirname(filePath);
  return mkdirp(parentPath)
    .then(() => writeFile(filePath, data));
};
