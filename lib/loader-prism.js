const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');
require('../src/prism-eno.js');

const PRISM_LANGUAGES = [
  'eno',
  'javascript',
  'php',
  'python',
  'ruby',
  'rust'
];

loadLanguages(PRISM_LANGUAGES.filter(language => language !== 'eno'));

exports.prism = language => {
  if(!PRISM_LANGUAGES.includes(language))
    throw `Prism highlighting is only supported for language identifiers ${PRISM_LANGUAGES.map(identifier => `'${identifier}'`).join(', ')}, but '${name}' was supplied.`;

  return value => {
    const highlighted = Prism.highlight(value, Prism.languages[language]);
    return `<pre class="language-${language}"><span class="extension">${language}</span><code class="language-${language}">${highlighted}</code></pre>`;
  };
};

exports.PRISM_LANGUAGES = PRISM_LANGUAGES;
