const eno = require('enojs');
const fs = require('fs');
const path = require('path');


const layout = require('../layout.js');
const { markdown } = require('../../lib/loaders.js');

module.exports = () => {
  const input = fs.readFileSync(path.join(__dirname, 'enojs.eno'), 'utf-8');
  const document = eno.parse(input, { reporter: 'terminal' });

  let main = '<h1>enojs 0.4.5</h1>';
  let sidebar = '<h1>&nbsp;</h1>';

  for(let enoClass of document.sequential()) {
    if(enoClass.name === 'intro') {
      main += enoClass.value(markdown);
      continue;
    }

    main += `<a name="${enoClass.name}"></a>`
    main += `<h2 class="class">${enoClass.name}</h2>`
    sidebar += `<div class="pad"><strong>${enoClass.name} <a href="#${enoClass.name}">#</a></strong></div>`

    for(let method of enoClass.sequential()) {
      if(method.name === 'class description') {
        main += method.value(markdown);
        continue;
      }

      main += `<a name="${enoClass.name}-${method.name}"></a>`;
      sidebar += `<a href="#${enoClass.name}-${method.name}">${method.name}</a><br/>`;

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

  const html = layout(content, 'enojs - The JavaScript eno library');

  fs.writeFileSync(path.join(__dirname, '../../public/js/index.html'), html);
};
