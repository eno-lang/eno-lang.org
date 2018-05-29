const htmlEscapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;'
};

exports.htmlEscape = string => string.replace(/[&<>"'\/]/g, c => htmlEscapeMap[c]);

const attrEscapeMap = {
  '"': '&quot;',
  "'": '&#39;'
};

exports.attrEscape = string => string.replace(/["']/g, c => attrEscapeMap[c]);

const attrUnescapeMap = {
  '&quot;': '"',
  '&#39;': "'"
};

exports.attrUnescape = string => string.replace(/&quot;|&#39;/g, c => attrUnescapeMap[c]);
