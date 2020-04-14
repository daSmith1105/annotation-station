import React from 'react';
import './App.css';
import Canvas from './components/Canvas';
import testImg from './153640_027.jpg';
import './App.css';

class App extends React.Component {

  render() {

    return (
      <div className="annotator" style={{ display: 'flex' }}>
       <Canvas image={testImg} /> 
      </div>
    );
  }
}

export default App;
