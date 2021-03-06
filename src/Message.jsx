import React from 'react';
import './Message.css';
import BotMessage from './messages/BotMessage';
import UserMessage from './messages/UserMessage';
import SystemMessage from './messages/SystemMessage';
import ChoiceMessage from './messages/ChoiceMessage';

class Message extends React.Component {
  render() {
    const type = this.props.type;
    const content = this.props.content;
    const correct = this.props.correct;
    const revise = this.props.revise;
    const errNo = this.props.errNo;
    const format = this.props.format;
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
          <UserMessage content={content} revise={revise} correct={correct} errNo={errNo}/>
        </div>
      )
    }
    else if(type === 2) {
      return(
        <div className="container messageWrapper">
          <SystemMessage content={content} format={format}/>
        </div>
      )
    }
    else if(type === 3) {
      return(
        <div className="container messageWrapper">
          <ChoiceMessage handleClick={this.props.handleClick} done={this.props.done} chosen={this.props.chosen}/>
        </div>
      )
    }
  }
}

export default Message;
