const eno = require('enojs');
const fs = require('fs');
const path = require('path');
const { attrEscape } = require('../../lib/escape.js');
const { markdown } = require('../../lib/loaders.js');

const layout = require('../layout.js');

module.exports = (menu) => {
  const input = fs.readFileSync(path.join(__dirname, 'demos.eno'), 'utf-8');
  const demos = eno.parse(input, { reporter: 'terminal' });

  let options = '';
  let first = null;

  for(let demo of demos.elements()) {
    const title = demo.name;
    const eno = demo.field('eno', { required: true });
    const js = demo.field('js', { required: true });
    const python = demo.field('python', { required: true });
    const ruby = demo.field('ruby', { required: true });
    const text = demo.field('markdown', markdown, { required: true });

    options += `
      <option data-eno="${attrEscape(eno)}"
              data-js="${attrEscape(js)}"
              data-python="${attrEscape(python)}"
              data-ruby="${attrEscape(ruby)}"
              data-text="${attrEscape(text)}">
        ${title}
      </option>
    `;

    if(!first) {
      first = {
        eno: eno,
        js: js,
        python: python,
        ruby: ruby,
        text: text
      };
    }
  }

  const content = `
  <header>
    <h1>Interactive eno library demos</h1>
  </header>

  <div class="split">
    <div class="half">
      <select class="demo" style="width: 100%;">
      ${options}
      </select>

      <br/>
      <br/>

      <select class="language" style="width: 100%;">
        <option value="javascript">JavaScript - interactive enojs code and demo</option>
        <option value="python">Python - emulated enopy code, interactive demo</option>
        <option value="ruby">Ruby - emulated enorb code, interactive demo</option>
      </select>

      <div id="text">
        ${first.text}
      </div>

      <div id="code">${first.js}</div>
    </div>

    <div class="half">
      <textarea id="editor">${first.eno}</textarea>
      <pre id="output"></pre>
    </div>

  </div>

  <script src="demo.js"></script>
  `;

  const html = layout(content, 'Interactive enojs demos', 'demo', menu);

  fs.mkdirSync(path.join(__dirname, '../../public/demo'));
  fs.writeFileSync(path.join(__dirname, '../../public/demo/index.html'), html);
};
