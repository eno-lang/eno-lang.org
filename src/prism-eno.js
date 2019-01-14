const elementRest = {
  _empty_or_field: {
    pattern: /:[^\n]*/,
    inside: {
      'operator': /^:/,
      _value: /.*/
    }
  },
  _fieldset_entry: {
    pattern: /=[^\n]*/,
    inside: {
      'operator': /^=/,
      _value: /.*/
    }
  },
  _template: {
    pattern: /(<(?!<)|<<)[^\n]*/,
    inside: {
      'operator': /^(<(?!<)|<<)/,
      'class-name template': /.*/
    }
  },
  'invalid': /\S+/
};

Prism.languages.eno = {
  // > ...
  'comment': {
    pattern: /(^\s*)>[^\n]*$/m,
    lookbehind: true
  },
  // -- ...
  _block: {
    alias: '_value',
    pattern: /(^|\n)[^\S\n]*(-{2,})[^\S\n]*(?!-)(\S[^\n]*)\n[\s\S]*?\n[^\S\n]*\2[^\S\n]*\3[^\S\n]*(?:\n|$)/,
    inside: {
      _begin: {
        pattern: /^\s*-{2,}(?!-)[^\n]*/,
        inside: {
          'operator': /^[^\S\n]*(-{2,})/,
          'tag name': /.*/
        }
      },
      _end: {
        pattern: /\n\s*-{2,}(?!-)[^\n]*\n?$/,
        inside: {
          'operator': /^\n[^\S\n]*(-{2,})/,
          'tag name': /.*/
        }
      }
    },
    lookbehind: true
  },
  // # ...
  '_section': {
    pattern: /(^\s*)#[^\n]*$/m,
    lookbehind: true,
    inside: {
      'keyword section-operator': /^#{1,}(?!#)/,
      _escaped_name: {
        pattern: /(`+)(?!`)(?:(?!\1).)*\1(?=\s*[<$])/,
        inside: {
          'operator': /(^`+|`+$)/,
          'tag name': /.*/
        }
      },
      _template: {
        pattern: /(<(?!<)|<<)\s*\S.*$/,
        inside: {
          'operator': /^(<(?!<)|<<)/,
          'class-name template': /.*/
        }
      },
      'tag name': /[^\s`<][^<]*/,
    }
  },
  // ` ...
  _escaped_element: {
    pattern: /(^\s*)`[^\n]*$/m,
    lookbehind: true,
    inside: {
      _escaped_fieldset_entry_name: {
        pattern: /^(`+)(?!`)(?:(?!\1).)*\1(?=\s*[=])/,
        inside: {
          'operator': /(^`+|`+$)/,
          'attr-name fieldset-entry-name':  /.*/
        }
      },
      _escaped_name: {
        pattern: /^(`+)(?!`)(?:(?!\1).)*\1(?=\s*[:<])/,
        inside: {
          'operator': /(^`+|`+$)/,
          'tag name': /.*/
        }
      },
      rest: elementRest
    }
  },
  // - ...
  _list_item: {
    pattern: /(^\s*)-(?!-)[^\n]*$/m,
    lookbehind: true,
    inside: {
      'operator': /^-/,
      _value: /.*/
    }
  },
  // ...
  _element: {
    pattern: /(^\s*)[^\s:=><|\-\\#`][^\n]*$/m,
    lookbehind: true,
    inside: {
      'attr-name fieldset-entry-name ': /^[^\s:=><|\-\\#`][^\n:=<]*(?=[=])/,
      'tag name': /^[^\s:=><|\-\\#`][^\n:=<]*(?=[:<])/,
      rest: elementRest
    }
  },
  // | ... OR \ ...
  _continuation: {
    pattern: /(^\s*)[|\\][^\n]*$/m,
    lookbehind: true,
    inside: {
      'operator': /^[|\\]/,
      _value: /.*/
    }
  },
  'invalid': /\S+/
};
