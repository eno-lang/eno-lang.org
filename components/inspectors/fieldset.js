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
          <a className="inspector__node" onClick={this.toggleFolded}>
            <span className={this.state.folded ? 'icon-unfold' : 'icon-fold'}/>
          </a>
          :
          <span className="inspector__node icon-no-folding"/>
        }
        <strong>{key}</strong> <span className="inspector__element_type">(Fieldset)</span> {comment ? <span className="inspector__comment">(Comment – {formatValue(comment)})</span> : null}

        {this.state.folded ? null :
          <div className="inspector__indented">
            {entries.map(element => <FieldInspector field={element} />)}
          </div>
        }
      </div>
    );
  }
}
