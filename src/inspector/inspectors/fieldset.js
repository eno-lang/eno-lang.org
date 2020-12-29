import React from 'react';

import FieldInspector from './field.js';
import { formatValue } from '../format.js';

export default class FieldsetInspector extends React.Component {
  constructor(props) {
    super(props);

    this.state = { folded: true };

    this.toggleFolded = this.toggleFolded.bind(this);
  }

  toggleFolded() {
    this.setState({ folded: !this.state.folded });
  }

  render() {
    const { fieldset } = this.props;
    const comment = fieldset.optionalStringComment();
    const key = fieldset.stringKey();
    const entries = fieldset.entries();

    return(
      <div>
        {entries.length > 0 ?
          <a onClick={this.toggleFolded}>
            <img className="node" src={this.state.folded ? "/images/unfold.svg" : "/images/fold.svg"}/>
          </a>
          :
          <img className="node" src="/images/unfoldable.svg"/>
        }
        <strong className="key">{key}</strong> <span className="element_type">(Fieldset)</span> {comment ? <span className="comment">(Comment – {formatValue(comment)})</span> : null}

        {this.state.folded ? null :
          <div className="indented">
            {entries.map(element => <FieldInspector field={element} />)}
          </div>
        }
      </div>
    );
  }
}
