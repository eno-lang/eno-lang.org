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
        <span className="inspector_node icon-no-folding"/> {key ? <span><strong class="inspector_key">{key}</strong> →</span> : null} <span className="inspector_value">{formatValue(value)}</span> <span className="inspector_element_type">({key ? 'Field' : 'List Item'})</span> {comment ? <span className="inspector_comment">(Comment – {formatValue(comment)})</span> : null}
      </div>
    );
  }
}
