const eno  = require('enojs');
const { Fieldset, List }  = require('enojs');
const fastGlob = require('fast-glob');
const fs = require('fs');
const fsExtra = require('fs-extra');
const { markdown } = require('../../lib/loaders.js');
const path = require('path');
const slug = require('speakingurl');

const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');
require('../prism-eno.js');

const LANGUAGES = {
  javascript: 'js',
  php: 'php',
  python: 'py',
  ruby: 'rb',
  rust: 'rs'
};

loadLanguages(Object.keys(LANGUAGES));

const layout = require('../layout.js');

const docsLayout = (content, title, active, menu, sidebar) => {
  const html = `
    <div class="docs">
      <div class="sidebar">
        ${sidebar}
      </div>
      <div class="main">
        ${content}
      </div>
    </div>
  `;

  return layout(html, title, active, menu);
};

const generateIndex = async (documentation, sidebar, menu) => {
  const language = documentation.field('language', { required: true });

  const html = documentation.field('intro', markdown);

  const content = docsLayout(html, documentation.field('title'), `/${language}/`, menu, sidebar);

  await fsExtra.ensureDir(path.join(__dirname, `../../public/${language}`));
  await fs.promises.writeFile(path.join(__dirname, `../../public/${language}/index.html`), content);
};

const generateMethod = async (language, collection, member, sidebar, menu) => {
  let html = `<h1>${collection.name} » ${member.name}</h1>`;

  const syntaxElement = member.element('syntax');
  if(syntaxElement instanceof List) {
    html += `<h3>${syntaxElement.stringItems().join('<br/>')}</h3>`;
  } else {
    html += `<h3>${syntaxElement.string()}</h3>`;
  }

  const description = member.field('description', markdown);
  if(description) {
    html += description;
  }

  const notation = member.string('eno');
  if(notation) {
    html += `
      <pre class="language-eno"><span class="extension">eno</span><code class="language-eno">${Prism.highlight(notation, Prism.languages.eno)}</code></pre>
    `;
  }

  for(let [identifier, label] of Object.entries(LANGUAGES)) {
    const code = member.string(identifier);
    if(code) {
      html += `
        <pre class="language-${identifier}"><span class="extension">${identifier}</span><code class="language-${identifier}">${Prism.highlight(code, Prism.languages[identifier])}</code></pre>
      `;
    }
  }

  const parameters = member.section('parameters', { required: false })
  if(parameters) {
    html += `<h4>Parameters</h4>`;
    for(let parameter of parameters.elements()) {
      html += `<strong>${parameter.name}</strong>`;
      if(parameter instanceof Fieldset) {
        for(let option of parameter.entries()) {
          html += `<p><i>${option.name}</i></p>`;
          html += option.value(markdown);
        }
      } else {
        html += parameter.value(markdown);
      }
    }
  }

  const returnValue = member.section('return value', { required: false })
  if(returnValue) {
    const description = returnValue.field('description', markdown, { required: true });

    html += `<h4>Return value</h4>`;
    html += description;
  }

  const examples = member.section('Examples', { required: false })
  if(examples) {
    html += `<h4>Examples</h4>`;
  }

  const collectionSlug = slug(collection.name);
  const methodSlug = slug(member.name);
  const content = docsLayout(html, collection.name, `/${language}/`, menu, sidebar);

  await fsExtra.ensureDir(path.join(__dirname, `../../public/${language}/${collectionSlug}`));
  await fsExtra.ensureDir(path.join(__dirname, `../../public/${language}/${collectionSlug}/${methodSlug}`));
  await fs.promises.writeFile(path.join(__dirname, `../../public/${language}/${collectionSlug}/${methodSlug}/index.html`), content);
};

const generateCollection = async (language, collection, sidebar, menu) => {
  let html = `<h1>${collection.name}</h1>`;

  for(let member of collection.elements()) {
    if(member.name === 'class description') {
      html += member.value(markdown);
      continue;
    } else {
      await generateMethod(language, collection, member, sidebar, menu);
    }
  }

  const collectionSlug = slug(collection.name);
  const content = docsLayout(html, collection.name, `/${language}/`, menu, sidebar);

  await fsExtra.ensureDir(path.join(__dirname, `../../public/${language}`));
  await fsExtra.ensureDir(path.join(__dirname, `../../public/${language}/${collectionSlug}`));
  await fs.promises.writeFile(path.join(__dirname, `../../public/${language}/${collectionSlug}/index.html`), content);
};

const generateSidebar = documentation => {
  const language = documentation.string('language', { required: true });
  const title = documentation.string('title', { required: true });
  const version = documentation.string('version', { required: true });

  let html = `<h2><img class="logo" src="/${language}.svg" /> ${title} ${version}</h2>`;

  for(let collection of documentation.section('Modules').elements()) {
    const collectionSlug = slug(collection.name);

    html += `<div class="pad"><strong><a href="/${language}/${collectionSlug}">${collection.name}</a></strong></div>`

    for(let member of collection.elements()) {
      if(member.name !== 'class description') {
        const memberSlug = slug(member.name);

        html += `<a href="/${language}/${collectionSlug}/${memberSlug}">${member.name}</a><br/>`;
      }
    }
  }

  return html;
};

const generateLanguage = async (language, documentation, menu) => {
  const sidebar = generateSidebar(documentation);

  await generateIndex(documentation, sidebar, menu);

  for(let collection of documentation.section('Modules').elements()) {
    await generateCollection(language, collection, sidebar, menu);
  }

  documentation.assertAllTouched();
};

module.exports = async menu => {
  const files = await fastGlob('src/docs/*.eno');

  for(let file of files) {
    const input = await fs.promises.readFile(file, 'utf-8');
    const documentation = eno.parse(input, { reporter: 'terminal', sourceLabel: file });

    await generateLanguage(path.basename(file, '.eno'), documentation, menu);
  }
};
