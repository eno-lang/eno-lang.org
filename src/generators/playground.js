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
    <meta name="description" content="Eno Playground">

    <title>Eno Playground</title>

    <link href="/common.css" rel="stylesheet">
    <link href="/playground.css" rel="stylesheet">

    <script defer src="bundle.js"></script>
  </head>

  <body>
    <div class="site">
      <div class="header">
        <div>
          <select class="demo">
            <option disabled selected>Browse Demos</option>
            <option disabled>──────────</option>
            ${demos.map(group => `
              <optgroup label="${group.title}">
                ${group.examples.map(example => `
                  <option data-eno="${attrEscape(example.eno)}">
                    ${example.title}
                  </option>
                `).join('')}
              </optgroup>
            `).join('')}
          </select>

          <select class="locale">
            <option disabled selected>Set a different locale for errors</option>
            <option disabled>──────────</option>
            <option value="de">German (de)</option>
            <option value="en">English (en)</option>
            <option value="es">Spanish (es)</option>
          </select>
        </div>

        <h1>Eno Playground</h1>
      </div>

      <div class="split">
        <div class="editor">
          <div id="editor">${demos[0].examples[0].eno}</div>
        </div>

        <div class="inspector"></div>
      </div>
    </div>
  </body>
</html>
  `.trim();

  await fsExtra.ensureDir(path.join(__dirname, '../../public/playground/'));
  await fs.promises.writeFile(path.join(__dirname, '../../public/playground/index.html'), html);
};
