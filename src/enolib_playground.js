import ace from 'ace-eno/builds/src-noconflict/ace';
import 'ace-eno/builds/src-noconflict/mode-javascript';
import 'ace-eno/builds/src-noconflict/mode-python';
import 'ace-eno/builds/src-noconflict/mode-ruby';
import 'ace-eno/builds/src-noconflict/theme-tomorrow';

import enolib, { HtmlReporter, ParseError, TerminalReporter, TextReporter } from 'enolib';
import { de, en, es } from 'enolib/locales';

import { attrUnescape, htmlEscape } from '../lib/escape.js';

const code = document.querySelector('#code');
const input = document.querySelector('#input');
const output = document.querySelector('#output');
const select = document.querySelector('.demo');
const selectLanguage = document.querySelector('.language');

ace.config.setModuleUrl('ace/mode/javascript_worker', '/ace-worker-javascript.js');

const aceEditor = ace.edit('code', {
  fontFamily: 'Cousine',
  fontSize: '18px',
  mode: 'ace/mode/javascript',
  showGutter: false,
  theme: 'ace/theme/tomorrow'
});

const refresh = () => {
  const value = input.value;

  try {
    let demoOption = select.selectedOptions[0];
    const languageOption = selectLanguage.selectedOptions[0].value;

    if(demoOption.disabled) {
      demoOption = select.options[2];
    }

    let js;
    if(languageOption === 'javascript') {
      js = aceEditor.getValue();
    } else {
      js = attrUnescape(demoOption.dataset.javascript);
    }

    const evaluate = new Function('input', 'enolib', 'HtmlReporter', 'TerminalReporter', 'TextReporter', 'cursor', 'de', 'en', 'es', js);

    const result = evaluate(value, enolib, HtmlReporter, TerminalReporter, TextReporter, input.selectionStart, de, en, es);

    if(typeof result === 'object') {
      output.innerHTML = htmlEscape(JSON.stringify(result, null, 2));
    } else {
      output.innerHTML = htmlEscape(result);
    }
  } catch(err) {
    if(err instanceof ParseError) {
      output.innerHTML = err;
    } else {
      output.innerHTML = err;
    }
  }
};

const updateDemo = changed => {
  let demoOption = select.selectedOptions[0];
  const languageOption = selectLanguage.selectedOptions[0].value;

  if(demoOption.disabled) {
    demoOption = select.options[2];
  }

  if(changed === 'demo') {
    input.value = attrUnescape(demoOption.dataset.eno);
  }

  if(languageOption === 'javascript') {
    aceEditor.setValue(attrUnescape(demoOption.dataset.javascript));
    aceEditor.session.setMode('ace/mode/javascript');
    aceEditor.setReadOnly(false);
  } else if(languageOption === 'python') {
    aceEditor.setValue(attrUnescape(demoOption.dataset.python));
    aceEditor.session.setMode('ace/mode/python');
    aceEditor.setReadOnly(true);
  } else if(languageOption === 'ruby') {
    aceEditor.setValue(attrUnescape(demoOption.dataset.ruby));
    aceEditor.session.setMode('ace/mode/ruby');
    aceEditor.setReadOnly(true);
  }

  aceEditor.gotoLine(1);

  refresh();
};

select.addEventListener('change', () => updateDemo('demo'));
selectLanguage.addEventListener('change', () => updateDemo('language'));

input.addEventListener('click', refresh);
input.addEventListener('focus', refresh);
input.addEventListener('input', refresh);
input.addEventListener('keyup', event => {
  if(['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
    refresh();
  }
});

aceEditor.on('change', refresh);

refresh();
