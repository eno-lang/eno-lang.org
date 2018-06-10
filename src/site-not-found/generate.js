const fs = require('fs');
const path = require('path');
const markdownIt = require('markdown-it')();

const layout = require('../layout.js');

module.exports = () => {
  const html = layout('<br/><br/>This site has probably moved, sorry for the inconvenience.', 'Site not found', 'write');

  fs.writeFileSync(path.join(__dirname, '../../public/site-not-found/index.html'), html);
};
