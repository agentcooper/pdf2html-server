import React, { PureComponent } from 'react'

class ViewerHighlight extends PureComponent {
  render() {
    const { position } = this.props;

    const { left, top, width, height } = position;

    return (
      <div className="highlight-part" style={
        {
          left, top, width, height,
        }
      }></div>
    );
  }
}

export default ViewerHighlight;
