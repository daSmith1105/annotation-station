import React from 'react';
import './App.css';
import Canvas from './components/Canvas';
import testImg from './153640_027.jpg';
import './App.css';

class App extends React.Component {
  state = {
    apiUrl: 'https://monarch-backend.dividia.net/',
    images: [],
    annotatorName: '',
    showNameEntry: true
  }

  componentDidMount = () => {
    console.log('mounted')
    
  }

  validateAnnotator = () => {
   if( this.state.annotatorName.trim().length > 0 ) {
     this.setState({ showNameEntry: false });
   }
  }

  editAnotatorName = () => {
    this.setState({ showNameEntry: true })
  }

  getNewImage = () => {
    // make the call to the backend to get a new .jpg image 
  }

  saveJsonData = () => {
    // take json annotation data and push to the backend to place in the proper directory
  }

  render() {

    return (
      <div style={{ display: 'flex', maxHeight: '100vh', maxWidth: '100vw', overflow: 'hidden' }}>
      { this.state.showNameEntry ? 
        <div style={{ zIndex: 1, position: 'fixed', top: 0, left: 0, backgroundColor: 'lightgrey', display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
          <h1 style={{ color: 'grey', textAlign: 'center' }}>Annotation Station</h1>
          <div style={{ display: 'flex', flexDirection: 'column', width: 300, marginRight: 'auto', marginLeft: 'auto', marginTop: 80, marginBottom: 'auto', padding: 10, border: '2px solid grey', borderRadius: 5, backgroundColor: 'white' }}>
            <p style={{ textAlign: 'center', marginBottom: 0, color: 'grey' }}>Please enter your name</p>
            <p style={{ textAlign: 'center', marginTop: 2, marginBottom: 30, color: 'grey' }}>to begin annotating</p>
          <input  style={{ borderRadius: 5, textAlign: 'center', padding: 5, fontSize: 12, color: 'grey', width: '50%', margin: 'auto' }} 
                  type="text" 
                  value={ this.state.annotatorName } 
                  onChange={ e => this.setState({ annotatorName: e.target.value })}
                  autoFocus={true} />
          <button style={{ marginTop: 40, width: '70%', marginRight: 'auto', marginLeft: 'auto', marginBottom: 10 }} onClick={ this.validateAnnotator }>Lets Go!</button>
          </div>
        </div> :
        null 
      }
        <Canvas image={testImg} 
                getNewImage={ this.getNewImage }
                annotatorName={ this.state.annotatorName }
                editAnotatorName={ this.editAnotatorName } /> 
      </div>
    );
  }
}

export default App;
