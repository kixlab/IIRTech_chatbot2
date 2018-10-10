import React from 'react';
import "./Chatbot.css";
import MessageBox from './MessageBox';
import InputBox from './InputBox';

class Chatbot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageLog: [{type: 2, content:"Please type a message to start."}],
      currentMessage: "",
      userid: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
  }

  componentDidMount() {
    const text = 'starting a new bot';
    const type = 0;
    const index = -1;
    const userid = '';
    this.sendMessage(text, type, index, userid);
  }

  sendMessage(text, type, index, userid) {
    
    fetch(`iirtech/fetchMessage?text=${text}&type=${type}&index=${index}&userid=${userid}`, {"Access-Control-Allow-Origin":"*"})
      .then(res => res.json())
      .then(response => this.handleResponse(response))
  }

  handleResponse(response) {
    const text = response.text;
    console.log(text)
    const type = parseInt(response.type,10);
    const success = parseInt(response.success,10);
    const userid = response.userid;
    if (!success) return;
    if (!this.state.userid) this.setState({userid: userid});
    if (type === 3){ // Exit current session and print message
      for(let i = 0; i < text.length; i++){
        this.appendMessage([
          {
            type: 0,
            content: text[i], // Sample user message
          }
        ])
      }
      this.appendMessage([
        {
          type: 2,
          content: "This is the end of current conversation"
        }
      ])
    }
    else{
      for(let i = 0; i < text.length; i++){
        this.appendMessage([
          {
            type: type,
            content: text[i], // Sample user message
          }
        ])
      }
      
    }
    
  }

  // Method to keep track of the current message in the textarea
  handleChange(newText) {
    this.setState({
      currentMessage: newText,
    });
  }

  appendMessage(msg) {
    // msg:
      // List of json
      //    JSON format
      //      {
      //         type: 0 (BotMessage), 1 (UserMessage), 2 (SystemMessage)
      //         content: the context of the message in string
      //      }
    // 
    // e.g. [{type: 1, content: 'hello'},]
    for (let i=0; i<msg.length; i++) {
      console.log(msg[i])
      this.setState({
        messageLog: this.state.messageLog.slice().concat(msg[i])
      })
    }
    this.setState({
      currentMessage: "",
    })
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
      const text = newMessage;
      const type = 1;
      const index = 0;
      const userid = this.state.userid;
      this.sendMessage(text, type, index, userid);

      this.appendMessage([
        {
          type: 1,
          content: newMessage, // Sample user message
        },
        // {
        //   type: 0,
        //   content: `I received "${newMessage}"`
        // }
      ])
    }
  }

  render() {
    return (
      <div className="container chatbot">
        <MessageBox messageLog={this.state.messageLog} />
        <InputBox handleChange={this.handleChange} handleClick = {this.handleClick} newText={this.state.currentMessage} />
      </div>
    )
  }
}

export default Chatbot
