import React from 'react';
import './InputBox.css'
import 'semantic-ui-css/semantic.min.css';

class InputBox extends React.Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.keyPress = this.keyPress.bind(this);
  }

  // Handler for the textarea content change
  // Passed from Chatbot > handleChange()
  handleChange(event) {
    this.props.handleChange(event.target.value);
  }

  keyPress(e) {
    if(e.keyCode == 13 && !this.props.disabled) {
      this.props.handleClick(this.props.newText);
    }
  }

  render() {
    const disabled = this.props.disabled
    return (
      <div className='inputBox row justify-content-between'>
        <textarea className="col-10 inputText align-self-end" onKeyDown = {this.keyPress} value={this.props.newText} onChange={this.handleChange}/>
        {
          disabled?
            <button type="button" className={"col-2 inputButton align-self-end"} onClick={() => this.props.handleClick(this.props.newText)} disabled>Send</button> :
            <button type="button" className={"col-2 inputButton align-self-end"} onClick={() => this.props.handleClick(this.props.newText)}>Send</button> 
        }
       
      </div>
    );
  }
}

export default InputBox;
