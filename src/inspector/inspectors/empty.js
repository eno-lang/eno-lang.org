import React from 'react';

import { formatValue } from '../format.js';

export default class EmptyInspector extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { empty } = this.props;
    const comment = empty.optionalStringComment();
    const key = empty.stringKey();

    return(
      <div>
        <img className="node" src="/images/unfoldable.svg"/>
        <strong className="key">{key}</strong> <span className="element_type">(Empty)</span> {comment ? <span className="comment">(Comment – {formatValue(comment)})</span> : null}
      </div>
    );
  }
}
