import React from 'react';
import AnnotationObject from './AnnotationObject';

const Sidebar = props => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: 240 }}>
            <button style={{ marginBottom: 10, marginTop: 10 }} 
                    onClick={ props.displayResults }>submit annotation</button>
            <button style={{ marginBottom: 10, marginTop: 10 }} 
                    onClick={ props.removeLastAnnotation }>undo last</button>
            <button style={{ marginBottom: 10, marginTop: 10 }} 
                    onClick={ props.excludeImage }>exclude this image</button>
            <button style={{ marginBottom: 10, marginTop: 10 }} 
                    onClick={ props.clearAll}>clear all</button>

            { props.annotations.length > 0 ? props.annotations.map( a => (
                <AnnotationObject key={a.id}    
                                  annotation={a} 
                                  changeAnnotationObjectClass={props.changeAnnotationObjectClass}
                                  removeAnnotationObject={props.removeAnnotationObject} />
                )) :
                null
            }
        </div>
    )
}

export default Sidebar;