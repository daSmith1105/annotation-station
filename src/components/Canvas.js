import React from 'react';
import Sidebar from './Sidebar';
import '../App.css';

class Canvas extends React.Component {

    state = {
        imageHeight: 0,
        imageWidth: 0,
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        mouseDown: false,
        showClassSelection: false,
        annotation: {},
        annotations: [],
        excluded: 0,
        isdrawing: false
    }

    componentDidMount() {
     const canvas = this.refs.canvas;
      const ctx = canvas.getContext("2d");
      const img = this.refs.image;
      img.onload = () => {
        this.setState({ imageHeight: img.height, imageWidth: img.width });
        ctx.canvas.width = img.width + 20 ;
        ctx.canvas.height = img.height + 20;
        this.drawImage( 0, 0, img.width, img.height );
      };
    }

    // s = source, d = destination
    drawImage = ( x, y, w, h ) => {
        const canvas = this.refs.canvas;
        const img = this.refs.image;
        const ctx = canvas.getContext("2d");
        ctx.drawImage( img, x, y, w, h );
    }

    randomColor = () => {
        return ( '#'+Math.floor(Math.random()*16777215).toString(16));
    }

    randomId = () => {
        return (Math.floor(Math.random() * Math.floor(Math.random() * Date.now())));
    }

    setClass = c => {
        // set class, add id, and save annotation in annotations array
        let annotation = this.state.annotation
        annotation.class = c;
        annotation.id = this.randomId();
        this.setState({
            annotations: [...this.state.annotations, annotation],
            annotation: {},
            showClassSelection: false,
            endX: 0,
            endY: 0
        }, () => this.redrawAnnotations() )
    };

    drawRect = (x,y,w,h, text, color) => {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = color || 'yellow';
        ctx.rect(x,y,w,h);
        ctx.stroke();
        if (text) {
            ctx.font = "10px Verdana";
            ctx.fillStyle = "white";
            ctx.textAlign = "left";
            ctx.fillText(text, x + 6, y + 12);
        }
    }

    _onMouseDown = (e) => {
        if( this.state.annotation !== {} ) {
        // clear the current annotation and start a new one
        this.clearCurrentAnnotation();
        } 

        const canvas = this.refs.canvas;
        canvas.style.cursor="crosshair";
        this.setState({ isDrawing: true, startX: e.clientX, startY: e.clientY, borderColor: this.randomColor() });
    }

    _onMouseUp = (e) => {
        if (e.clientX - this.state.startX > 10 && e.clientY - this.state.startY > 10 ) {
            const c = this.state.borderColor
            this.drawRect(this.state.startX, this.state.startY, e.clientX - this.state.startX, e.clientY - this.state.startY,null, c);
            this.setState({ 
                isDrawing: false, 
                endX: e.clientX,
                endY: e.clientY,
                annotation: { x: this.state.startX, y: this.state.startY, w: e.clientX - this.state.startX, h: e.clientY - this.state.startY, color: c },
                showClassSelection: true,
                borderColorIndex: this.state.borderColorIndex + 1
            })
        } else {
            this.clearCurrentAnnotation();
            this.setState({ isDrawing: false })
        }
    }

    _onMouseMove =(e) => {
        if( this.state.isDrawing ) {
            this.clearCurrentAnnotation();
            this.drawRect(this.state.startX, this.state.startY, e.clientX - this.state.startX, e.clientY - this.state.startY);
        }
    }

    displayResults = () => {
        if(this.state.annotations.length > 0 || this.state.excluded === 1 ) {
            const resultObj = { 
                filename: "whatever",
                annotated_by: this.props.annotatorName.toLowerCase(),
                width: this.state.imageWidth,
                height: this.state.imageHeight,
                exclude: this.state.excluded,
                bboxes: this.state.annotations.map( a => (
                    {
                        class: a.class,
                        x: a.x,
                        y: a.y,
                        w: a.w,
                        h: a.h
                    }
                ))
            }
            alert(JSON.stringify(resultObj) )
           
            this.setState({ 
                mouseDown: false,
                showClassSelection: false,
                showExclusionModal: false,
                annotation: {},
                annotations: [],
                excluded: 0
            }, () => this.redrawAnnotations() )
        } else {
            alert('No annotations found. Please add annotations to the image before submitting.');
        }
    }

