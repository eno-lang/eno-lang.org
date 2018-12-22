import eno, { parse, HtmlReporter, ParseError } from 'enojs';
import React from 'react';
import ReactDOM from 'react-dom';

import { attrUnescape, htmlEscape } from '../../lib/escape.js';

const inspector = document.querySelector('.inspector');
const selectDemo = document.querySelector('.demo');
const selectLocale = document.querySelector('.locale');

import ace from 'ace-builds';
import 'ace-builds/src-noconflict/theme-tomorrow';

import Inspector from '../../components/inspector.js';

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

    const doc = eno.parse(input, { locale: localeOption, reporter: HtmlReporter });

    ReactDOM.render(<Inspector document={doc} />, document.querySelector('.inspector'));
  } catch(err) {
    if(err instanceof ParseError) {
      ReactDOM.render(<Inspector error={err} />, document.querySelector('.inspector'));
    } else {
      throw err;
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
