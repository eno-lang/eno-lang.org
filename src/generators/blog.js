const fs = require('fs');
const moment = require('moment');
const path = require('path');

const layout = require('../layout.js');

module.exports = async blog => {
  let content = `
    <h1>Eno Blog</h1>

    ${blog.map(entry =>
      `<p><strong>${moment(entry.date).format('MMMM Do YYYY')}</strong></p>${entry.html}`
    ).join('')}
  `;

  const html = layout(content, 'Eno Blog');

  await fs.promises.mkdir(path.join(__dirname, `../../public/blog`));
  await fs.promises.writeFile(path.join(__dirname, `../../public/blog/index.html`), html);
};
