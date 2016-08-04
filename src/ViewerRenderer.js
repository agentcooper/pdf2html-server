import React, { Component } from 'react';

import './external/base.min.css';
import './external/rangefix';

import { throttle } from 'lodash';

import ViewerHighlight from './ViewerHighlight';
import ViewerRendererPdf from './ViewerRendererPdf';

import optimizeClientRects from './lib/optimizeClientRects';

class ViewerRenderer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      highlight: null,
    };

    this.rendererNode = null;
  }

  selectionChangeHandler(event) {
    const { isMouseDown, highlight } = this.state;

    if (!this.rendererNode) {
      return;
    }

    const selection = getSelection();

    if (!selection.isCollapsed && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      const { startContainer, endContainer } = range;

      const rectsToDraw = optimizeClientRects(
        // eslint-disable-next-line
        Array.from(RangeFix.getClientRects(range))
      );

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

    document.addEventListener('mousedown', () => this.setState({ isMouseDown: true }));
    document.addEventListener('mouseup', () => this.setState({ isMouseDown: false }));

    // Array.from(this.rendererNode.querySelectorAll('.t')).forEach(node => {
    //   node.classList.add('correction');
    // });
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
