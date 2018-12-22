import { Empty, Field, Fieldset, List, Section } from 'enojs';
import React from 'react';

import EmptyInspector from './empty.js';
import FieldInspector from './field.js';
import FieldsetInspector from './fieldset.js';
import ListInspector from './list.js';

export default class SectionInspector extends React.Component {
  constructor(props) {
    super(props);

    const isDocument = this.props.section.toString().match(/\[object Section document/);

    this.state = { folded: !isDocument };

    this.toggleFolded = this.toggleFolded.bind(this);
  }

  toggleFolded() {
    this.setState({ folded: !this.state.folded });
  }

  render() {
    const isDocument = this.props.section.toString().match(/\[object Section document/);
    const elements = this.props.section.elements();

    return(
      <div>
        <div>
          {elements.length > 0 ?
            <a className="inspector__node" onClick={this.toggleFolded}>
              <span className={this.state.folded ? 'icon-unfold' : 'icon-fold'}/>
              </a>
            :
            <span className="inspector__node icon-no-folding"/>
          }
          {isDocument ? <strong>Document</strong> : <span><strong>{this.props.section.name}</strong> <span className="inspector__element_type">(Section)</span></span>}
        </div>

        {this.state.folded ? null :
          <div className="inspector__indented">
            {!isDocument && elements.length === 0 ? 'No elements' : null}

            {elements.map(element => {
              if(element instanceof Empty) {
                return <EmptyInspector empty={element} />;
              }

              if(element instanceof Field) {
                return <FieldInspector field={element} />;
              }

              if(element instanceof List) {
                return <ListInspector list={element} />;
              }

              if(element instanceof Fieldset) {
                return <FieldsetInspector fieldset={element} />;
              }

              if(element instanceof Section) {
                return <SectionInspector section={element} />;
              }
            })}
          </div>
        }
      </div>
    );
  }
}
