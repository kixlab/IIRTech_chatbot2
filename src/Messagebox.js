import React from 'react';
import './Messagebox.css';
import Message from './Message.js'
class Messagebox extends React.Component {

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

export default Messagebox;
