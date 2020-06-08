const markdownIt = require('markdown-it')({ html: true });
const markdownItPrism = require('markdown-it-prism');

markdownIt.use(markdownItPrism);

// Remember old renderer, if overriden, or proxy to default renderer
var defaultRender = markdownIt.renderer.rules.link_open || function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

markdownIt.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  // If you are sure other plugins can't add `target` - drop check below
  var aIndex = tokens[idx].attrIndex('target');

  if (aIndex < 0) {
    tokens[idx].attrPush(['target', '_blank']); // add new attribute
  } else {
    tokens[idx].attrs[aIndex][1] = '_blank';    // replace value of existing attr
  }

  // pass token to default renderer.
  return defaultRender(tokens, idx, options, env, self);
};

module.exports = value => markdownIt.render(value);
