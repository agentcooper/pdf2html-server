import React, { Component } from 'react';

import Viewer from './Viewer';

const serviceUrl = 'http://localhost:3003';

class App extends Component {
  state = {
    documents: [],
    currentDocument: '',
  };

  componentDidMount() {
    fetch(`${serviceUrl}/list`)
    .then(response => response.json())
    .then(json => {
      const { documents } = json;

      console.log('Fetched documents', documents);

      if (documents.length === 0) {
        throw new Error('No documents');
      }

      this.setState({
        documents,
        currentDocument: documents[documents.length - 1]
      });
    });
  }

  render() {
    const { currentDocument, documents } = this.state;

    return (
      <div>
        {
        currentDocument ?
          <Viewer
            width={ 900 }
            height={ 600 }
            serviceUrl={ serviceUrl }
            src={ currentDocument }
          />
          :
          null
        }
        <select
          value={ currentDocument }
          onChange={
            event => this.setState({
              currentDocument: event.target.value,
            })
          }
        >
          {
            documents.map(src =>
              <option key={ src } value={ src }>{ src }</option>
            )
          }
        </select>
      </div>
    );
  }
}

export default App;
