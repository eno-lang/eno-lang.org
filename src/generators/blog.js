const fs = require('fs');
const moment = require('moment');
const path = require('path');

const layout = require('../layout.js');

// TODO: Possibly include the information below on the blog page (e.g. history at the end of the blog, newsletter at the start)
//       or on other pages as well (e.g. eno -> history, newsletter more prominently on frontpage).

// ## Newsletter
// Get development updates and info on new releases through the [newsletter](http://eepurl.com/dA9LcH).
//
// ## About
// Read about the history and who develops eno at [about](/about/).

module.exports = async data => {
  let content = `
    <h1>Blog</h1>

    ${data.blog.map(entry =>
      `<p><strong>${moment(entry.date).format('MMMM Do YYYY')}</strong></p>${entry.html}`
    ).join('')}
  `;

  const html = layout(data, content, 'blog', null,'/blog/');

  await fs.promises.mkdir(path.join(__dirname, `../../public/blog`));
  await fs.promises.writeFile(path.join(__dirname, `../../public/blog/index.html`), html);
};
