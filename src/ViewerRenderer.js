import React, { Component } from 'react';

import ReactDOM from 'react-dom';

import './external/base.min.css';
import './external/rangefix';

import { throttle } from 'lodash';

import ViewerHighlight from './ViewerHighlight';

import optimizeClientRects from './lib/optimizeClientRects';

class ViewerRenderer extends Component {
  constructor(props) {
    super(props);

    this.rendererNode = null;
    this.highlightsNode = null;
  }

  selectionChangeHandler(event) {
    if (!this.rendererNode || !this.highlightsNode) {
      return;
    }

    const selection = getSelection();

    let highlight = null;

    if (
      !selection.isCollapsed &&
      selection.rangeCount > 0
    ) {
      const range = selection.getRangeAt(0);

      const rectsToDraw = optimizeClientRects(
        // eslint-disable-next-line
        Array.from(RangeFix.getClientRects(range))
      );

      if (rectsToDraw.length === 0) {
        return;
      }

      const { scrollTop } = this.rendererNode;

      highlight = rectsToDraw.map((rect, index) => {
        const { top, left, width, height } = rect;

        return (
          <ViewerHighlight
            key={ index }
            position={{
              top: top + scrollTop, left, width, height,
            }}
          />
        );
      });
    }

    ReactDOM.render(
      <div className="highlights-container-inner">
        { highlight }
      </div>,
      this.highlightsNode
    );
  }

  componentDidMount() {
    document.addEventListener(
      'selectionchange',
      throttle(
        this.selectionChangeHandler.bind(this),
        50
      ),
      false
    );

    // Array.from(this.rendererNode.querySelectorAll('.t')).forEach(node => {
    //   node.classList.add('correction');
    // });
  }

  render() {
    const { pdf, height } = this.props;

    const { html, css } = pdf;

    return (
      <div
        className="renderer"
        style={{
          height,
          overflowY: 'scroll',
          border: '1px solid black',
          willChange: 'transform',
        }}
        ref={ node => { this.rendererNode = node }}
      >
        <div
          className="highlights"
          ref={ node => { this.highlightsNode = node }}
        >
        </div>
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

export default ViewerRenderer;
