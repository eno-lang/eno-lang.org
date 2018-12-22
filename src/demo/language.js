import eno, { parse, EnoParseError } from 'enojs';

import { attrUnescape, htmlEscape } from '../../lib/escape.js';
import explain from '../../lib/explain.js';

const output = document.querySelector('#output');
const selectDemo = document.querySelector('.demo');
const selectLocale = document.querySelector('.locale');

import ace from 'ace-builds';
import 'ace-builds/src-noconflict/theme-tomorrow';

const editor = ace.edit(
  document.querySelector('#editor'),
  {
    fontFamily: 'Cousine',
    fontSize: '18px',
    mode: 'ace/mode/text',
    theme: 'ace/theme/tomorrow'
  }
);

const refresh = () => {
  const input = editor.getValue();

  try {
    const demoOption = selectDemo.selectedOptions[0];
    const localeOption = selectLocale.selectedOptions[0].value;

    const doc = eno.parse(input, { locale: localeOption, reporter: 'html' });
    const result = explain(doc);

    output.innerHTML = htmlEscape(result);
  } catch(err) {
    if(err instanceof EnoParseError) {
      output.innerHTML = err;
    } else {
      output.innerHTML = err;
    }
  }
};

const updateDemo = changed => {
  const demoOption = selectDemo.selectedOptions[0];
  const localeOption = selectLocale.selectedOptions[0].value;

  if(changed === 'demo') {
    // TODO: Solve data attribute encoding by embedding data in a script tag
    editor.setValue(attrUnescape(demoOption.dataset.eno));
    editor.gotoLine(1);
  }

  refresh();
};

selectDemo.addEventListener('change', () => updateDemo('demo'));
selectLocale.addEventListener('change', () => updateDemo('locale'));

editor.on('change', refresh);

refresh();
