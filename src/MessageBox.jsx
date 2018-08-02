import React from 'react';
import './MessageBox.css';
import Message from './Message'
class MessageBox extends React.Component {

  constructor(props){
    super(props);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({behavior: "smooth"});
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    const messageList = this.props.messageLog.map((message, index) => {
      return (
        <Message key={index} type={message.type} content={message.content} />
      )
    })
    return (
      <div className='messagebox'>
        {messageList}
        <div
          ref={(el) => {this.messagesEnd = el; }}>
        </div>
      </div>
    );
  }
}

export default MessageBox;
