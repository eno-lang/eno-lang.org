const eno = require('enojs');
const { TerminalReporter } = require('enojs');
const fastGlob = require('fast-glob');
const fs = require('fs');
const { markdown } = require('./lib/loaders.js');
const path = require('path');

const blog = async () => {
  const input = await fs.promises.readFile(path.join(__dirname, 'content/blog.eno'), 'utf-8');
  const document = eno.parse(input, { reporter: TerminalReporter, sourceLabel: 'content/blog.eno' });

  const blog = document.elements().map(entry => ({ // TODO: Would need fields() accessor without name option here for better validation
    date: new Date(entry.name), // TODO: Loader for name would be great here to validate date the eno way :)
    html: entry.value(markdown)
  }));

  document.assertAllTouched();

  return blog;
};

const languageDemos = async () => {
  const input = await fs.promises.readFile(path.join(__dirname, 'content/demos/language.eno'), 'utf-8');
  const document = eno.parse(input, { reporter: TerminalReporter, sourceLabel: 'content/demos/language.eno' });

  const demos = document.elements().map(group => ({ // TODO: Would need sections() accessor without name option here for better validation
    examples: group.elements().map(example => ({
      eno: example.string('eno', { required: true }),
      title: example.name
    })),
    title: group.name
  }));

  document.assertAllTouched();

  return demos;
};

const librariesDemos = async () => {
  const input = await fs.promises.readFile(path.join(__dirname, 'content/demos/libraries.eno'), 'utf-8');
  const document = eno.parse(input, { reporter: TerminalReporter, sourceLabel: 'content/demos/libraries.eno' });

  const demos = document.elements().map(demo => ({ // TODO: Would need sections() accessor without name option here for better validation
    eno: demo.string('eno', { required: true }),
    javascript: demo.string('javascript', { required: true }),
    python: demo.string('python', { required: true }),
    ruby: demo.string('ruby', { required: true }),
    text: demo.field('markdown', markdown, { required: true }),
    title: demo.name
  }));

  document.assertAllTouched();

  return demos;
};

const menu = async () => {
  const input = await fs.promises.readFile(path.join(__dirname, 'content/menu.eno'), 'utf-8');
  const document = eno.parse(input, { reporter: TerminalReporter, sourceLabel: 'content/menu.eno' });

  const menu = document.elements().map(section => ({ // TODO: Would need sections() accessor without name option here for better validation
    name: section.string('name'),
    pages: section.fieldset('pages').elements().map(page => ({
      name: page.string(),
      url: page.name
    })),
    tagline: section.string('tagline'),
    url: section.name
  }));

  document.assertAllTouched();

  return menu;
};

const pages = async () => {
  const pages = [];
  const files = await fastGlob(path.join(__dirname, 'content/pages/*.eno'));

  for(let file of files) {
    const input = await fs.promises.readFile(file, 'utf-8');
    const document = eno.parse(input, { reporter: TerminalReporter, sourceLabel: file });

    let html = document.section('content').elements().map(block => {
      if(block.name === 'markdown') {
        return block.value(markdown);
      } else if(block.name === 'single') {
        return block.field('markdown', markdown);
      } else if(block.name.startsWith('columns-')) {
        return `
          <div class="${block.name}">
            ${block.elements().map(column => `
              <div>${column.value(markdown)}</div>
            `).join('')}
          </div>
        `;
      }
    }).join('');

    pages.push({
      html,
      permalink: path.basename(file, '.eno'),
      title: document.string('title')
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
    menu: await menu(),
    pages: await pages()
  };

  return data;
};
