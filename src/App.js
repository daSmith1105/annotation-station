import React from 'react';
import './App.css';
import Annotator from './components/Annotator';
import FileSelector from './components/FileSelector';

class App extends React.Component {

  state={
    currentImage: ''
  }

  setCurrentImage = (image) => {
    // alert(image)
    this.setState({ currentImage: image })
  }

  render() {
    return (
      <div style={{ background: 'rgba(0,0,0,.8)', maxWwidth: '100vw', height: '100%', maxHeight: '100vh', padding: 10, paddingBottom: 80 }}>
        <div style={{ display: 'flex' }}>
          <h1 style={{ margin: 0, color: 'white', fontSize: '1.4em', marginLeft: '3em' }}>Annotation Station</h1>
          {/* <FileSelector setCurrentImage={ this.setCurrentImage } /> */}
        </div>
        <Annotator currentImage={ this.state.currentImage } />
      </div>
    );
  }
}

export default App;
