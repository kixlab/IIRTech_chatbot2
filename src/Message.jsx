import React from 'react';
import './Message.css';
import BotMessage from './messages/BotMessage';
import UserMessage from './messages/UserMessage';
import SystemMessage from './messages/SystemMessage';

class Message extends React.Component {
  render() {
    const type = this.props.type;
    const content = this.props.content;
    if(type === 0) {
      return (
        <div className="container messageWrapper">
          <BotMessage content={content}/>
        </div>
      )
    }
    else if(type === 1) {
      return (
        <div className="container messageWrapper">
          <UserMessage content={content}/>
        </div>
      )
    }
    else if(type === 2) {
      return(
        <div className="container messageWrapper">
          <SystemMessage content={content}/>
        </div>
      )
    }
  }
}

export default Message;
