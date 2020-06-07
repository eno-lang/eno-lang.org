import React from 'react';

import SectionInspector from './inspectors/section.js';


export default class Inspector extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if(this.props.error) {
      return(<div dangerouslySetInnerHTML={{ __html: this.props.error }}/>);
    } else {
      return(<SectionInspector section={this.props.document} />);
    }
  }
}
