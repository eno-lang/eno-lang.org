const markdownIt = require('markdown-it')({ html: true });

exports.markdown = ({ value }) => markdownIt.render(value);
