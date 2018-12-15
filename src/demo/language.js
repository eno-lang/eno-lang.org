import eno, { parse, EnoParseError } from 'enojs';

import { attrUnescape, htmlEscape } from '../../lib/escape.js';
import explain from '../../lib/explain.js';

const editor = document.querySelector('#editor');
const output = document.querySelector('#output');
const selectDemo = document.querySelector('.demo');
const selectLocale = document.querySelector('.locale');

const refresh = () => {
  const input = editor.value;

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
    editor.value = attrUnescape(demoOption.dataset.eno);
    document.querySelector('#text').innerHTML = attrUnescape(demoOption.dataset.text);
  }

  refresh();
};

selectDemo.addEventListener('change', () => updateDemo('demo'));
selectLocale.addEventListener('change', () => updateDemo('locale'));

editor.addEventListener('click', refresh);
editor.addEventListener('focus', refresh);
editor.addEventListener('input', refresh);
editor.addEventListener('keyup', event => {
  if(['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
    refresh();
  }
});

refresh();
