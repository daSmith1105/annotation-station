import React from 'react';
import './App.css';
import Canvas from './components/Canvas';
import testImg from './153640_027.jpg';
import './App.css';

const testJson = {
  "filename": "cs1184/cam02/2020/03/02/153640_027.jpg",
  "width":853,
  "height":480,
  "exclude":0,
  "bboxes":[
      {
          "class":"person",
          "x":230,
          "y":71,
          "w":50,
          "h":105
      },
      {
          "class": "vehicle",
          "x":336,
          "y":33,
          "w":191,
          "h":144
      }
  ]
};


class App extends React.Component {
  state = {
    apiUrl: 'https://monarch-backend.dividia.net/',
    images: [],
    annotatorName: '',
    showNameEntry: true
  }

  componentDidMount = () => {
    this.getNewImage();
    this.saveJsonData(testJson);
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
    fetch( this.state.apiUrl + 'api/getimage', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then( res => {
      if(!res.ok) {
        throw new Error('Bad Response')
      }
      return res.json()
    })
    .then( data => {
      console.log(data)
    })
    .catch( error => {
      console.log(error)
    })
  }

  saveJsonData = (data) => {
    fetch( this.state.apiUrl + 'api/savejsondata', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then( res => {
      if(!res.ok) {
        throw new Error('Bad Response')
      }
      return res.json()
    })
    .then( data => {
      console.log(data)
    })
    .catch( error => {
      console.log(error)
    })
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
