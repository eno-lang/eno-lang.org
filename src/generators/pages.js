const fs = require('fs');
const path = require('path');

const layout = require('../layout.js');

module.exports = async data => {
  for(let page of data.pages) {
    const html = layout(data, page.html, page.title, page.permalink === 'index' ? '/' : `/${page.permalink}/`);

    if(page.permalink === 'index') {
      await fs.promises.writeFile(path.join(__dirname, `../../public/index.html`), html);
    } else {
      await fs.promises.mkdir(path.join(__dirname, `../../public/${page.permalink}`));
      await fs.promises.writeFile(path.join(__dirname, `../../public/${page.permalink}/index.html`), html);
    }
  }
};
