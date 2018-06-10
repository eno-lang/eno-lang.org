const eno = require('enojs');
const fs = require('fs');
const path = require('path');


const layout = require('../layout.js');
const { markdown } = require('../../lib/loaders.js');

module.exports = () => {
  const input = fs.readFileSync(path.join(__dirname, 'documentation.eno'), 'utf-8');
  const documentation = eno.parse(input, { reporter: 'terminal' });

  const global = documentation.section('Global');

  let main = `<h1>enopy / ${global.field('version')}</h1>`;
  main += global.field('intro', markdown);

  let sidebar = '<h1>&nbsp;</h1>';

  const modules = documentation.section('Modules');

  for(let _module of modules.sequential()) {
    main += `<a name="${_module.name}"></a>`
    main += `<h2 class="class">${_module.name}</h2>`
    sidebar += `<div class="pad"><strong>${_module.name} <a href="#${_module.name}">#</a></strong></div>`

    for(let method of _module.sequential()) {
      if(method.name === 'class description') {
        main += method.value(markdown);
        continue;
      }

      main += `<a name="${_module.name}-${method.name}"></a>`;
      sidebar += `<a href="#${_module.name}-${method.name}">${method.name}</a><br/>`;

      const syntax = method.field('syntax')
      if(syntax) {
        main += `<h3 class="syntax">${syntax}</h3>`;
      }

      const description = method.field('description', markdown);
      if(description) {
        main += description;
      }

      const notation = method.field('eno');
      if(notation) {
        main += `
          <pre><span class="extension">eno</span><code class="language-eno">${notation}</code></pre>
        `;
      }

      const code = method.field('js');
      if(code) {
        main += `
          <pre><span class="extension">js</span><code class="language-js">${code}</code></pre>
        `;
      }

      const parameters = method.section('parameters', { required: false })
      if(parameters) {
        main += `<h4>Parameters</h4>`;
        for(let parameter of parameters.sequential()) {
          main += `<strong>${parameter.name}</strong>`;
          main += parameter.value(markdown);
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

  // TODO: There is an open issue with touching sections for this
  // document.assertAllTouched();

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

  const html = layout(content, 'enopy - The Python eno library', 'develop');

  fs.writeFileSync(path.join(__dirname, '../../public/python/index.html'), html);
};
