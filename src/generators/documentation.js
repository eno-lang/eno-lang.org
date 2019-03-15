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

const docsLayout = (data, content, title, breadcrumb, activeUrl, sidebar) => {
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

  return layout(data, html, title, breadcrumb, activeUrl);
};

const generateIndex = async (data, documentation, sidebar) => {
  const html = docsLayout(data, documentation.intro, documentation.title, documentation.title, documentation.url, sidebar);

  await fsExtra.ensureDir(path.join(__dirname, '../../public', documentation.url));
  await fs.promises.writeFile(path.join(__dirname, '../../public', documentation.url, 'index.html'), html);
};

const generateSubchapter = async (data, documentation, chapter, subchapter, sidebar) => {
  let nextChapter;
  const nextSubchapterIndex = chapter.subchapters.indexOf(subchapter) + 1;
  if(nextSubchapterIndex < chapter.subchapters.length) {
    nextChapter = chapter.subchapters[nextSubchapterIndex];
  } else {
    const nextChapterIndex = documentation.chapters.indexOf(chapter) + 1;

    if(nextChapterIndex < documentation.chapters.length) {
      nextChapter = documentation.chapters[nextChapterIndex];
    }
  }

  let html = `
    <h1>${subchapter.title}</h1>

    ${subchapter.description}

    ${nextChapter ? `<br>Next page: <a href="${nextChapter.url}">${nextChapter.title}</a>` : ''}
  `;

  const content = docsLayout(data, html, chapter.title, documentation.title, subchapter.url, sidebar);

  await fsExtra.ensureDir(path.join(__dirname, '../../public', subchapter.url));
  await fs.promises.writeFile(path.join(__dirname, '../../public', subchapter.url, 'index.html'), content);
};

const generateChapter = async (data, documentation, chapter, sidebar) => {
  for(let subchapter of chapter.subchapters) {
    await generateSubchapter(data, documentation, chapter, subchapter, sidebar);
  }

  let nextChapter;
  if(chapter.subchapters.length > 0) {
    nextChapter = chapter.subchapters[0];
  } else {
    const nextChapterIndex = documentation.chapters.indexOf(chapter) + 1;

    if(nextChapterIndex < documentation.chapters.length) {
      nextChapter = documentation.chapters[nextChapterIndex];
    }
  }

  let html = `
    <h1>${chapter.title}</h1>

    ${chapter.description}

    ${nextChapter ? `<br>Next page: <a href="${nextChapter.url}">${nextChapter.title}</a>` : ''}
  `;

  const content = docsLayout(data, html, chapter.title, documentation.title, chapter.url, sidebar);

  await fsExtra.ensureDir(path.join(__dirname, '../../public', chapter.url));
  await fs.promises.writeFile(path.join(__dirname, '../../public', chapter.url, 'index.html'), content);
};

// TODO: Remove or re-use documentation.title below

const generateSidebar = documentation => {
  let html = `
    <!--h2>${documentation.title}</h2-->

    ${documentation.chapters.map(chapter => `
      <div class="pad">
        <strong>
          <a href="${chapter.url}">${chapter.title}</a>
        </strong>
      </div>

      ${chapter.subchapters.length > 0 ? `
        <div>
        ${chapter.subchapters.map(subchapter => `
          <a href="${subchapter.url}">${subchapter.title}</a><br>
        `).join('')}
        </div>
      ` : ''}
    `).join('')}
  `;

  return html;
};

const generateLanguage = async (data, documentation) => {
  const sidebar = generateSidebar(documentation);

  await generateIndex(data, documentation, sidebar);

  for(const chapter of documentation.chapters) {
    await generateChapter(data, documentation, chapter, sidebar);
  }
};

module.exports = async data => {
  for(const documentation of data.documentation) {
    await generateLanguage(data, documentation);
  }
};
