import React from 'react';

import { formatValue } from '../format.js';

// TODO: Discern Fieldset Entry type (currently prints "(Field)")

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
        <img className="node" src="/images/unfoldable.svg"/> {key ? <span><strong className="key">{key}</strong> →</span> : null} <span className="value">{formatValue(value)}</span> <span className="element_type">({key ? 'Field' : 'List Item'})</span> {comment ? <span className="comment">(Comment – {formatValue(comment)})</span> : null}
      </div>
    );
  }
}
