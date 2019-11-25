import React from 'react';

import Auth from './components/auth';

class App extends React.Component {
  render() {
    return (
      <>
      <p>This is our app</p>
      <Auth do={this.props.action} />
      </>
    )
  }
}

export default App;