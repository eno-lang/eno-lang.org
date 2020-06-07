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

const enolibPlayground = async () => {
  const input = await fs.promises.readFile(path.join(__dirname, 'content/enolib_playground.eno'), 'utf-8');
  const document = enolib.parse(input, { reporter: TerminalReporter, source: 'content/enolib_playground.eno' });

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

const home = async () => {
  const file = path.join(__dirname, 'content/home.eno');
  const input = await fs.promises.readFile(file, 'utf-8');
  const document = enolib.parse(input, { reporter: TerminalReporter, source: file });

  const home = document.elements().map(blockElement => {
    const name = blockElement.stringKey();

    if(name === 'html') {
      return blockElement.toField().requiredStringValue();
    } else if(name === 'markdown') {
      return blockElement.toField().requiredMarkdownValue();
    }
  }).join('');

  document.assertAllTouched();

  return home;
};

const playground = async () => {
  const input = await fs.promises.readFile(path.join(__dirname, 'content/playground.eno'), 'utf-8');
  const document = enolib.parse(input, { reporter: TerminalReporter, source: 'content/playground.eno' });

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


module.exports = async () => {
  return {
    blog: await blog(),
    documentation: await documentation(),
    enolibPlayground: await enolibPlayground(),
    home: await home(),
    playground: await playground()
  };
};
