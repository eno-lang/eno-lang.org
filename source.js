const eno = require('enojs');
const { Fieldset, List, TerminalReporter } = require('enojs');
const fastGlob = require('fast-glob');
const fs = require('fs');
const markdown = require('./lib/loader-markdown.js');
const { prism, PRISM_LANGUAGES } = require('./lib/loader-prism.js');
const path = require('path');
const slug = require('speakingurl');

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

const documentation = async () => {
  const documentation = [];
  const files = await fastGlob(path.join(__dirname, 'content/documentation/*.eno'));

  for(let file of files) {
    const input = await fs.promises.readFile(file, 'utf-8');
    const document = eno.parse(input, { reporter: TerminalReporter, sourceLabel: file });



    documentation.push({
      collections: document.section('collections').elements().map(collection => {
        return {
          description: collection.field('description', markdown, { required: true }),
          members: (() => {
            const members = collection.section('members', { required: false });

            if(members === null)
              return [];

            return members.elements().map(member => ({
              code: (() => {
                for(let language of PRISM_LANGUAGES.filter(language => language !== 'eno')) {
                  const code = member.field(language, prism);

                  if(code)
                    return code;
                }

                return null;
              })(),
              description: member.field('description', markdown),
              name: member.name,
              notation: member.field('eno', prism),
              parameters: (() => {
                const parameters = member.section('parameters', { required: false });

                if(parameters) {
                  return parameters.elements().map(parameter => {
                    if(parameter instanceof Fieldset) {
                      return {
                        name: parameter.name,
                        options: parameter.entries().map(option => ({
                          description: option.value(markdown),
                          name: option.name
                        }))
                      };
                    } else {
                      return {
                        description: parameter.value(markdown),
                        name: parameter.name
                      };
                    }
                  });
                } else {
                  return null;
                }
              })(),
              returns: (() => {
                const returns = member.section('returns', { required: false });
                if(returns)
                  return returns.field('description', markdown, { required: true });
                else
                  return null;
              })(),
              slug: slug(member.name),
              syntaxes: (() => {
                const syntax = member.element('syntax', { required: true });

                if(syntax instanceof List) {
                  return syntax.stringItems();
                } else {
                  return [syntax.string()];
                }
              })()
            }));
          })(),
          name: collection.name,
          slug: slug(collection.name)
        };
      }),
      intro: document.field('intro', markdown, { required: true }),
      language: document.string('language', { required: true }),
      title: document.string('title', { required: true }),
      version: document.string('version', { required: true }) // TODO: required everywhere where relevant elsewhere too
    });

    document.assertAllTouched();
  }

  return documentation;
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
    documentation: await documentation(),
    menu: await menu(),
    pages: await pages()
  };

  return data;
};
