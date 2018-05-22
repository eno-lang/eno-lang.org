import { parse, EnoParseError } from 'enojs';

const htmlEscape = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;'
};

const escape = string => string.replace(/[&<>"'\/]/g, c => htmlEscape[c]);

let doc = null;
const editor = document.querySelector('#editor');
const lookupLog = document.querySelector('#lookup');
const parseLog = document.querySelector('#parse');
let locale = location.hash.length > 0 ? location.hash.substr(1) : 'en';

const lookup = () => {
  if(!doc) { return; }

  try {
    const lookup = doc.lookup(editor.selectionStart);

    if(lookup) {
      lookupLog.innerHTML = `<b>lookup(${editor.selectionStart})</b><br/><br/>Token: ${lookup.zone}<br/>Element: ${escape(lookup.element.toString())}`;
    }
  } catch(err) {
    if(err instanceof EnoParseError) {
      lookupLog.innerHTML = err;
    } else {
      lookupLog.innerHTML = err;
    }
  }
};

editor.addEventListener('click', lookup);
editor.addEventListener('focus', lookup);
editor.addEventListener('keyup', event => {
  if(['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
    lookup();
  }
});

const refresh = () => {
  const input = editor.value;

  try {
    doc = parse(input, locale, 'html');

    parseLog.innerHTML = `<b>raw()</b><br/><br/>${escape(JSON.stringify(doc.raw(), null, 2))}`;
  } catch(err) {
    if(err instanceof EnoParseError) {
      parseLog.innerHTML = err;
    } else {
      parseLog.innerHTML = err;
    }
  }
};

window.addEventListener('hashchange', () => {
  locale = location.hash.length > 0 ? location.hash.substr(1) : 'en';
  refresh();
});

editor.addEventListener('input', () => {
  refresh();
  lookup();
});

refresh();
