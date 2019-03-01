const fs = require('fs');
const fsExtra = require('fs-extra');
const moment = require('moment');
const path = require('path');

const layout = require('../layout.js');

module.exports = async data => {
  for(let page of data.pages) {

    if(page.url === '/') {
      const lastUpdate = `
        <div class="info_badge margin">
          🎉 Last blog update: <a href="/blog/">${moment(data.blog[0].date).format('MMMM Do, YYYY')} - Read what's new.</a>
        </div>
      `;

      const html = layout(data, lastUpdate + page.html, page.title, page.breadcrumb, page.url);

      await fs.promises.writeFile(path.join(__dirname, `../../public/index.html`), html);
    } else {
      const html = layout(data, page.html, page.title, page.breadcrumb, page.url);

      await fsExtra.ensureDir(path.join(__dirname, '../../public', page.url));
      await fs.promises.writeFile(path.join(__dirname, '../../public/', page.url , 'index.html'), html);
    }
  }
};
