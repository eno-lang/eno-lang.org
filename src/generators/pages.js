const eno = require('enojs');
const { TerminalReporter } = require('enojs');
const fastGlob = require('fast-glob');
const fs = require('fs');
const { markdown } = require('../../lib/loaders.js');
const path = require('path');

const layout = require('../layout.js');

module.exports = async menu => {
  const files = await fastGlob('src/pages/*.eno');

  for(let file of files) {
    const input = await fs.promises.readFile(file, 'utf-8');
    const page = eno.parse(input, { reporter: TerminalReporter, sourceLabel: file });

    let rendered = '';

    const content = page.section('content');

    for(let element of content.elements()) {
      if(element.name === 'markdown') {
        rendered += element.value(markdown);
      } else if(element.name === 'single') {
        rendered += element.field('markdown', markdown);
      } else if(element.name.startsWith('columns-')) {
        rendered += `
          <div class="${element.name}">
            ${element.elements().map(element => `
              <div>${element.value(markdown)}</div>
            `).join('')}
          </div>
        `;
      }
    }

    const fileName = path.basename(file, '.eno');

    const html = layout(rendered, page.string('title'), fileName === 'index' ? '/' : `/${fileName}/`, menu);

    if(fileName === 'index') {
      await fs.promises.writeFile(path.join(__dirname, `../../public/index.html`), html);
    } else {
      await fs.promises.mkdir(path.join(__dirname, `../../public/${fileName}`));
      await fs.promises.writeFile(path.join(__dirname, `../../public/${fileName}/index.html`), html);
    }

    page.assertAllTouched();
  }
};
