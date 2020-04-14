import React from 'react';
import annotationClasses from '../annotationClasses.json';

class AnnotationObject extends React.Component {
    constructor(props) {
        super(props);

        this.state= {
            id: 0,
            selectedClass: '',
            borderColor: 'grey'
        }
    }

    componentDidMount = () => {
        this.setState({
            selectedClass: this.props.annotation.class,
            id: this.props.annotation.id,
            borderColor: this.props.annotation.color || 'grey'
        })
    }

    setAnnotationObjectClass = e => {
        e.preventDefault();
        this.setState({ selectedClass: e.target.value })
    }

    render() {
        const { x, y, w, h } = this.props.annotation;

        return (
            <div className="box-shadow" style={{ position: 'relative', paddingBottom: 5, border: `2px solid ${this.state.borderColor}`, borderRadius: 5, margin: 10 }}>
                <div style={{ display: 'flex',  padding: 5, backgroundColor: this.props.annotation.color }}>
                    <select style={{ float: 'left', width: 100 }} 
                            value={ this.state.selectedClass } 
                            onChange={ e => { this.props.changeAnnotationObjectClass(e, this.state.id); this.setAnnotationObjectClass(e) } }>
                        { annotationClasses.map( a => (
                            <option key={a.name} value={a.name}>{a.name}</option>
                            ))
                        }
                    </select>
                    <button style={{ position: 'absolute', top: 3, right: 10, padding: 0, paddingLeft: 5, paddingRight: 5, fontSize: 12, fontWeight: 'bold', border: '2px solid grey', borderRadius: 5 }} 
                            onClick={ () => this.props.removeAnnotationObject(this.state.id) }>X</button>
                </div>
                <div style={{ padding: 5 }}>
                    <p style={{ margin: 0, padding: 0, fontSize: 12 }}>{`x: ${x}, y: ${y}, w: ${w}, h: ${h}`}</p>
                </div>
            </div>
        )
    }
}

export default AnnotationObject;