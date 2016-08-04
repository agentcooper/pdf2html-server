import React, { PureComponent } from 'react';

class ViewerRendererPdf extends PureComponent {
  render() {
    const { html, css } = this.props.pdf;

    return (
      <div>
        <style
          dangerouslySetInnerHTML={ { __html: css } }
        />
        <div
          dangerouslySetInnerHTML={ { __html: html } }
        >
        </div>
      </div>
    );
  }
}

export default ViewerRendererPdf;
