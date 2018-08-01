import React from 'react';
import './Inputbox.css'

class Inputbox extends React.Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  // Handler for the textarea content change
  // Passed from Chatbot > handleChange()
  handleChange(event) {
    this.props.handleChange(event.target.value);
  }

  render() {
    return (
      <div className='inputBox row justify-content-between'>
        <textarea className="col-10 inputText align-self-end" value={this.props.newText} onChange={this.handleChange}/>
        <input type="button" className="col-2 inputButton align-self-end" value="Send" onClick={() => this.props.handleClick(this.props.newText)}/>
      </div>
    );
  }
}

export default Inputbox;
