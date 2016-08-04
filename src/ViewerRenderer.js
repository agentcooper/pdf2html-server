import React, { Component } from 'react';

import ReactDOM from 'react-dom';

import './external/base.min.css';
import './external/rangefix';

import { throttle } from 'lodash';

import ViewerHighlight from './ViewerHighlight';

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

    let inner = null;

    if (!selection.isCollapsed && selection.type === 'Range') {
      const range = selection.getRangeAt(0);

      // eslint-disable-next-line
      const rects = Array.from(RangeFix.getClientRects(range));

      const { scrollTop } = this.rendererNode;

      inner = rects.map((rect, index) => {
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
        { inner }
      </div>,
      this.highlightsNode
    );
  }

  componentDidMount() {
    document.addEventListener(
      'selectionchange',
      throttle(
        this.selectionChangeHandler.bind(this),
        100
      ),
      false
    );
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
