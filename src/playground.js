import enolib, { parse, HtmlReporter, ParseError } from 'enolib';
import { de, en, es } from 'enolib/locales';
import React from 'react';
import ReactDOM from 'react-dom';

import { attrUnescape, htmlEscape } from '../lib/escape.js';

const inspector = document.querySelector('.inspector');
const selectDemo = document.querySelector('.demo');
const selectLocale = document.querySelector('.locale');

import ace from 'ace-eno/builds/src-noconflict/ace';
import 'ace-eno/builds/src-noconflict/mode-eno';
import 'ace-eno/builds/src-noconflict/theme-tomorrow';

import Inspector from '../components/inspector.js';

const locales = { de, en, es };
let locale = en;

const editor = ace.edit(
  document.querySelector('#editor'),
  {
    fontFamily: 'Cousine',
    fontSize: '18px',
    mode: 'ace/mode/eno',
    theme: 'ace/theme/tomorrow'
  }
);

const refresh = () => {
  const input = editor.getValue();

  try {
    const doc = enolib.parse(input, { locale: locale, reporter: HtmlReporter });

    ReactDOM.render(<Inspector document={doc} />, document.querySelector('.inspector'));
  } catch(err) {
    if(err instanceof ParseError) {
      ReactDOM.render(<Inspector error={err} />, document.querySelector('.inspector'));
    } else {
      throw err;
    }
  }
};

// TODO: Solve data attribute encoding by embedding data in a script tag

selectDemo.addEventListener('change', () => {
  const demoOption = selectDemo.selectedOptions[0];
  editor.setValue(attrUnescape(demoOption.dataset.eno));
  editor.gotoLine(1);

  refresh();
});

selectLocale.addEventListener('change', () => {
  const localeOption = selectLocale.selectedOptions[0].value;
  locale = locales[localeOption];

  refresh();
});

editor.on('change', refresh);

refresh();
