import React, { Component } from 'react';

import './external/base.min.css';
import './external/rangefix';

import { throttle } from 'lodash';

import ViewerHighlight from './ViewerHighlight';
import ViewerRendererPdf from './ViewerRendererPdf';

import optimizeClientRects from './lib/optimizeClientRects';

import config from './config';

class ViewerRenderer extends Component {
  state = {
    highlight: null,
    isMouseDown: false,
  };

  rendererNode = null;

  selectionChangeHandler = throttle(event => {
    const { isMouseDown, highlight } = this.state;

    if (!this.rendererNode) {
      return;
    }

    const selection = getSelection();

    if (!selection.isCollapsed && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      const { startContainer, endContainer } = range;

      // eslint-disable-next-line
      const clientRects = Array.from(RangeFix.getClientRects(range));

      const rectsToDraw =
        config.shouldOptimizeClientRects ?
          optimizeClientRects(clientRects)
          :
          clientRects;

      if (rectsToDraw.length === 0) {
        return;
      }

      const { scrollTop } = this.rendererNode;

      const positions = rectsToDraw.map((rect, index) => {
        const { top, left, width, height } = rect;

        return {
          top: top + scrollTop, left, width, height,
        };
      });

      const newHighlight = {
        endContainer,
        startContainer,
        positions,
      };

      if (isMouseDown) {
        // prevent highlight flickering
        if (
          config.optimizeSelectionFlickering &&
          highlight &&
          endContainer &&
          startContainer &&
          (
            endContainer.nodeType !== Node.TEXT_NODE ||
            startContainer.nodeType !== Node.TEXT_NODE
          )
        ) {
          return;
        }

        if (
          config.optimizeSelectionFlickering &&
          highlight &&
          highlight.startContainer !== highlight.endContainer &&
          newHighlight.endContainer === highlight.startContainer
        ) {
          return;
        }

        this.setState({ highlight: newHighlight });
      }
    } else {
      this.setState({ highlight: null });
    }
  }, 50);

  mouseUpHandler = () => this.setState({ isMouseDown: false });

  mouseDownHandler = () => this.setState({ isMouseDown: true });

  componentDidMount() {
    document.addEventListener('selectionchange', this.selectionChangeHandler, false);
    document.addEventListener('mousedown', this.mouseDownHandler);
    document.addEventListener('mouseup', this.mouseUpHandler);
  }

  componentWillUnmount() {
    document.removeEventListener('selectionchange', this.selectionChangeHandler);
    document.removeEventListener('mousedown', this.mouseDownHandler);
    document.removeEventListener('mouseup', this.mouseUpHandler);
  }

  render() {
    const { pdf, height } = this.props;

    const { highlight } = this.state;

    return (
      <div
        className="renderer"
        style={{
          height,
        }}
        ref={ node => { this.rendererNode = node }}
      >
        <div
          className="highlights"
        >
          <div className="highlights-container-inner">
            {
              highlight ?
                highlight.positions.map(
                  (position, index) =>
                    <ViewerHighlight
                      key={ index }
                      position={ position }
                    />
                )
                :
                null
            }
          </div>
        </div>
        <ViewerRendererPdf pdf={ pdf } />
      </div>
    );
  }
}

export default ViewerRenderer;
