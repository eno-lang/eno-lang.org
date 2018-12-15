const eno = require('enojs');
const fs = require('fs');
const path = require('path');
const { attrEscape } = require('../../lib/escape.js');
const { markdown } = require('../../lib/loaders.js');

const layout = require('../layout.js');

module.exports = async menu => {
  const input = fs.readFileSync(path.join(__dirname, '../demo/language.eno'), 'utf-8');
  const demos = eno.parse(input, { reporter: 'terminal' });

  let options = '';
  let first = null;

  for(let group of demos.elements()) {
    options += `<optgroup label="${group.name}">`;

    for(let demo of group.elements()) {
      const title = demo.name;
      const eno = demo.string('eno', { required: true });
      const text = demo.field('markdown', markdown, { required: true });

      options += `
        <option data-eno="${attrEscape(eno)}"
                data-text="${attrEscape(text)}">
          ${title}
        </option>
      `;

      if(!first) {
        first = {
          eno,
          text,
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

      Browse demos here, or just interactively try out things below right away.<br>
      <select class="demo" style="width: 100%;">
        ${options}
      </select>

      <div id="text">
        ${first.text}
      </div>

      The official eno parsers are fully localized, if errors occur they will be in the language of your choice.<br>
      <select class="locale" style="width: 100%;">
        <option value="de">German errors (de)</option>
        <option selected value="en">English errors (en)</option>
        <option value="es">Spanish errors (es)</option>
      </select>

      <br><br>

      <textarea id="editor">${first.eno}</textarea>
    </div>

    <div class="half">
      <pre id="output" style="background-color: #f0f0f0; padding: 0.5em;"></pre>

      <div>
        <strong>Note:</strong> Eno documents are a form of <em>ordered hash structures</em> - their data can be queried both sequentially and associatively.
        Given that JSON can not adequately represent this concept, a debug representation of the AST (abstract syntax tree), as constructed by the parser (in this case enojs) is shown instead.
      </div>
    </div>
  </div>

  <script src="/try.js"></script>
  `;

  const html = layout(content, 'Try the language', '/try/', menu);

  await fs.promises.mkdir(path.join(__dirname, '../../public/try'));
  await fs.promises.writeFile(path.join(__dirname, '../../public/try/index.html'), html);
};
