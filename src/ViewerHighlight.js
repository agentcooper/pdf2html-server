import React, { Component } from 'react'

class ViewerHighlight extends Component {
  render() {
    const { position } = this.props;

    const { left, top, width, height } = position;

    return (
      <div style={
        {
          left, top, width, height,
          backgroundColor: `rgba(255, 0, 0, 0.5)`,
          position: 'absolute',
          zIndex: 1,
          WebkitUserSelect: 'none',
          pointerEvents: 'none',
        }
      }></div>
    );
  }
}

export default ViewerHighlight;
