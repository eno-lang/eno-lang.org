import React from 'react';

export default class EmptyInspector extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div>
        <span className="inspector__node icon-no-folding"/> <strong>{this.props.empty.name}</strong> <span className="inspector__element_type">(Empty)</span>
      </div>
    );
  }
}
