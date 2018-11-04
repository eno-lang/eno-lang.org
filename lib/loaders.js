const markdownIt = require('markdown-it')({ html: true });
const markdownItPrism = require('markdown-it-prism');

markdownIt.use(markdownItPrism);

exports.markdown = ({ value }) => markdownIt.render(value);
