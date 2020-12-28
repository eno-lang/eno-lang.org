const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

const generateBlog = require('./src/generators/blog.js');
const generateDocs = require('./src/generators/docs.js');
const generateEnolibPlayground = require('./src/generators/enolib_playground.js');
const generateFeed = require('./src/generators/feed.js');
const generateHome = require('./src/generators/home.js');
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
    generateBlog(data.blog),
    generateEnolibPlayground(data.enolibPlayground),
    generateDocs(data.docs),
    generateHome(data.home),
    generatePlayground(data.playground)
  ]);

  generateFeed(data.blog);
}

build();
