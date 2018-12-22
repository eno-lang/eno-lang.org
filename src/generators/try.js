const eno = require('enojs');
const { TerminalReporter } = require('enojs');
const fs = require('fs');
const path = require('path');
const { attrEscape } = require('../../lib/escape.js');

const layout = require('../layout.js');

module.exports = async menu => {
  const input = fs.readFileSync(path.join(__dirname, '../demo/language.eno'), 'utf-8');
  const demos = eno.parse(input, { reporter: TerminalReporter });

  let options = '';
  let first = null;

  for(let group of demos.elements()) {
    options += `<optgroup label="${group.name}">`;

    for(let demo of group.elements()) {
      const title = demo.name;
      const eno = demo.string('eno', { required: true });

      options += `
        <option data-eno="${attrEscape(eno)}">
          ${title}
        </option>
      `;

      if(!first) {
        first = {
          eno,
          title
        };
      }
    }

    options += '</optgroup>';
  }

  const content = `
  <h1>Try the language</h1>

  <div class="split">
    <div class="half">
      These are interactive demos, change anything you like and observe the output below!<br><br>

      Browse demos here, or just interactively try out things below right away.<br>
      <select class="demo" style="width: 100%;">
        ${options}
      </select>

      The official eno parsers are fully localized, if errors occur they will be in the language of your choice.<br>
      <select class="locale" style="width: 100%;">
        <option value="de">German errors (de)</option>
        <option selected value="en">English errors (en)</option>
        <option value="es">Spanish errors (es)</option>
      </select>

      <br><br>

      <div id="editor">${first.eno}</div>
    </div>

    <div class="half">
      <br>

      <div class="inspector"></div>
    </div>
  </div>

  <script src="/try.js"></script>
  `;

  const html = layout(content, 'Try the language', '/try/', menu);

  await fs.promises.mkdir(path.join(__dirname, '../../public/try'));
  await fs.promises.writeFile(path.join(__dirname, '../../public/try/index.html'), html);
};
