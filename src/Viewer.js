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

  shouldComponentUpdate() {
    if (this.state.pdf) {
      return false;
    }

    return true;
  }

  requestPdf({ width }) {
    const { serviceUrl, src } = this.props;

    this.setState({ isLoading: true });

    fetch(`${serviceUrl}/convert?width=${width}&src=${src}`)
    .then(response => response.json())
    .then(json => {
      const { html, css } = json;

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

  componentDidMount() {
    const { width } = this.props;

    this.requestPdf({ width });
  }

  render() {
    const { pdf, isLoading, error } = this.state;

    if (error) {
      return <div>{ error.toString() }</div>;
    }

    if (!pdf) {
      if (isLoading) {
        return <div>Loading...</div>;
      }

      return <div>No pdf</div>;
    }

    const { height } = this.props;

    return <ViewerRenderer pdf={ pdf } height={ height } />
  }
}

export default Viewer;
