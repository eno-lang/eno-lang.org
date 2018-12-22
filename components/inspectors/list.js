import React from 'react';

import FieldInspector from './field.js';

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
    const elements = this.props.list.elements();

    return(
      <div>
        {elements.length > 0 ?
          <a className="inspector__node" onClick={this.toggleFolded}>
            <span className={this.state.folded ? 'icon-unfold' : 'icon-fold'}/>
          </a>
          :
          <span className="icon-no-folding"/>
        }
        <strong>{this.props.list.name}</strong> <span className="inspector__element_type">(List)</span>

        {this.state.folded ? null :
          <div className="inspector__indented">
            {elements.map(element => <FieldInspector field={element} listItem={true} />)}
          </div>
        }
      </div>
    );
  }
}
