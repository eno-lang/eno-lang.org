Prism.languages.eno = {
  'comment': {
    pattern: /(^|\n)[^\S\n]*>[^\n]*/,
    lookbehind: true
  },
  'block': {
    pattern: /(^|\n)[^\S\n]*(-{2,})[^\S\n]*(?!-)(\S[^\n]*)\n[\s\S]*?\n[^\S\n]*\2[^\S\n]*\3[^\S\n]*(?:\n|$)/,
    inside: {
      'block-content': {
        pattern: /((-{2,}(?!-))[^\S\n]*(\S.*?)[^\S\n]*\n)[\S\s]*(?=[^\S\n]*\2[^\S\n]*\3[^\S\n]*)/,
        lookbehind: true
      }
    },
    lookbehind: true
  },
  'escaped-section-3rd-plus': {
    pattern: /(^|\n)[^\S\n]*#{3,}(?!#)[^\S\n]*(`+)(?:(?!\2).)*\2/,
    lookbehind: true
  },
  'section-3rd-plus': {
    pattern: /(^|\n)[^\S\n]*#{3,}(?!#)[^\S\n]*[^\s<][^\n<]*/,
    lookbehind: true
  },
  'escaped-section-2nd': {
    pattern: /(^|\n)[^\S\n]*##(?!#)[^\S\n]*(`+)(?:(?!\2).)*\2/,
    lookbehind: true
  },
  'section-2nd': {
    pattern: /(^|\n)[^\S\n]*##(?!#)[^\S\n]*[^\s<][^\n<]*/,
    lookbehind: true
  },
  'escaped-section-1st': {
    pattern: /(^|\n)[^\S\n]*#(?!#)[^\S\n]*(`+)(?:(?!\2).)*\2/,
    lookbehind: true
  },
  'section-1st': {
    pattern: /(^|\n)[^\S\n]*#(?!#)[^\S\n]*[^\s<][^\n<]*/,
    lookbehind: true
  },
  'escaped-name': {
    pattern: /(^|\n)[^\S\n]*(`+)(?:(?!\2).)*\2[:<]/,
    lookbehind: true,
    alias: 'name'
  },
  'name': {
    pattern: /(^|\n)[^\S\n]*[^:=<\n\s>|\-\\#][^:=<\n]*[:<]/,
    lookbehind: true
  },
  'entry': {
    pattern: /(^|\n)[^\S\n]*[^:=<\n\s>|\-\\#][^:=<\n]*[=]/,
    lookbehind: true
  },
  'append': {
    pattern: /(^|\n)[^\S\n]*[|\\]/,
    lookbehind: true
  },
  'template': {
    pattern: /((?:<(?!<)|<<)[^\S\n]*)\S[^\n]*/,
    lookbehind: true
  },
  'punctuation': /[|\\<:=\-]/
};
