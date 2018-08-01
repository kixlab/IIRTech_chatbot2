import React from 'react';
import './Message.css';
import BotMessage from './messages/BotMessage.js';
import UserMessage from './messages/UserMessage.js';
import SystemMessage from './messages/SystemMessage.js';

class Message extends React.Component {
  render() {
    const type = this.props.type;
    const content = this.props.content;
    if(type === 1) {
      return (
        <div className="container messageWrapper">
          <BotMessage content={content}/>
        </div>
      )
    }
    else if(type === 2) {
      return (
        <div className="container messageWrapper">
          <UserMessage content={content}/>
        </div>
      )
    }
    else if(type === 3) {
      return(
        <div className="container messageWrapper">
          <SystemMessage content={content}/>
        </div>
      )
    }
  }
}

export default Message;
