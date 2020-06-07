export const formatValue = value => {
  if(value === null)
    return 'null';

  value = value.replace('\n', '\\n');

  if(value.length > 72) {
    value = value.substr(0, 68) + ' ...';
  }

  return value;
};
