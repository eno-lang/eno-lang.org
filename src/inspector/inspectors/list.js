import React from 'react';

import FieldInspector from './field.js';
import { formatValue } from '../format.js';

export default class ListInspector extends React.Component {
  constructor(props) {
    super(props);

    this.state = { folded: true };

    this.toggleFolded = this.toggleFolded.bind(this);
  }

  toggleFolded() {
    this.setState({ folded: !this.state.folded });
  }

  render() {
    const { list } = this.props;
    const comment = list.optionalStringComment();
    const key = list.stringKey();
    const items = list.items();

    return(
      <div>
        {items.length > 0 ?
          <a onClick={this.toggleFolded}>
            <img className="node" src={this.state.folded ? "/images/unfold.svg" : "/images/fold.svg"}/>
          </a>
          :
          <img className="node" src="/images/unfoldable.svg"/>
        }
        <strong className="key">{key}</strong> <span className="element_type">(List)</span> {comment ? <span className="comment">(Comment – {formatValue(comment)})</span> : null}

        {this.state.folded ? null :
          <div className="indented">
            {items.map(element => <FieldInspector field={element} listItem={true} />)}
          </div>
        }
      </div>
    );
  }
}
