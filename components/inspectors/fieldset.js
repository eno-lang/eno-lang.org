import React from 'react';

import FieldInspector from './field.js';

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
    const elements = this.props.fieldset.elements();

    return(
      <div>
        {elements.length > 0 ?
          <a className="inspector__node" onClick={this.toggleFolded}>
            <span className={this.state.folded ? 'icon-unfold' : 'icon-fold'}/>
          </a>
          :
          <span className="inspector__node icon-no-folding"/>
        }
        <strong>{this.props.fieldset.name}</strong> <span className="inspector__element_type">(Fieldset)</span>

        {this.state.folded ? null :
          <div className="inspector__indented">
            {elements.map(element => <FieldInspector field={element} />)}
          </div>
        }
      </div>
    );
  }
}
