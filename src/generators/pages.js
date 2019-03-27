const fs = require('fs');
const fsExtra = require('fs-extra');
const moment = require('moment');
const path = require('path');

const layout = require('../layout.js');

module.exports = async data => {
  for(const page of data.pages) {
    let html = layout(data, page.html, page.title, page.breadcrumb, page.url);

    if(page.url === '/') {
      const lastUpdate = `
        <div class="info_badge margin">
          🎉 Get daily to weekly release news in the <a href="/blog/">blog</a> (last update ${moment(data.blog[0].date).format('MMMM Do')}) and bimonthly updates in the <a href="http://eepurl.com/dA9LcH" target="_blank">newsletter</a>.
        </div>
      `;

      html = html.replace('LAST_UPDATE', lastUpdate);
    }

    await fsExtra.ensureDir(path.join(__dirname, '../../public', page.url));
    await fs.promises.writeFile(path.join(__dirname, '../../public/', page.url , 'index.html'), html);
  }
};
