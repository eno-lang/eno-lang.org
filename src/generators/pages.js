const fs = require('fs');
const fsExtra = require('fs-extra');
const moment = require('moment');
const path = require('path');

const layout = require('../layout.js');

module.exports = async data => {
  for(const page of data.pages) {
    let html = layout(data, page.html, page.title);

    await fsExtra.ensureDir(path.join(__dirname, '../../public', page.url));
    await fs.promises.writeFile(path.join(__dirname, '../../public/', page.url , 'index.html'), html);
  }
};
