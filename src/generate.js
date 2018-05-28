const fs = require('fs');
const path = require('path');
const markdownIt = require('markdown-it')();

const layout = require('./layout.js');

module.exports = () => {
  const input = fs.readFileSync(path.join(__dirname, 'index.md'), 'utf-8');

  let main = markdownIt.render(input);

  main += '<br/><br/>';

  const content = `
    <div class="docs">
      <div class="main">
        ${main}
      </div>
    </div>
  `;

  const html = layout(content, 'eno &nbsp;-&nbsp;  A notation language for everyone');

  fs.writeFileSync(path.join(__dirname, '../public/index.html'), html);
};
