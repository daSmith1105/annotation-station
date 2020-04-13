import React from 'react';
import './App.css';
import Annotator from './components/Annotator';
import FileSelector from './components/FileSelector';
import TestAnnotation from './components/TestAnnotation';

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
      <div>
       <TestAnnotation /> 
      </div>
    );
  }
}

export default App;
