import { Empty, Field, Fieldset, List, Section } from 'enolib';
import React from 'react';

import EmptyInspector from './empty.js';
import FieldInspector from './field.js';
import FieldsetInspector from './fieldset.js';
import ListInspector from './list.js';
import { formatValue } from '../format.js';

export default class SectionInspector extends React.Component {
  constructor(props) {
    super(props);

    const isDocument = this.props.section.parent() === null; // TODO: Make this available more elegantly?

    this.state = { folded: !isDocument };

    this.toggleFolded = this.toggleFolded.bind(this);
  }

  toggleFolded() {
    this.setState({ folded: !this.state.folded });
  }

  render() {
    const { section } = this.props;
    const comment = section.optionalStringComment();
    const elements = section.elements();
    const isDocument = section.parent() === null;
    const key = section.stringKey();

    if(isDocument && elements.length === 0) {
      return(
        <div>
          <span className="inspector__node icon-no-folding"/> <strong>Empty Document</strong>
        </div>
      );
    }

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
          {
            isDocument ?
            <strong>Document</strong> :
            <span><span><strong>{key}</strong> <span className="inspector__element_type">(Section)</span></span> {comment ? <span className="inspector__comment">(Comment – {formatValue(comment)})</span> : null}</span>
          }
        </div>

        {this.state.folded ? null :
          <div className="indented">
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
