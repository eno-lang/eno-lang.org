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

const docsLayout = (docs, currentChapter, content) => `
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="title">

        <title>${currentChapter.title}</title>

        <link rel="stylesheet" href="/common.css">
        <link rel="stylesheet" href="/docs.css">
    </head>

    <body>
        <div class="docs">
            <div class="sidebar">
                <a ${currentChapter == docs ? 'class="active"' : ''} href="${docs.url}">
                    ${docs.title}
                </a>

                ${docs.chapters.map((chapter, chapterIndex) => `
                    <a ${chapter == currentChapter ? 'class="active"' : ''} href="${chapter.url}">
                        <strong>${chapterIndex + 1}.</strong> ${chapter.title}
                    </a>

                    ${chapter.subchapters.length > 0 ? `
                      <div class="indented">
                        ${chapter.subchapters.map((subchapter, subchapterIndex) => `
                          <a ${subchapter == currentChapter ? 'class="active"' : ''} href="${subchapter.url}">
                              <strong>${chapterIndex + 1}.${subchapterIndex + 1}.</strong> ${subchapter.title}
                          </a>
                          <br>
                        `).join('')}
                      </div>
                    ` : ''}
                `).join('')}
            </div>
            <div class="main">
                <div class="main_boundary padding">
                    ${content}
                </div>
            </div>
        </div>
    </body>
</html>
`.trim()

const generateIndex = async docs => {
  const html = docsLayout(docs, docs, docs.intro);

  await fsExtra.ensureDir(path.join(__dirname, '../../public', docs.url));
  await fs.promises.writeFile(path.join(__dirname, '../../public', docs.url, 'index.html'), html);
};

const generateSubchapter = async (docs, chapter, subchapter) => {
  let nextChapter;
  const nextSubchapterIndex = chapter.subchapters.indexOf(subchapter) + 1;
  if(nextSubchapterIndex < chapter.subchapters.length) {
    nextChapter = chapter.subchapters[nextSubchapterIndex];
  } else {
    const nextChapterIndex = docs.chapters.indexOf(chapter) + 1;

    if(nextChapterIndex < docs.chapters.length) {
      nextChapter = docs.chapters[nextChapterIndex];
    }
  }

  let html = `
    <h1>${subchapter.title}</h1>

    ${subchapter.description}

    ${nextChapter ? `<br>Next page: <a href="${nextChapter.url}">${nextChapter.title}</a>` : ''}
  `;

  const content = docsLayout(docs, subchapter, html);

  await fsExtra.ensureDir(path.join(__dirname, '../../public', subchapter.url));
  await fs.promises.writeFile(path.join(__dirname, '../../public', subchapter.url, 'index.html'), content);
};

const generateChapter = async (docs, chapter) => {
  for(let subchapter of chapter.subchapters) {
    await generateSubchapter(docs, chapter, subchapter);
  }

  let nextChapter;
  if(chapter.subchapters.length > 0) {
    nextChapter = chapter.subchapters[0];
  } else {
    const nextChapterIndex = docs.chapters.indexOf(chapter) + 1;

    if(nextChapterIndex < docs.chapters.length) {
      nextChapter = docs.chapters[nextChapterIndex];
    }
  }

  let html = `
    <h1>${chapter.title}</h1>

    ${chapter.description}

    ${nextChapter ? `<br>Next page: <a href="${nextChapter.url}">${nextChapter.title}</a>` : ''}
  `;

  const content = docsLayout(docs, chapter, html);

  await fsExtra.ensureDir(path.join(__dirname, '../../public', chapter.url));
  await fs.promises.writeFile(path.join(__dirname, '../../public', chapter.url, 'index.html'), content);
};

const generateLanguage = async docs => {
  await generateIndex(docs);

  for(const chapter of docs.chapters) {
    await generateChapter(docs, chapter);
  }
};

module.exports = async docs => {
  for(const language of docs) {
    await generateLanguage(language);
  }
};
