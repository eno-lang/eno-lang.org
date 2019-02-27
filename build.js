const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

const generateBlog = require('./src/generators/blog.js');
const generateDemo = require('./src/generators/demo.js');
const generateDocs = require('./src/generators/documentation.js');
const generatePages = require('./src/generators/pages.js');
const generateTryPage = require('./src/generators/try.js');
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
    generateDemo(data),
    generateDocs(data),
    generatePages(data),
    generateTryPage(data)
  ]);
}

build();
