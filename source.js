const enolib = require('enolib');
const { date } = require('enotype');
const { TerminalReporter } = require('enolib');
const glob = require('fast-glob');
const fs = require('fs');
const markdown = require('./lib/loader-markdown.js');
const { prism, PRISM_LANGUAGES } = require('./lib/loader-prism.js');
const path = require('path');
const slug = require('speakingurl');

enolib.register({ date, markdown });

const blog = async () => {
  const input = await fs.promises.readFile(path.join(__dirname, 'content/blog.eno'), 'utf-8');
  const document = enolib.parse(input, { reporter: TerminalReporter, source: 'content/blog.eno' });

  const blog = document.fields().map(entry => ({
    date: entry.dateKey(),
    html: entry.requiredMarkdownValue()
  }));

  document.assertAllTouched();

  return blog;
};

const documentation = async () => {
  const documentation = [];
  const files = await glob('**/*.eno', { cwd: path.join(__dirname, 'content/documentation/') });

  for(const file of files) {
    const base = file.replace('.eno', '');
    const filepath = path.join(__dirname, 'content/documentation/', file);
    const input = await fs.promises.readFile(filepath, 'utf-8');
    const document = enolib.parse(input, { reporter: TerminalReporter, source: filepath });

    documentation.push({
      chapters: document.section('chapters').sections().map(chapter => ({
          description: chapter.field('description').requiredMarkdownValue(),
          subchapters: chapter.section('subchapters').sections().map(subchapter => ({
            description: subchapter.field('description').requiredMarkdownValue(),
            title: subchapter.stringKey(),
            url: `/${base}/${slug(chapter.stringKey())}/${slug(subchapter.stringKey())}/`
          })),
          title: chapter.stringKey(),
          url: `/${base}/${slug(chapter.stringKey())}/`
      })),
      intro: document.field('intro').requiredMarkdownValue(),
      title: document.field('title').requiredStringValue(),
      url: `/${base}/`
    });

    document.assertAllTouched();
  }

  return documentation;
};

const languageDemos = async () => {
  const input = await fs.promises.readFile(path.join(__dirname, 'content/demos/eno.eno'), 'utf-8');
  const document = enolib.parse(input, { reporter: TerminalReporter, source: 'content/demos/eno.eno' });

  const demos = document.sections().map(groupSection => ({
    examples: groupSection.sections().map(exampleSection => ({
      eno: exampleSection.field('eno').requiredStringValue(),
      title: exampleSection.stringKey()
    })),
    title: groupSection.stringKey()
  }));

  document.assertAllTouched();

  return demos;
};

const librariesDemos = async () => {
  const input = await fs.promises.readFile(path.join(__dirname, 'content/demos/enolib.eno'), 'utf-8');
  const document = enolib.parse(input, { reporter: TerminalReporter, source: 'content/demos/enolib.eno' });

  const demos = document.sections().map(demo => ({
    eno: demo.field('eno').requiredStringValue(),
    javascript: demo.field('javascript').requiredStringValue(),
    python: demo.field('python').requiredStringValue(),
    ruby: demo.field('ruby').requiredStringValue(),
    text: demo.field('markdown').requiredMarkdownValue(),
    title: demo.stringKey()
  }));

  document.assertAllTouched();

  return demos;
};

const menu = async () => {
  const input = await fs.promises.readFile(path.join(__dirname, 'content/menu.eno'), 'utf-8');
  const document = enolib.parse(input, { reporter: TerminalReporter, source: 'content/menu.eno' });

  const menu = document.sections().map(section => ({
    name: section.field('name').requiredStringValue(),
    pages: section.list('pages').requiredStringValues(),
    url: section.stringKey()
  }));

  document.assertAllTouched();

  return menu;
};

const pages = async () => {
  const pages = [];
  const files = await glob('**/*.eno', { cwd: path.join(__dirname, 'content/pages/') });

  for(let file of files) {
    const input = await fs.promises.readFile(path.join(__dirname, 'content/pages/', file), 'utf-8');
    const document = enolib.parse(input, { reporter: TerminalReporter, source: file });

    pages.push({
      breadcrumb: document.field('breadcrumb').optionalStringValue(),
      html: document.section('content').elements().map(blockElement => {
        const name = blockElement.stringKey();

        if(name === 'html') {
          return blockElement.toField().requiredStringValue();
        } else if(name === 'poster') {
          const poster = blockElement.toSection();
          const title = poster.field('title').requiredStringValue();

          let code = '';
          if(poster.optionalField('eno')) {
            code = poster.field('eno').requiredValue(prism('eno'));
          } else if(poster.optionalField('javascript')) {
            code = poster.field('javascript').requiredValue(prism('javascript'));
          }

          return `
            <div class="poster folded">
              <div class="headline">
                <span>${title}</span>
                ${poster.fieldsets('platform').map(platform => `
                  <a href="${platform.entry('url').requiredStringValue()}" target="_blank">
                    <img src="${platform.entry('logo').requiredStringValue()}" title="${platform.entry('label').requiredStringValue()}" />
                  </a>
                `).join('')}
              </div>
              <div>
                ${poster.field('tagline').requiredStringValue()} <a class="unfold" onclick="document.querySelector('#${title.replace(/ /, '-')}-details').classList.toggle('folded');">More</a>
              </div>

              <div class="details folded" id="${title.replace(/ /, '-')}-details">
                ${code}
                <div>${poster.field('description').requiredMarkdownValue()}</div>
              </div>
            </div>
          `;
        } else if(name === 'markdown') {
          return blockElement.toField().requiredMarkdownValue();
        } else if(name === 'footnotes') {
          return blockElement.toField().requiredMarkdownValue();
        } else if(name === 'single') {
          const element = blockElement.toSection().element();
          const markdown = element.toField().requiredMarkdownValue();

          if(element.stringKey() === 'markdown')
            return markdown;

          return `<div class="footnotes">${markdown}</div>`;
        } else if(name.startsWith('columns-')) {
          return `
            <div class="${name}">
              ${blockElement.toSection().fields().map(column => `
                <div>${column.requiredMarkdownValue()}</div>
              `).join('')}
            </div>
          `;
        }
      }).join(''),
      title: document.field('title').requiredStringValue(),
      url: file === 'index.eno' ? '/' : `/${file.substring(0, file.length - 4)}/`
    });

    document.assertAllTouched();
  }

  return pages;
};

module.exports = async () => {
  const data = {
    blog: await blog(),
    demos: {
      language: await languageDemos(),
      libraries: await librariesDemos()
    },
    documentation: await documentation(),
    menu: await menu(),
    pages: await pages()
  };

  return data;
};
