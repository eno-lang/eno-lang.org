const enolib = require('enolib');
const { date } = require('enotype');
const { Fieldset, List, TerminalReporter } = require('enolib');
const fastGlob = require('fast-glob');
const fs = require('fs');
const markdown = require('./lib/loader-markdown.js');
const { prism, PRISM_LANGUAGES } = require('./lib/loader-prism.js');
const path = require('path');
const slug = require('speakingurl');

enolib.register({ date, markdown });

const blog = async () => {
  const input = await fs.promises.readFile(path.join(__dirname, 'content/blog.eno'), 'utf-8');
  const document = enolib.parse(input, { reporter: TerminalReporter, sourceLabel: 'content/blog.eno' });

  const blog = document.elements().map(entry => ({ // TODO: Would need fields() accessor without name option here for better validation
    date: entry.dateKey(),
    html: entry.requiredMarkdownValue()
  }));

  document.assertAllTouched();

  return blog;
};

const documentation = async () => {
  const documentation = [];
  const files = await fastGlob(path.join(__dirname, 'content/documentation/*.eno'));

  for(let file of files) {
    const input = await fs.promises.readFile(file, 'utf-8');
    const document = enolib.parse(input, { reporter: TerminalReporter, sourceLabel: file });

    documentation.push({
      collections: document.section('collections').elements().map(collection => {
        return {
          description: collection.field('description').requiredMarkdownValue(),
          members: (() => {
            const members = collection.optionalSection('members');

            if(!members)
              return [];

            return members.elements().map(member => ({
              code: (() => {
                for(let language of PRISM_LANGUAGES.filter(language => language !== 'eno')) {
                  const code = member.optionalField(language);

                  if(code)
                    return code.requiredValue(prism(language));
                }

                return null;
              })(),
              description: member.field('description').requiredMarkdownValue(),
              name: member.stringKey(),
              notation: member.field('eno').optionalValue(prism('eno')),
              parameters: (() => {
                const parameters = member.optionalSection('parameters');

                if(!parameters)
                  return null;

                return parameters.elements().map(parameter => {
                  if(parameter instanceof Fieldset) {
                    return {
                      name: parameter.stringKey(),
                      options: parameter.entries().map(option => ({
                        description: option.requiredMarkdownValue(),
                        name: option.stringKey()
                      }))
                    };
                  } else {
                    return {
                      description: parameter.requiredMarkdownValue(),
                      name: parameter.stringKey()
                    };
                  }
                });
              })(),
              returns: (() => {
                const returns = member.optionalSection('returns');
                if(returns)
                  return returns.field('description').requiredMarkdownValue();

                return null;
              })(),
              slug: slug(member.stringKey()),
              syntaxes: (() => {
                const syntax = member.requiredElement('syntax');

                if(syntax instanceof List) {
                  return syntax.requiredStringValues();
                } else {
                  return [syntax.requiredStringValue()];
                }
              })()
            }));
          })(),
          name: collection.stringKey(),
          slug: slug(collection.stringKey())
        };
      }),
      intro: document.field('intro').requiredMarkdownValue(),
      language: document.field('language').requiredStringValue(),
      title: document.field('title').requiredStringValue(),
      version: document.field('version').requiredStringValue() // TODO: required everywhere where relevant elsewhere too
    });

    document.assertAllTouched();
  }

  return documentation;
};

const languageDemos = async () => {
  const input = await fs.promises.readFile(path.join(__dirname, 'content/demos/language.eno'), 'utf-8');
  const document = enolib.parse(input, { reporter: TerminalReporter, sourceLabel: 'content/demos/language.eno' });

  const demos = document.elements().map(group => ({ // TODO: Would need sections() accessor without name option here for better validation
    examples: group.elements().map(example => ({
      eno: example.field('eno').requiredStringValue(),  // TODO: requiredField is needed elsewhere to say "element is required, value is not"
      title: example.stringKey()
    })),
    title: group.stringKey()
  }));

  document.assertAllTouched();

  return demos;
};

const librariesDemos = async () => {
  const input = await fs.promises.readFile(path.join(__dirname, 'content/demos/libraries.eno'), 'utf-8');
  const document = enolib.parse(input, { reporter: TerminalReporter, sourceLabel: 'content/demos/libraries.eno' });

  const demos = document.elements().map(demo => ({ // TODO: Would need sections() accessor without name option here for better validation
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
  const document = enolib.parse(input, { reporter: TerminalReporter, sourceLabel: 'content/menu.eno' });

  const menu = document.elements().map(section => ({ // TODO: Would need sections() accessor without name option here for better validation
    name: section.field('name').requiredStringValue(),
    pages: section.fieldset('pages').entries().map(page => ({
      name: page.requiredStringValue(),
      url: page.stringKey()
    })),
    tagline: section.field('tagline').requiredStringValue(),
    url: section.stringKey()
  }));

  document.assertAllTouched();

  return menu;
};

const pages = async () => {
  const pages = [];
  const files = await fastGlob(path.join(__dirname, 'content/pages/*.eno'));

  for(let file of files) {
    const input = await fs.promises.readFile(file, 'utf-8');
    const document = enolib.parse(input, { reporter: TerminalReporter, sourceLabel: file });

    pages.push({
      html: document.section('content').elements().map(block => {
        const name = block.stringKey();

        if(name === 'markdown') {
          return block.requiredMarkdownValue();
        } else if(name === 'single') {
          return block.field('markdown').requiredMarkdownValue();
        } else if(name.startsWith('columns-')) {
          return `
            <div class="${name}">
              ${block.elements().map(column => `
                <div>${column.requiredMarkdownValue()}</div>
              `).join('')}
            </div>
          `;
        }
      }).join(''),
      permalink: path.basename(file, '.eno'),
      title: document.field('title').requiredStringValue()
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
