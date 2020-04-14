import React from 'react';
import AnnotationObject from './AnnotationObject';
import { Edit } from '@material-ui/icons';
import '../App.css';

const Sidebar = props => {

    const toTitleCase = (text) => (
        text.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')
    )

    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginRight: 20, width: 190 }}>
            <p style={{ margin: 0, padding: 0, color: 'grey', fontSize: 14, marginRight: 'auto', marginLeft: 'auto' }}>
                Annotated By: <Edit onClick={ props.editAnotatorName } style={{ fontSize: 14, marginLeft: 10, marginBottom: -5, padding: 2, border: '2px solid grey', borderRadius: 5 }} /></p>
            <p style={{ margin: 0, padding: 0, color: 'grey', fontSize: 14, marginRight: 'auto', marginLeft: 'auto', overflow: 'visible' }}>{ toTitleCase(props.annotatorName) }</p>
            <button className="box-shadow"
                    style={{ width: '80%', marginRight: 'auto', marginLeft: 'auto', marginBottom: 10, marginTop: 10 }} 
                    onClick={ props.displayResults }>submit annotation</button>
            <button className="box-shadow"
                    style={{ width: '80%', marginRight: 'auto', marginLeft: 'auto', marginBottom: 10, marginTop: 10 }} 
                    onClick={ props.clearAll}>clear all</button>
            <button className="box-shadow"
                    style={{ width: '80%', marginRight: 'auto', marginLeft: 'auto', marginBottom: 10, marginTop: 10 }} 
                    onClick={ props.removeLastAnnotation }>undo last</button>
            <button className="box-shadow"
                    style={{ width: '80%', marginRight: 'auto', marginLeft: 'auto', marginBottom: 10, marginTop: 10 }} 
                    onClick={ props.excludeImage }>exclude this image</button>

            { props.annotations.length > 0 ?
                <p style={{ padding: 0, margin: 0, marginTop: 5, paddingLeft: 10, fontSize: 14, color: 'grey '}}>
                    Annotations: 
                    <span style={{ fontSize: 12, marginLeft: 10, border: '1px solid grey', borderRadius: '50%', paddingRight: 5, paddingLeft: 4, fontWeight: 'bold', fontStyle: 'italic' }}>{props.annotations.length}</span>
                </p> :
                null
            }
            <div className="scroll" style={{ height: '50vh'}}>
                { props.annotations.length > 0 ? props.annotations.map( a => (
                    <AnnotationObject 
                                    key={a.id}    
                                    annotation={a} 
                                    changeAnnotationObjectClass={props.changeAnnotationObjectClass}
                                    removeAnnotationObject={props.removeAnnotationObject} />
                    )) :
                    null
                }
            </div>
        </div>
    )
}

export default Sidebar;