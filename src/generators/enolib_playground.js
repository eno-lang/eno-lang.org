const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const { attrEscape } = require('../../lib/escape.js');

const layout = require('../layout.js');

module.exports = async demos => {
  const content = `
  <h1>Enolib Playground</h1>

  <div class="split">
    <div class="half">
      <select class="demo">
        <option disabled selected>Browse Demos</option>
        <option disabled>──────────</option>
        ${demos.map(demo => `
          <option data-eno="${attrEscape(demo.eno)}"
                  data-javascript="${attrEscape(demo.javascript)}"
                  data-python="${attrEscape(demo.python)}"
                  data-ruby="${attrEscape(demo.ruby)}"
                  data-text="${attrEscape(demo.text)}">
            ${demo.title}
          </option>
        `).join('')}
      </select>

      <select class="language">
        <option selected value="javascript">JavaScript - interactive code and demo</option>
        <option value="python">Python - emulated code, interactive demo</option>
        <option value="ruby">Ruby - emulated code, interactive demo</option>
      </select>

      <div id="text">
        ${demos[0].text}
      </div>

      <div id="code">${demos[0].javascript}</div>
    </div>

    <div class="half">
      <textarea id="editor">${demos[0].eno}</textarea>
      <pre id="output"></pre>
    </div>

  </div>

  <script src="bundle.js"></script>
  `;

  const html = layout(content, 'Enolib Playground');

  await fsExtra.ensureDir(path.join(__dirname, '../../public/enolib/playground/'));
  await fs.promises.writeFile(path.join(__dirname, '../../public/enolib/playground/index.html'), html);
};
