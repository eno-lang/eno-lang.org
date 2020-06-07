const fs = require('fs');
const moment = require('moment');
const path = require('path');

const layout = require('../layout.js');

module.exports = async data => {
  let content = `
    <h1>Eno Development Blog</h1>

    ${data.blog.map(entry =>
      `<p><strong>${moment(entry.date).format('MMMM Do YYYY')}</strong></p>${entry.html}`
    ).join('')}
  `;

  const html = layout(data, content, 'Eno Development Blog');

  await fs.promises.mkdir(path.join(__dirname, `../../public/blog`));
  await fs.promises.writeFile(path.join(__dirname, `../../public/blog/index.html`), html);
};
