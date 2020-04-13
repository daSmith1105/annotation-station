import React from 'react';
import testImg from '../153640_027.jpg';

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
        showExclusionModal: false,
        annotation: {},
        annotations: [],
        exclusionText: '',
        excluded: 0
    }

    componentDidMount() {
     const canvas = this.refs.canvas;
      const ctx = canvas.getContext("2d");
      const img = this.refs.image;
      img.onload = () => {
        this.setState({ imageHeight: img.height, imageWidth: img.width });
        ctx.canvas.width = img.width;
        ctx.canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
    }

    setClass = c => {
        // set class, add id, and save annotation in annotations array
        let annotation = this.state.annotation
        annotation.class = c;
        this.setState({
            annotations: [...this.state.annotations, annotation],
            annotation: {},
            showClassSelection: false,
            endX: 0,
            endY: 0
        }, () => this.redrawAnnotations())
    };

    drawRect = (x,y,w,h, text) => {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "blue";
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
        // clear the current annotation and start a ne one
        this.clearCurrentAnnotation();
        } 

        const canvas = this.refs.canvas;
        canvas.style.cursor="crosshair";
        this.setState({ isDrawing: true, startX: e.clientX, startY: e.clientY });
    }

    _onMouseUp = (e) => {
        if (e.clientX - this.state.startX > 5 ) {
            this.drawRect(this.state.startX, this.state.startY, e.clientX - this.state.startX, e.clientY - this.state.startY);
            this.setState({ 
                isDrawing: false, 
                endX: e.clientX,
                endY: e.clientY,
                annotation: { x: this.state.startX, y: this.state.startY, w: e.clientX - this.state.startX, h: e.clientY - this.state.startY },
                showClassSelection: true
            })
        }
    }

    _onMouseMove =(e) => {
        if( this.state.isDrawing ) {
            this.drawRect(this.state.startX, this.state.startY, e.clientX - this.state.startX, e.clientY - this.state.startY);
        }
    }

    displayResults = () => {
        const resultObj = { 
            filename: "whatever",
            width: this.state.imageWidth,
            height: this.state.imageHeight,
            exclude: this.state.excluded,
            exclusion_reason: this.state.exclusionText.trim() !== '' ? this.state.exclusionText : null,
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
            imageHeight: 0,
            imageWidth: 0,
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
            mouseDown: false,
            showClassSelection: false,
            showExclusionModal: false,
            annotation: {},
            annotations: [],
            exclusionText: '',
            excluded: 0
        }, () => this.redrawAnnotations() )
    }

    clearCurrentAnnotation = () => {
        if( this.state.annotation !== {} ) {
            const canvas = this.refs.canvas;
            const img = this.refs.image;
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
            const img = this.refs.image;
            const ctx = canvas.getContext("2d");
            let annotations = [...this.state.annotations];
            const t = annotations.pop();
            ctx.clearRect(t.x,t.y,t.w,t.h);
            ctx.drawImage(img, 0, 0);
            this.setState({ annotations: annotations }, () => this.state.annotations.forEach( a => this.drawRect(a.x, a.y, a.w, a.h, a.class)) );
        } else {
            alert('Nothing to undo.')
        }
    }

    redrawAnnotations = () => {
        if( this.state.annotations.length ) {
            const canvas = this.refs.canvas;
            const img = this.refs.image;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            this.state.annotations.forEach( a => this.drawRect(a.x, a.y, a.w, a.h, a.class))
        } else {
            const canvas = this.refs.canvas;
            const img = this.refs.image;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
        }
    }

    excludeImage = () => {
        this.setState({ showExclusionModal: true });
    }

    processExcludeImage = () => {
        this.setState({ excluded: 1 }, () => {
            this.displayResults();
        })
    }



    render() {
      return(
        <div style={{ position: 'relative'}}>
            <div style={{ position: 'relative'}}>
            <canvas ref="canvas" onMouseDown={this._onMouseDown} onMouseUp={this._onMouseUp} />
            <img ref="image" src={testImg} style={{ visibility: 'hidden' }} alt="" />
            <button style={{ position: 'absolute', top: 10, right: 40, }} onClick={ this.displayResults }>submit annotation</button>
            <button style={{ position: 'absolute', top: 50, right: 40, }} onClick={ this.removeLastAnnotation }>undo last</button>
            <button style={{ position: 'absolute', top: 90, right: 40, }} onClick={ this.excludeImage }>exclude this image</button>

            {this.state.showClassSelection ? 
                    <div style={{ position: 'absolute', top: this.state.endY, left: this.state.endX - this.state.annotation.w }}>
                        <button style={{ fontSize: 10 }} onClick={() => this.setClass('person')} >person</button>
                        <button style={{ fontSize: 10 }} onClick={() => this.setClass('vehicle')} >vehicle</button>
                        <button style={{ fontSize: 10 }} onClick={() => this.clearCurrentAnnotation()} >cancel</button>
                    </div> :
                    null
                }
            </div>
            {this.state.showExclusionModal ? 
                <div style={{ zIndex: 1, position: 'fixed', top:0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,.6' }}>
                        <div style={{ position: 'absolute', top: '10%', left: '20%', padding: 20, paddingTop: 5, backgroundColor: 'grey', borderRadius: 5 }}>
                            <p style={{ fontSize: 12, color: 'white'}}>Reason for exclusion:</p>
                            <textarea style={{ fontSize: 12, padding: 5, borderRadius: 5 }} rows="10" cols="50" value={ this.state.exclusionText } onChange={ e => this.setState({ exclusionText: e.target.value })} />
                            <br/>
                            <button style={{ fontSize: 10 }} onClick={() => this.processExcludeImage() } >submit</button>
                            <button style={{ fontSize: 10 }} onClick={() => this.setState({ showExclusionModal: false })} >cancel</button>
                        </div>
                </div> :
                null
            }
        </div>
      )
    }
  }
  export default Canvas