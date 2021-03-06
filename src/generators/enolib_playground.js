const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const { attrEscape } = require('../../lib/escape.js');

module.exports = async demos => {
  const html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Enolib Playground">

    <title>Enolib Playground</title>

    <link href="/common.css" rel="stylesheet">
    <link href="/enolib-playground.css" rel="stylesheet">

    <script defer src="bundle.js"></script>
  </head>

  <body>
    <div class="site">
      <div class="header">
        <div>
          <select class="demo">
            <option disabled selected>Browse Demos</option>
            <option disabled>──────────</option>
            ${demos.map(demo => `
              <option data-eno="${attrEscape(demo.eno)}"
                      data-javascript="${attrEscape(demo.javascript)}"
                      data-python="${attrEscape(demo.python)}"
                      data-ruby="${attrEscape(demo.ruby)}">
                ${demo.title}
              </option>
            `).join('')}
          </select>

          <select class="language">
            <option selected value="javascript">JavaScript - interactive code and demo</option>
            <option value="python">Python - emulated code, interactive demo</option>
            <option value="ruby">Ruby - emulated code, interactive demo</option>
          </select>
        </div>

        <h1>Enolib Playground</h1>
      </div>

      <div class="split">
        <div class="code">
          <div id="code">${demos[0].javascript}</div>
        </div>

        <div class="application">
          <textarea id="input">${demos[0].eno}</textarea>
          <pre id="output"></pre>
        </div>
      </div>
    </div>
  </body>
</html>
  `.trim();

  await fsExtra.ensureDir(path.join(__dirname, '../../public/enolib-playground/'));
  await fs.promises.writeFile(path.join(__dirname, '../../public/enolib-playground/index.html'), html);
};
