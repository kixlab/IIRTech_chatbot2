import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import QuestionPrompt from './QuestionPrompt.js';

class Message extends React.Component {
  render() {
    var type, msgHead;
    if (this.props.type == 2) {
      type = "userMsg";
      msgHead = "User";
    }
    else if (this.props.type == 0){
      type = "botMsg";
      msgHead = "Bot";
    }
    return (
      <div className={type+"Container"}>
        <div className={type+"Header"}>{msgHead}</div>
        <div className={type}>{this.props.msg}</div>
      </div>
    )
  }
}

class MessageBox extends React.Component {
  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.el.scrollIntoView({behavior: 'smooth'});
  }

  render() {
    const messageList = this.props.log.map((message, index) => {
      return (
        <div key={index}>
          <Message
            type={message.type}
            msg={message.message}
          />
        </div>

      );
    });
    return(
      <div className="messageBox">
        {messageList}
        <QuestionPrompt onQuestionClick={this.props.onQuestionClick}/>
        <div ref={el => { this.el = el; }} />
      </div>
    );
  }
}

class InputArea extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.onChange(event.target.value);
  }

  render() {
    return(
      <input className="textInput"
        type="text"
        value={this.props.value}
        onChange={this.handleChange}
        onKeyPress={this.props.onKeyPress}
      />
    );
  }
}

class InputBtn extends React.Component {
  render(){
    return(
      <input
        type="button"
        value={this.props.value}
        onClick={this.props.onClick}
      />
    )
  }
}

class InputBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentContent: "",
    };
    this.handleClick = this.handleClick.bind(this);
    this.updateContent = this.updateContent.bind(this);
  }

  handleClick() {
    if(this.state.currentContent !== "") {
      this.props.onClick(this.state.currentContent);
      this.setState({
        currentContent: "",
      });
    }
  }

  handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      this.handleClick();
    }
  }

  updateContent(newContent) {
    this.setState({
      currentContent: newContent,
    });
  }

  render() {
    return(
      <div className="inputArea">
        <InputArea value={this.state.currentContent} onChange={this.updateContent} onKeyPress={this.handleKeyPress} />
        <InputBtn value="Send" onClick={this.handleClick} />
      </div>
    )
  }
}

class Chatbot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageLog: [],
      initialized: false,
      userid: '',
    };
    this.sendPOSTMessage = this.sendPOSTMessage.bind(this);
    this.handleQuestion = this.handleQuestion.bind(this);
  }

  componentDidMount() {
    if (!this.state.initialized) {
      this.setState({initialized: true});
      this.sendPOSTMessage('initialize', 0, -1);
    }
  }

  sendPOSTMessage(text, type, index) {
    fetch('/fetchMessage?text=' + text + "&type=" + type + "&index=" + index, {'Access-Control-Allow-Origin':'*'})
      .then(res => res.json())
      .then((result) =>
        (
          result['success'] ? this.setState({
            messageLog: this.state.messageLog.slice(0, this.state.messageLog.length).concat([{
              type:result['type'],
              message: result['text']
          }]),
          userid: result['userid'],
        }) : null
        )
      )
  }
  handleClick(newMessage) {
    const messageLog = this.state.messageLog.slice(0, this.state.messageLog.length);
    fetch('/fetchMessage?text='+newMessage, {'Access-Control-Allow-Origin':'*'})
      .then(res => res.json())
      .then((result) => {
        console.log(result);
        this.setState({
          messageLog: this.state.messageLog.slice(0, this.state.messageLog.length).concat([{
            type:0,
            message: "Message Received: " + result.msg
          }])
        })
      })
      this.setState({
        messageLog: this.state.messageLog.slice(0, this.state.messageLog.length).concat([{
          type: 2,
          message: newMessage,
        }])
      })
  }
  handleQuestion(question) {
    this.sendPOSTMessage(question, 1, -1);
  }

  render() {
    return (
      <div className="chatbot">
        <MessageBox onQuestionClick={this.handleQuestion} log={this.state.messageLog} />
        <InputBox onClick={(newMessage) => this.handleClick(newMessage)}/>
      </div>
    );
  }
}

ReactDOM.render(
  <Chatbot />,
  document.getElementById('root')
);
