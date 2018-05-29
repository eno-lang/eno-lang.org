import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-tomorrow';
import jsWorkerUrl from 'file-loader!ace-builds/src-noconflict/worker-javascript';
ace.config.setModuleUrl('ace/mode/javascript_worker', jsWorkerUrl)

import { parse, EnoParseError } from 'enojs';
import eno from 'enojs';

import { attrUnescape, htmlEscape } from '../../lib/escape.js';

let doc = null;
const code = document.querySelector('#code');
const editor = document.querySelector('#editor');
const lookupLog = document.querySelector('#lookup');
const output = document.querySelector('#output');
const select = document.querySelector('.demo');

const aceEditor = ace.edit('code', {
  fontFamily: 'Cousine',
  fontSize: '18px',
  mode: 'ace/mode/javascript',
  showGutter: false,
  theme: 'ace/theme/tomorrow'
});

// const lookup = () => {
//   if(!doc) { return; }
//
//   try {
//     const lookup = doc.lookup(editor.selectionStart);
//
//     if(lookup) {
//       lookupLog.innerHTML = `<b>lookup(${editor.selectionStart})</b><br/><br/>Token: ${lookup.zone}<br/>Element: ${escape(lookup.element.toString())}`;
//     }
//   } catch(err) {
//     if(err instanceof EnoParseError) {
//       lookupLog.innerHTML = err;
//     } else {
//       lookupLog.innerHTML = err;
//     }
//   }
// };
//
// editor.addEventListener('click', lookup);
// editor.addEventListener('focus', lookup);
// editor.addEventListener('keyup', event => {
//   if(['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
//     lookup();
//   }
// });

const refresh = () => {
  const input = editor.value;

  try {
    const evaluate = new Function('input', 'eno', 'cursor', aceEditor.getValue());

    const result = evaluate(input, eno, editor.selectionStart);

    if(typeof result === 'object') {
      output.innerHTML = htmlEscape(JSON.stringify(result, null, 2));
    } else {
      output.innerHTML = htmlEscape(result);
    }
  } catch(err) {
    if(err instanceof EnoParseError) {
      output.innerHTML = err;
    } else {
      output.innerHTML = err;
    }
  }
};

select.addEventListener('change', event => {
  const option = event.target.selectedOptions[0];

  const eno = attrUnescape(option.dataset.eno);
  const js = attrUnescape(option.dataset.js);
  const text = attrUnescape(option.dataset.text);


  document.querySelector('#text').innerHTML = text;
  aceEditor.setValue(js);
  aceEditor.gotoLine(1);
  editor.value = eno;

  refresh();
});

window.addEventListener('hashchange', () => {
  locale = location.hash.length > 0 ? location.hash.substr(1) : 'en';
  refresh();
});

editor.addEventListener('click', refresh);
editor.addEventListener('focus', refresh);
editor.addEventListener('input', refresh);
editor.addEventListener('keyup', event => {
  if(['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
    refresh();
  }
});

refresh();
