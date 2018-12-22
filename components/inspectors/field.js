import React from 'react';

const formatValue = value => {
  value = value.replace('\n', '\\n');

  if(value.length > 72) {
    value = value.substr(0, 68) + ' ...';
  }

  return value;
};

export default class FieldInspector extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div>
        <span className="inspector__node icon-no-folding"/> {this.props.listItem ? null : <span><strong>{this.props.field.name}</strong> →</span>} <span className="inspector__value">{formatValue(this.props.field.value())}</span> <span className="inspector__element_type">(Field)</span>
      </div>
    );
  }
}
