import React, { Component } from 'react';

import Viewer from './Viewer';

class App extends Component {
  render() {
    return (
      <div>
        <Viewer
          width={ 900 }
          height={ 600 }
          serviceUrl={ 'http://localhost:3003' }
          src={ 'concurrent-frp.pdf' }
        />
      </div>
    );
  }
}

export default App;
