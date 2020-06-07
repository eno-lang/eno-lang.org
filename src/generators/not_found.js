const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

const layout = require('../layout.js');

module.exports = async () => {
  const notFoundHtml = layout('This site has probably moved, sorry for the inconvenience.', 'Not Found');
  await fsExtra.ensureDir(path.join(__dirname, '../../public/not-found'));
  await fs.promises.writeFile(path.join(__dirname, '../../public/not-found/index.html'), notFoundHtml);
};
