const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const { attrEscape } = require('../../lib/escape.js');

const layout = require('../layout.js');

module.exports = async demos => {
  const content = `
  <h1>Playground</h1>

  <div class="split">
    <div class="half">
      You can modify the examples as you wish - the output below is updated automatically.<br>

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
        <option disabled selected>Set a different locale¹ for errors</option>
        <option disabled>──────────</option>
        <option value="de">de - German</option>
        <option value="en">en - English</option>
        <option value="es">es - Spanish</option>
      </select>

      <br><br>

      <div id="editor">${demos[0].examples[0].eno}</div>
    </div>

    <div class="half">
      <br>

      <div class="inspector"></div>

      <div class="footnotes">
        ¹ enolib is fully localized - you are very welcome to contribute
        additional locales at <a
        href="https://github.com/eno-lang/enolib/tree/master/locales">https://github.com/eno-lang/enolib/tree/master/locales</a>!
      </div>
    </div>
  </div>

  <script src="bundle.js"></script>
  `;

  const html = layout(content, 'Eno Playground');

  await fsExtra.ensureDir(path.join(__dirname, '../../public/playground/'));
  await fs.promises.writeFile(path.join(__dirname, '../../public/playground/index.html'), html);
};
