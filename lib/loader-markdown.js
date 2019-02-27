const markdownIt = require('markdown-it')({ html: true });
const markdownItPrism = require('markdown-it-prism');

markdownIt.use(markdownItPrism);

module.exports = value => markdownIt.render(value);
