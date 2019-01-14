const fs = require('fs');
const moment = require('moment');
const path = require('path');

const layout = require('../layout.js');

module.exports = async data => {
  for(let page of data.pages) {

    if(page.permalink === 'index') {
      const lastUpdate = `
        <div class="info_badge margin">
          🎉 Last blog update: <a href="/blog/">${moment(data.blog[0].date).format('MMMM Do, YYYY')} - Read what's new.</a>
        </div>
      `;

      const html = layout(data, lastUpdate + page.html, page.title, page.permalink === 'index' ? '/' : `/${page.permalink}/`);

      await fs.promises.writeFile(path.join(__dirname, `../../public/index.html`), html);
    } else {
      const html = layout(data, page.html, page.title, page.permalink === 'index' ? '/' : `/${page.permalink}/`);

      await fs.promises.mkdir(path.join(__dirname, `../../public/${page.permalink}`));
      await fs.promises.writeFile(path.join(__dirname, `../../public/${page.permalink}/index.html`), html);
    }
  }
};
