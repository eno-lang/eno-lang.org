const eno = require('enojs');
const { Fieldset } = require('enojs');
const fs = require('fs');
const fsExtra = require('fs-extra');
const glob = require('glob');
const path = require('path');

const generateDemo = require('./src/demo/generate.js');
const layout = require('./src/layout.js');
const { markdown } = require('./lib/loaders.js');
const { htmlEscape } = require('./lib/escape.js');

const configFile = fs.readFileSync(path.join(__dirname, 'src/configuration.eno'), 'utf-8');
const config = eno.parse(configFile, { reporter: 'terminal', sourceLabel: 'src/configuration.eno' });
const menu = config.section('menu');

fsExtra.emptyDirSync(path.join(__dirname, 'public'));
fsExtra.copy(path.join(__dirname, 'static/'), path.join(__dirname, 'public/'))

generateDemo(menu);

glob('src/pages/*.eno', (err, files) => {
  for(let file of files) {
    const input = fs.readFileSync(file, 'utf-8');
    const page = eno.parse(input, { reporter: 'terminal', sourceLabel: file });

    let rendered = '';

    const content = page.section('content');

    for(let element of content.elements()) {
      if(element.name === 'markdown') {
        rendered += element.value(markdown);
      } else if(element.name === 'single') {
        rendered += element.field('markdown', markdown);
      } else if(element.name === 'split') {
        rendered += `
          <div class="split">
            ${element.elements().map(element => `
              <div class="half">${element.value(markdown)}</div>
            `).join('')}
          </div>
        `;
      } else if(element.name === 'tripled') {
        rendered += `
          <div class="tripled">
            ${element.elements().map(element => `
              <div class="third">${element.value(markdown)}</div>
            `).join('')}
          </div>
        `;
      }
    }

    const fileName = path.basename(file, '.eno');

    const html = layout(rendered, page.string('title'), fileName === 'index' ? '/' : `/${fileName}/`, menu);

    if(fileName === 'index') {
      fs.writeFileSync(path.join(__dirname, `public/index.html`), html);
    } else {
      fs.mkdirSync(path.join(__dirname, `public/${fileName}`));
      fs.writeFileSync(path.join(__dirname, `public/${fileName}/index.html`), html);
    }

    page.assertAllTouched();
  }
});

glob('src/docs/*.eno', (err, files) => {
  for(let file of files) {
    const input = fs.readFileSync(file, 'utf-8');
    const documentation = eno.parse(input, { reporter: 'terminal', sourceLabel: file });

    let main = documentation.field('intro', markdown);
    let sidebar = '<h1>&nbsp;</h1>';

    const modules = documentation.section('Modules');

    for(let _module of modules.elements()) {
      main += `<a name="${_module.name}"></a>`
      main += `<h2 class="class">${_module.name}</h2>`
      sidebar += `<div class="pad"><strong>${_module.name} <a href="#${_module.name}">#</a></strong></div>`

      for(let method of _module.elements()) {
        if(method.name === 'class description') {
          main += method.value(markdown);
          continue;
        }

        main += `<a name="${_module.name}-${method.name}"></a>`;
        sidebar += `<a href="#${_module.name}-${method.name}">${method.name}</a><br/>`;

        const syntax = method.string('syntax')
        if(syntax) {
          main += `<h3 class="syntax">${syntax}</h3>`;
        }

        const description = method.field('description', markdown);
        if(description) {
          main += description;
        }

        const notation = method.string('eno');
        if(notation) {
          main += `
            <pre><span class="extension">eno</span><code class="language-eno">${notation}</code></pre>
          `;
        }

        const js = method.string('js');
        if(js) {
          main += `
            <pre><span class="extension">js</span><code class="language-js">${htmlEscape(js)}</code></pre>
          `;
        }

        const python = method.string('python');
        if(python) {
          main += `
            <pre><span class="extension">py</span><code class="language-python">${htmlEscape(python)}</code></pre>
          `;
        }

        const ruby = method.string('ruby');
        if(ruby) {
          main += `
            <pre><span class="extension">rb</span><code class="language-ruby">${htmlEscape(ruby)}</code></pre>
          `;
        }

        const parameters = method.section('parameters', { required: false })
        if(parameters) {
          main += `<h4>Parameters</h4>`;
          for(let parameter of parameters.elements()) {
            main += `<strong>${parameter.name}</strong>`;
            if(parameter instanceof Fieldset) {
              for(let option of parameter.entries()) {
                main += `<p><i>${option.name}</i></p>`;
                main += option.value(markdown);
              }
            } else {
              main += parameter.value(markdown);
            }
          }
        }

        const returnValue = method.section('return value', { required: false })
        if(returnValue) {
          const description = returnValue.field('description', markdown, { required: true });

          main += `<h4>Return value</h4>`;
          main += description;
        }

        const examples = method.section('Examples', { required: false })
        if(examples) {
          main += `<h4>Examples</h4>`;
        }
      }
    }

    main += '<br/><br/>';

    const content = `
      <div class="docs">
        <div class="sidebar">
          ${sidebar}
        </div>
        <div class="main">
          ${main}
        </div>
      </div>
    `;

    const fileName = path.basename(file, '.eno');

    const html = layout(content, documentation.string('title'), `/${fileName}/`, menu);

    fs.mkdirSync(path.join(__dirname, `public/${fileName}`));
    fs.writeFileSync(path.join(__dirname, `public/${fileName}/index.html`), html);

    documentation.assertAllTouched();
  }

  menu.assertAllTouched({ except: '/' });
});
