const fs = require('fs');
const path = require('path');
const { attrEscape } = require('../../lib/escape.js');

const layout = require('../layout.js');

module.exports = async data => {
  const content = `
  <h1>Try the language</h1>

  <div class="split">
    <div class="half">
      These are interactive demos, change anything you like and observe the output below!<br><br>

      Browse demos here, or just interactively try out things below right away.<br>
      <select class="demo" style="width: 100%;">
        ${data.demos.language.map(group => `
          <optgroup label="${group.title}">
            ${group.examples.map(example => `
              <option data-eno="${attrEscape(example.eno)}">
                ${example.title}
              </option>
            `).join('')}
          </optgroup>
        `).join('')}
      </select>

      The official eno parsers are fully localized, if errors occur they will be in the language of your choice.<br>
      <select class="locale" style="width: 100%;">
        <option value="de">German errors (de)</option>
        <option selected value="en">English errors (en)</option>
        <option value="es">Spanish errors (es)</option>
      </select>

      <br><br>

      <div id="editor">${data.demos.language[0].examples[0].eno}</div>
    </div>

    <div class="half">
      <br>

      <div class="inspector"></div>
    </div>
  </div>

  <script src="/try.js"></script>
  `;

  const html = layout(data, content, 'try the language', 'try the language', '/try/');

  await fs.promises.mkdir(path.join(__dirname, '../../public/try'));
  await fs.promises.writeFile(path.join(__dirname, '../../public/try/index.html'), html);
};
