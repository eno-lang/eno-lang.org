import React from 'react';

import { formatValue } from '../format.js';

export default class FieldInspector extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { field } = this.props;
    const comment = field.optionalStringComment();
    const key = this.props.listItem ? null : field.stringKey();
    const value = field.optionalStringValue();

    return(
      <div>
        <span className="inspector__node icon-no-folding"/> {key ? <span><strong>{key}</strong> →</span> : null} <span className="inspector__value">{formatValue(value)}</span> <span className="inspector__element_type">({key ? 'Field' : 'List Item'})</span> {comment ? <span className="inspector__comment">(Comment – {formatValue(comment)})</span> : null}
      </div>
    );
  }
}
