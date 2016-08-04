import React, { Component } from 'react';

import ReactDOM from 'react-dom';

import './external/base.min.css';
import './external/rangefix';

import { throttle } from 'lodash';

import ViewerHighlight from './ViewerHighlight';

const cleanupRects = (rects) => {
  rects.forEach(A => {
    rects.forEach(B => {
      if (A.toRemove || B.toRemove) {
        return;
      }

      const sameLine = Math.abs(A.top - B.top) < 5;

      if (!sameLine) {
        return;
      }

      const AoverlapsB = A.left <= B.left && (B.left + B.width) < (A.left + A.width)

      if (AoverlapsB || B.width === 0 || B.height === 0) {
        B.toRemove = true;
      }
    });
  });

  return rects.filter(rect => !rect.toRemove);
};

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

      const { scrollTop } = this.rendererNode;

      const rectsToDraw = cleanupRects(
        // eslint-disable-next-line
        Array.from(RangeFix.getClientRects(range))
      );

      inner = rectsToDraw.map((rect, index) => {
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
