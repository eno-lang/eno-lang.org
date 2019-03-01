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
        <span className="inspector__node icon-no-folding"/> <strong>{key}</strong> <span className="inspector__element_type">(Empty)</span> {comment ? <span className="inspector__comment">(Comment – {formatValue(comment)})</span> : null}
      </div>
    );
  }
}
