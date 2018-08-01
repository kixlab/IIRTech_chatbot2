import React from 'react';
import "./Chatbot.css";
import Messagebox from './Messagebox.js';
import Inputbox from './Inputbox.js';

class Chatbot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageLog: [{type: 3, content:"Please type a message to start."}],
      currentMessage: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  // Method to keep track of the current message in the textarea
  handleChange(newText) {
    this.setState({
      currentMessage: newText,
    });
  }

  // Handler for the send button click event
  // Strips the input message and adds to the messageLog if not empty
  handleClick(newMessage) {
    newMessage = newMessage.trim();
    if (newMessage === '') {
        // Message consists of all whitespace
        this.setState({
          currentMessage: "",
        });
    }
    else {
      this.setState({
        messageLog: this.state.messageLog.slice(0, this.state.messageLog.length).concat([{
          type: 2,
          content: newMessage, // Sample user message
        },
        {
          type: 1,
          content: `I received "${newMessage}"`
        }]),
        currentMessage: "",
      });
    }
  }

  render() {
    return (
      <div className="container chatbot">
        <Messagebox messageLog={this.state.messageLog} />
        <Inputbox handleChange={this.handleChange} handleClick = {this.handleClick} newText={this.state.currentMessage} />
      </div>
    )
  }
}

export default Chatbot
