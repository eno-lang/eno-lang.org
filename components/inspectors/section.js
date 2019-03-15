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
              if(element.yieldsEmpty())
                return <EmptyInspector empty={element.toEmpty()} />;

              if(element.yieldsField())
                return <FieldInspector field={element.toField()} />;

              if(element.yieldsList())
                return <ListInspector list={element.toList()} />;

              if(element.yieldsFieldset())
                return <FieldsetInspector fieldset={element.toFieldset()} />;

              if(element.yieldsSection())
                return <SectionInspector section={element.toSection()} />;
            })}
          </div>
        }
      </div>
    );
  }
}
