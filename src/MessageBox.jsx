import React from 'react';
import './MessageBox.css';
import Message from './Message'
class MessageBox extends React.Component {

  render() {
    const messageList = this.props.messageLog.map((message, index) => {
      return (
        <Message key={index} type={message.type} content={message.content} />
      )
    })
    return (
      <div className='messagebox'>
        {messageList}
      </div>
    );
  }
}

export default MessageBox;
