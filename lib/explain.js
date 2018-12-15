const { Empty, Field, Fieldset, List, Section } = require('enojs');

const explainField = (field, indentation = '') => {
  return `${indentation}${field}`;
};

const explainFieldset = (fieldset, indentation = '') => {
  const results = [`${indentation}${fieldset}`];

  indentation += '  ';

  for(let entry of fieldset.elements()) {
    results.push(`${indentation}${entry}`);
  }

  return results.join('\n');
};

const explainList = (list, indentation = '') => {
  const results = [`${indentation}${list}`];

  indentation += '  ';

  for(let item of list.elements()) {
    results.push(`${indentation}${item}`);
  }

  return results.join('\n');
};

const explainSection = (section, indentation = '') => {
  const results = [];

  results.push(`${indentation}${section}`);

  indentation += '  ';

  for(let element of section._elements) {
    if(element instanceof Empty) {
      results.push(`${indentation}${element}`);
      continue;
    }

    if(element instanceof Field) {
      results.push(explainField(element, indentation));
      continue;
    }

    if(element instanceof List) {
      results.push(explainList(element, indentation));
      continue;
    }

    if(element instanceof Fieldset) {
      results.push(explainFieldset(element, indentation));
      continue;
    }

    if(element instanceof Section) {
      results.push(explainSection(element, indentation));
      continue;
    }
  }

  return results.join('\n');
};

module.exports = explainSection;
