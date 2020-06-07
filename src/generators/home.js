const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

const layout = require('../layout.js');

module.exports = async home => {
  const homeHtml = layout(home, 'Eno');
  await fsExtra.ensureDir(path.join(__dirname, '../../public'));
  await fs.promises.writeFile(path.join(__dirname, '../../public/index.html'), homeHtml);
};
