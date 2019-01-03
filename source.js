const eno = require('enojs');
const { TerminalReporter } = require('enojs');
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

const menu = async () => {
  const input = await fs.promises.readFile(path.join(__dirname, 'content/menu.eno'), 'utf-8');
  const document = eno.parse(input, { reporter: TerminalReporter, sourceLabel: 'content/menu.eno' });

  const menu = document.elements().map(section => ({ // TODO: Would need sections() accessor without name option here for better validation
    name: section.string('label'),
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

module.exports = async () => {
  const data = {
    blog: await blog(),
    menu: await menu()
  };

  return data;
};
