import React, { Component } from 'react';

import ViewerRenderer from './ViewerRenderer';

import './Viewer.css';

class Viewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pdf: null,
      isLoading: false,
    };
  }

  requestPdf({ src, width }) {
    const { serviceUrl } = this.props;

    this.setState({ isLoading: true });

    console.time('fetch');
    fetch(`${serviceUrl}/convert?width=${width}&src=${src}`)
    .then(response => response.json())
    .then(json => {
      const { html, css } = json;

      console.timeEnd('fetch');

      this.setState({
        pdf: {
          html,
          css,
        },
        isLoading: false,
      });
    })
    .catch(error => {
      this.setState({ error });
    });
  }

  componentWillReceiveProps(props) {
    const { src, width } = this.props;

    if (props && props.src !== src) {
      this.requestPdf({ width, src: props.src });
    }
  }

  componentDidMount() {
    const { width, src } = this.props;

    this.requestPdf({ width, src });
  }

  render() {
    const { pdf, isLoading, error } = this.state;

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>{ error.toString() }</div>;
    }

    if (!pdf) {
      return <div>No pdf</div>;
    }

    const { height } = this.props;

    return <ViewerRenderer pdf={ pdf } height={ height } />
  }
}

export default Viewer;
