const eno = require('enojs');
const { TerminalReporter } = require('enojs');
const fs = require('fs');
const { markdown } = require('../../lib/loaders.js');
const moment = require('moment');
const path = require('path');

const layout = require('../layout.js');

module.exports = async menu => {
  const input = await fs.promises.readFile(path.join(__dirname, '../../content/blog.eno'), 'utf-8');
  const blog = eno.parse(input, { reporter: TerminalReporter, sourceLabel: 'content/blog.eno' });

  let rendered = '<h1>Blog</h1>';

  for(let entry of blog.elements()) {  // TODO: Would need fields() accessor without name option here
    const date = moment(entry.name);  // TODO: Loader for name would be great here to validate date the eno way :)

    rendered += `<p><strong>${date.format('dddd, MMMM D YYYY')}</strong></p>`;
    rendered += entry.value(markdown);
  }

  const html = layout(rendered, 'Blog', '/blog/', menu);

  await fs.promises.mkdir(path.join(__dirname, `../../public/blog`));
  await fs.promises.writeFile(path.join(__dirname, `../../public/blog/index.html`), html);

  blog.assertAllTouched();
};
