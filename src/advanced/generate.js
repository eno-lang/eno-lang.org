const fs = require('fs');
const path = require('path');
const markdownIt = require('markdown-it')({ html: true });

const layout = require('../layout.js');

module.exports = () => {
  const input = fs.readFileSync(path.join(__dirname, 'index.md'), 'utf-8');

  const content = markdownIt.render(input);

  const html = layout(content, 'Advanced Features', 'write');

  fs.writeFileSync(path.join(__dirname, '../../public/advanced/index.html'), html);
};
