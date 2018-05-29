const markdownIt = require('markdown-it')();

exports.markdown = ({ value }) => markdownIt.render(value);
