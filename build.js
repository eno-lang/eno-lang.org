const eno = require('enojs');
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

const generateDemo = require('./src/generators/demo.js');
const generateDocs = require('./src/generators/docs.js');
const generatePages = require('./src/generators/pages.js');
const generateTryPage = require('./src/generators/try.js');

const build = async () => {
  await fsExtra.emptyDir(path.join(__dirname, 'public'));
  await fsExtra.copy(path.join(__dirname, 'static/'), path.join(__dirname, 'public/'));

  const configFile = await fs.promises.readFile(path.join(__dirname, 'src/configuration.eno'), 'utf-8');
  const config = eno.parse(configFile, { reporter: 'terminal', sourceLabel: 'src/configuration.eno' });
  const menu = config.section('menu');

  await Promise.all([
    generateDemo(menu),
    generateDocs(menu),
    generatePages(menu),
    generateTryPage(menu)
  ]);

  menu.assertAllTouched({ except: '/' });
}

build();
