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
          <span className="inspector_node icon-no-folding"/> <strong>Empty Document</strong>
        </div>
      );
    }

    return(
      <div>
        <div>
          {elements.length > 0 ?
            <a onClick={this.toggleFolded}>
              <img className="node" src={this.state.folded ? "/images/unfold.svg" : "/images/fold.svg"}/>
            </a>
            :
            <img className="node" src="/images/unfoldable.svg"/>
          }
          {
            isDocument ?
            <strong className="key">Document</strong> :
            <span><span><strong className="key">{key}</strong> <span className="element_type">(Section)</span></span> {comment ? <span className="comment">(Comment – {formatValue(comment)})</span> : null}</span>
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
