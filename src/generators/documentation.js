const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

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

const docsLayout = (data, content, title, activeUrl, sidebar) => {
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

  return layout(data, html, title, activeUrl);
};

const generateIndex = async (data, documentation, sidebar) => {
  const html = docsLayout(data, documentation.intro, documentation.title, `/${documentation.language}/`, sidebar);

  await fsExtra.ensureDir(path.join(__dirname, `../../public/${documentation.language}`));
  await fs.promises.writeFile(path.join(__dirname, `../../public/${documentation.language}/index.html`), html);
};

const generateMethod = async (data, documentation, collection, member, sidebar) => {
  let html = `
    <h1>${collection.name} » ${member.name}</h1>

    <h3>${member.syntaxes.join('<br>')}</h3>

    ${member.description ? member.description : ''}
    ${member.notation ? member.notation : ''}
    ${member.code ? member.code : ''}

    ${member.parameters ? `
      <h4>Parameters</h4>

      ${member.parameters.map(parameter => `
        <strong>${parameter.name}</strong>

        ${parameter.options ?
          parameter.options.map(option => `
            <p><i>${option.name}</i></p>
            ${option.description}
          `).join('')
          :
          parameter.description
        }
      `).join('')}
    ` : ''}

    ${member.returns ? `<h4>Return value</h4>${member.returns}` : ''}
  `;

  const content = docsLayout(data, html, collection.name, `/${documentation.language}/`, sidebar);

  await fsExtra.ensureDir(path.join(__dirname, `../../public/${documentation.language}/${collection.slug}`));
  await fsExtra.ensureDir(path.join(__dirname, `../../public/${documentation.language}/${collection.slug}/${member.slug}`));
  await fs.promises.writeFile(path.join(__dirname, `../../public/${documentation.language}/${collection.slug}/${member.slug}/index.html`), content);
};

const generateCollection = async (data, documentation, collection, sidebar) => {
  for(let member of collection.members) {
    await generateMethod(data, documentation, collection, member, sidebar);
  }

  let html = `
    <h1>${collection.name}</h1>

    ${collection.description}

    ${collection.members.length > 0 ? `<h3>Subpages</h3>` : ''}

    ${collection.members.map(member => `
      <a href="/${documentation.language}/${collection.slug}/${member.slug}">${member.name}</a><br>
    `).join('')}
  `;

  const content = docsLayout(data, html, collection.name, `/${documentation.language}/`, sidebar);

  await fsExtra.ensureDir(path.join(__dirname, `../../public/${documentation.language}`));
  await fsExtra.ensureDir(path.join(__dirname, `../../public/${documentation.language}/${collection.slug}`));
  await fs.promises.writeFile(path.join(__dirname, `../../public/${documentation.language}/${collection.slug}/index.html`), content);
};

const generateSidebar = documentation => {
  let html = `
    <h2>
      <img class="logo" src="/${documentation.language}.svg" /> ${documentation.title} ${documentation.version}
    </h2>

    ${documentation.collections.map(collection => `
      <div class="pad">
        <strong>
          <a href="/${documentation.language}/${collection.slug}">${collection.name}</a>
        </strong>
      </div>

      ${collection.members.map(member => `
        <a href="/${documentation.language}/${collection.slug}/${member.slug}">${member.name}</a><br>
      `).join('')}
    `).join('')}
  `;

  return html;
};

const generateLanguage = async (data, documentation) => {
  const sidebar = generateSidebar(documentation);

  await generateIndex(data, documentation, sidebar);

  for(let collection of documentation.collections) {
    await generateCollection(data, documentation, collection, sidebar);
  }
};

module.exports = async data => {
  for(let documentation of data.documentation) {
    await generateLanguage(data, documentation);
  }
};
