const fs = require('fs');
const path = require('path');
const { attrEscape } = require('../../lib/escape.js');

const layout = require('../layout.js');

// TODO: PHP examples ?!

module.exports = async data => {
  const content = `
  <h1>Interactive eno library demos</h1>

  <div class="split">
    <div class="half">
      <select class="demo" style="width: 100%;">
        ${data.demos.libraries.map(demo => `
          <option data-eno="${attrEscape(demo.eno)}"
                  data-javascript="${attrEscape(demo.javascript)}"
                  data-python="${attrEscape(demo.python)}"
                  data-ruby="${attrEscape(demo.ruby)}"
                  data-text="${attrEscape(demo.text)}">
            ${demo.title}
          </option>
        `).join('')}
      </select>

      <br/>
      <br/>

      <select class="language" style="width: 100%;">
        <option value="javascript">JavaScript - interactive enojs code and demo</option>
        <option value="python">Python - emulated enopy code, interactive demo</option>
        <option value="ruby">Ruby - emulated enorb code, interactive demo</option>
      </select>

      <div id="text">
        ${data.demos.libraries[0].text}
      </div>

      <div id="code">${data.demos.libraries[0].javascript}</div>
    </div>

    <div class="half">
      <textarea id="editor">${data.demos.libraries[0].eno}</textarea>
      <pre id="output"></pre>
    </div>

  </div>

  <script src="/demo.js"></script>
  `;

  const html = layout(data, content, 'Interactive library demos', '/demo/');

  await fs.promises.mkdir(path.join(__dirname, '../../public/demo'));
  await fs.promises.writeFile(path.join(__dirname, '../../public/demo/index.html'), html);
};
