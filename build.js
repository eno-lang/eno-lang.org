const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

const generateBlog = require('./src/generators/blog.js');
const generateEnolibDemos = require('./src/generators/enolib-demos.js');
const generateDocs = require('./src/generators/documentation.js');
const generatePages = require('./src/generators/pages.js');
const generatePlayground = require('./src/generators/playground.js');
const source = require('./source.js');

const build = async () => {
  const data = await source();

  await fsExtra.emptyDir(path.join(__dirname, 'public'));
  await fsExtra.copy(path.join(__dirname, 'static/'), path.join(__dirname, 'public/'));

  // ace dynamic components
  await fsExtra.copy(
    path.join(__dirname, 'node_modules/ace-eno/builds/src-min-noconflict/worker-javascript.js'),
    path.join(__dirname, 'public/ace-worker-javascript.js')
  );

  await Promise.all([
    generateBlog(data),
    generateEnolibDemos(data),
    generateDocs(data),
    generatePages(data),
    generatePlayground(data)
  ]);
}

build();
