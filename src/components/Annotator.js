import React from 'react';
import Annotation from 'react-image-annotation';
import '../App.css';

export default class Simple extends React.Component {
    state = {
      annotations: [],
      annotation: {},
      selectedClass: 'person'
    }
  
    onChange = (annotation) => {
        console.log(annotation)
      this.setState({ annotation })
    }
  
    onSubmit = (text) => {
      const { geometry } = this.state.annotation
      this.setState({
        annotation: {},
        annotations: this.state.annotations.concat({
          geometry,
          data: {
            text: text,
            id: Math.random()
          }
        })
      })
    }

    handleClassChange = e => {
        e.preventDefault();
        this.setState({ selectedClass: e.target.value })
    }

    saveAnnotation = () => {
        if( this.state.annotations.length > 0 ) {
            alert(this.createJsonFile())
        } else {
            alert('please create an annotation selection')
        }
        
    }

    undoAnnotation = () => {
        let a = [...this.state.annotations];
        if( a.length > 0 ) {
            a.pop();
            this.setState({ annotations: a });
        }
    }

    createJsonFile = () => {
        let boxes = this.state.annotations.map( a => (
            {
                class: a.data.text,
                x: a.geometry.x,
                y: a.geometry.y,
                w: a.geometry.width,
                h: a.geometry.height,
            }
        ))
        
        let file = {
            filename: 'whatever the filename is',
            width: 800,
            height: 600,
            'annotated-by': 'David',
            bboxes: boxes
        }
       return JSON.stringify(file);
    }
  
    render () {
        // { 
        //       “filename”: “cs1184/cam1/2020/04/01/080000.jpg”,
        //       “width”: 853,
        //       “height”: 480,
        //       “annotated-by”: “Ryan”,
        //       “bboxes”: [
        //         {
        //           “class”: “person”,
        //           “x”: 100,
        //           “y”: 100,
        //           “w”: 50,
        //           “h”: 50
        //         },{
        //           “class”: “vehicle”,
        //           “x”: 200,
        //           “y”: 300,
        //           “w”: 150,
        //           “h”: 175
        //         }
        //       ]
        //     }

        // x = annotations[index].geometry.x
        // y = annotations[index].geometry.y
        // h = annotations[index].geometry.height
        // w = annotations[index].geometry.width
        // text = annotations[index].data.text

      return (
          <div style={{ display: 'flex', maxWidth: '90%', height: 600, position: 'relative', marginLeft: '4em' }}>
            <Annotation
                className="annotator"
                src={"https://source.unsplash.com/random/800x600"}
                alt='Test'
                style={{ height: 'auto' }}
                annotations={this.state.annotations}
                // type={this.state.type}
                // disableSelector={true}
                // disableEditor={true}
                // disableOverlay={true}
                renderEditor={ () => {
                return (
                    <div  style={{  position: 'absolute',
                                    left: `${this.state.annotation.geometry.x}%`,
                                    top: `${this.state.annotation.geometry.y + this.state.annotation.geometry.height}%` }}>
                        <button onClick={ () => this.onSubmit('person')}>person</button>
                        <button style={{ marginLeft: '1em' }} 
                                onClick={ () => this.onSubmit('vehicle')}>vehicle</button>
                        {/* <select value={this.state.selectedClass} onChange={this.handleClassChange}>
                            <option value="person">Person</option>
                            <option value="vehicle">Vehicle</option>
                        </select>
                        <div style={{ textAlign: 'center' }}>
                            <button onClick={ this.onSubmit}>Submit</button>
                        </div> */}
                    </div> 
                )}}
                // renderSelector={ () => {} }
                // renderHighlight={ () => {} }
                // renderContent={ () => {} }
                // renderOverlay={ () => {} }
                value={this.state.annotation}
                onChange={this.onChange}
                onSubmit={this.onSubmit}
            />
            <div style={{ display: 'flex', flexDirection: 'column', width: '14%', height: 600, alignItems: 'flex-start', justifyContent: 'flex-start', marginLeft: '2em', overflow: 'visible' }}>
                <button onClick={ () => this.saveAnnotation() }
                        style={{ marginLeft: '1em' }} >SUBMIT</button>
                <p style={{ fontSize: '1em' }}></p>
                <button onClick={ () => this.undoAnnotation() }
                        style={{ marginLeft: '1em'  }} >UNDO</button>
            </div>
          </div>
      )
    }
  }