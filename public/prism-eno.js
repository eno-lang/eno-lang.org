Prism.languages.eno = {
  'comment': {
    pattern: /(^|\n)\s*>[^\n]*/,
    lookbehind: true
  },
  'section3rdLevelPlus': {
    pattern: /(^|\n)\s*#{3,}[^\n<]*/,
    lookbehind: true
  },
  'section2ndLevel': {
    pattern: /(^|\n)\s*##(?!#)[^\n<]*/,
    lookbehind: true
  },
  'section1stLevel': {
    pattern: /(^|\n)\s*#(?!#)[^\n<]*/,
    lookbehind: true
  },
  'escaped': {
    pattern: /(^|\n)\s*(`+)(?:(?!\2).)*\2+/,
    alias: 'name'
  },
  'name': {
    pattern: /(^|\n)\s*(?!-|\\#>)[^:=<\n]+/,
    lookbehind: true
  },
  'block': {
    pattern: /(^|\n)\s*(-{2,})\s*(\S[^\n].*)\s*\n.*?\s*\2\s*\3\s*\n/,
    lookbehind: true
  },
  'punctuation': /[|\\<:=\-]/
};
