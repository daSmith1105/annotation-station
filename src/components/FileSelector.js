import React from 'react';

class FileSelector extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.fileInput = React.createRef();
    }

    handleSubmit(event) {
      event.preventDefault();
    //   console.log(this.fileInput.current.files[0].name)
    //   this.props.setCurrentImage(this.fileInput.current.files[0].name)
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit} style={{ display: 'flex', marginLeft: 100, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
          <label style={{ fontSize: '.7em', color: 'white' }}>
            Upload file:
            <input type="file" ref={this.fileInput} style={{ marginLeft: 10}}/>
          </label>
          <button type="submit">Load</button>
        </form>
      );
    }
}

export default FileSelector;