    clearCurrentAnnotation = () => {
        if( this.state.annotation !== {} ) {
            const canvas = this.refs.canvas;
            const ctx = canvas.getContext("2d");
            const t = this.state.annotation;
            ctx.clearRect(t.x,t.y,t.w,t.h);
            this.setState({ annotation: {}, showClassSelection: false });
            this.redrawAnnotations();
        }
    }

    removeLastAnnotation = () => {
        if( this.state.annotations.length ) {
            const canvas = this.refs.canvas;
            const ctx = canvas.getContext("2d");
            let annotations = [...this.state.annotations];
            const t = annotations.pop();
            ctx.clearRect(t.x,t.y,t.w,t.h);
            this.drawImage( 0, 0, this.state.imageWidth, this.state.imageHeight )
            this.setState({ annotations: annotations }, () => this.state.annotations.forEach( a => this.drawRect(a.x, a.y, a.w, a.h, a.class)) );
        } else {
            alert('Nothing to undo.')
        }
    }

    redrawAnnotations = () => {
        if( this.state.annotations.length ) {
            this.drawImage( 0, 0, this.state.imageWidth, this.state.imageHeight )
            this.state.annotations.forEach( a => this.drawRect(a.x, a.y, a.w, a.h, a.class, a.color))
        } else {
            this.drawImage( 0, 0, this.state.imageWidth, this.state.imageHeight )
        }
    }

    excludeImage = () => {
        this.setState({ excluded: 1 }, () => {
            this.displayResults();
        })
    }

    changeAnnotationObjectClass = (e, id) => {
        e.preventDefault();
        console.log(e.target.value,id)
        // need to find the correct annotationObject
        let targetAnnotation = this.state.annotations.filter( a => a.id === id)[0];
        if ( targetAnnotation ) {
            //change the class
            targetAnnotation.class = e.target.value;
            this.redrawAnnotations();
        }
    }

    removeAnnotationObject = (id) => {
        // remove the annotationObject, by filtering out the current state less the one we need to remove
        let annotationArr = this.state.annotations.filter( a => a.id !== id);
        this.setState({ annotations: annotationArr }, () => {
            this.redrawAnnotations();
        })
    }

    clearAll = () => {
        if(this.state.annotations.length > 0 || this.state.annotation !== {}) {
            this.setState({ annotation: {}, annotations: [], showClassSelection: false }, () => this.redrawAnnotations() )
        } else {
            alert('nothing to clear');
        }
    }

    render() {
      return(
        <div style={{ display: 'flex' }}>
            <div style={{ position: 'relative', backgroundColor: 'blue', width: this.state.imageWidth, height: this.state.imageHeight }}>
                <canvas className="no-highlight"
                        ref="canvas" 
                        onMouseDown={this._onMouseDown} 
                        onMouseUp={this._onMouseUp}
                        onMouseMove={this._onMouseMove} />
                <img ref="image" src={this.props.image} style={{ visibility: 'hidden' }} alt="" />

                {this.state.showClassSelection ? 
                        <div style={{ position: 'absolute', top: this.state.endY, left: this.state.endX - this.state.annotation.w }}>
                            <button style={{ fontSize: 10 }} onClick={() => this.setClass('person')} >person</button>
                            <button style={{ fontSize: 10 }} onClick={() => this.setClass('vehicle')} >vehicle</button>
                            <button style={{ fontSize: 10 }} onClick={() => this.clearCurrentAnnotation()} >cancel</button>
                        </div> :
                        null
                    }
            </div>
            <div style={{ textAlign: 'left' }}>
                <Sidebar annotations={ this.state.annotations } 
                         displayResults={ this.displayResults }
                         removeLastAnnotation={ this.removeLastAnnotation }
                         excludeImage={ this.excludeImage }
                         changeAnnotationObjectClass={ this.changeAnnotationObjectClass }
                         removeAnnotationObject={ this.removeAnnotationObject }
                         clearAll={ this.clearAll }
                         annotatorName={ this.props.annotatorName }
                         editAnotatorName={ this.props.editAnotatorName } />
            </div>

        </div>
      )
    }
  }
  export default Canvas