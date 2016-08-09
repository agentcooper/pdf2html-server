import React, { Component } from 'react';

import Viewer from './Viewer';

class App extends Component {
  state = {
    availableSrc: [
      'concurrent-frp.pdf',
    ],

    currentSrc: 'concurrent-frp.pdf',
  };

  render() {
    const { currentSrc, availableSrc } = this.state;

    console.log(currentSrc);

    return (
      <div>
        <Viewer
          width={ 900 }
          height={ 600 }
          serviceUrl={ 'http://localhost:3003' }
          src={ currentSrc }
        />
        <select
          value={ currentSrc }
          onChange={ event => this.setState({ currentSrc: event.target.value }) }
        >
          {
            availableSrc.map(src => <option key={ src } value={ src }>{ src }</option>)
          }
        </select>
      </div>
    );
  }
}

export default App;
