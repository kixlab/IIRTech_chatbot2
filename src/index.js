import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import QuestionPrompt from './QuestionPrompt.js';
import QuestionSelect from './QuestionSelect.js';

class Message extends React.Component {
  render() {
    var type, msgHead;
    if(this.props.type == 1){
      return (
      <QuestionSelect questionOptions={this.props.msg} onQuestionSelect={this.props.onQuestionSelect} />
      )
    }
    else if (this.props.type == 2) {
      type = "userMsg";
      msgHead = "User";
      return (
        <div className={type+"Container"}>
          <div className={type+"Header"}>{msgHead}</div>
          <div className={type}>{this.props.msg}</div>
          <QuestionPrompt show={this.props.show} disabled={this.props.disabled} onQuestionClick={this.props.onQuestionClick}/>
        </div>
      )
    }
    else if (this.props.type == 0){
      type = "botMsg";
      msgHead = "Bot";
      return (
        <div className={type+"Container"}>
          <div className={type+"Header"}>{msgHead}</div>
          <div className={type}>{this.props.msg}</div>
          <QuestionPrompt show={this.props.show} disabled={this.props.disabled} onQuestionClick={this.props.onQuestionClick}/>
        </div>
      )
    }

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
    console.log(this.props)
    const messageList = this.props.log.map((message, index) => {
      return (
        <div key={index}>
          <Message
            disabled={this.props.disabled}
            type={message.type}
            msg={message.message}
            show={((this.props.followup===1 && this.props.log.length-2===index) || (this.props.log.length-1===index)) ? true : false}
            onQuestionClick={this.props.onQuestionClick}
            onQuestionSelect={this.props.onQuestionSelect}
          />
        </div>

      );
    });
    return(
      <div className="messageBox">
        {messageList}
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
      followup: 0,
      initialized: false,
      userid: '',
      disabled: false,
    };
    this.sendPOSTMessage = this.sendPOSTMessage.bind(this);
    this.handleQuestion = this.handleQuestion.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
  }

  componentDidMount() {
    if (!this.state.initialized) {
      this.setState({initialized: true});
      this.sendPOSTMessage('initialize', 0, -1, '');
    }
  }

  sendPOSTMessage(text, type, index, userid) {
    fetch('/fetchMessage?text=' + text + "&type=" + type + "&index=" + index + "&userid=" + userid, {'Access-Control-Allow-Origin':'*'})
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
    this.setState({
      disabled: !this.state.disabled,
    })
    const lastMsg = this.state.messageLog[this.state.messageLog.length-1]['message'];
    const splitMsg = lastMsg.split(" ").map((msg) => msg.trim());
    if(question !== 5){
      this.setState({
        messageLog: this.state.messageLog.slice(0, this.state.messageLog.length).concat([{
          type:1,
          message: splitMsg,
        }]),
        typeOfQuestion: question,
        followup: 1,

      })
    }

    return <QuestionSelect questionOptions={splitMsg}/>
    //this.sendPOSTMessage(question, 1, -1, this.state.userid);
  }

  handleSelection(questionNo) {
    this.setState({
      disabled: !this.state.disabled
    })
    var newLog = this.state.messageLog.slice(0, this.state.messageLog.length);
    newLog.splice(newLog.length-1,1);
    this.setState({
      messageLog: newLog,
      followup: 0,
    })
    this.sendPOSTMessage(questionNo, 1, this.state.typeOfQuestion, this.state.userid);
  }

  render() {
    return (
      <div className="chatbot">
        <MessageBox onQuestionClick={this.handleQuestion} followup={this.state.followup} onQuestionSelect={this.handleSelection} log={this.state.messageLog}  disabled={this.state.disabled}/>
        <InputBox onClick={(newMessage) => this.handleClick(newMessage)}/>
      </div>
    );
  }
}

ReactDOM.render(
  <Chatbot />,
  document.getElementById('root')
);
