import React from 'react';
import "./Chatbot.css";
import MessageBox from './MessageBox';
import InputBox from './InputBox';

class Chatbot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageLog: [],
      currentMessage: "",
      userid: '',
      tense: null,
      buttonDisabled: false,
      revise: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.handleTense = this.handleTense.bind(this);
    this.handleTenseChoice = this.handleTenseChoice.bind(this);
    this.chooseTense = this.chooseTense.bind(this);
    this.addLog = this.addLog.bind(this);
    this.closeBot = this.closeBot.bind(this)
  }

  componentDidMount() {
    const text = 'starting a new bot';
    const type = 0;
    const index = -1;
    const userid = '';
    this.sendMessage(text, type, index, userid);
  }

  closeBot() {
    fetch(`iirtech/closeBot?userid=${this.state.userid}`, {"Access-Control-Allow-Origin":"*"})
      .then(res => res.json())
      .then(response => console.log("Close: ", response.success))
  }

  addLog(msg) {
    const type = msg.type;
    const content = msg.content;
    fetch(`iirtech/handleLog?type=${type}&content=${content}&userid=${this.state.userid}`, {"Access-Control-Allow-Origin":"*"})
      .then(res => res.json())
      .then(response => console.log("Logging: ", response.success))
  }

  chooseTense(tense) {
    fetch(`iirtech/chooseTense?tense=${tense}&userid=${this.state.userid}`, {"Access-Control-Allow-Origin":"*"})
      .then(res => res.json())
      .then(response => this.handleTense(response))
  }

  sendMessage(text, type, index, userid) {
    if (type===0){
      const {topic} = this.props;
      fetch(`iirtech/fetchMessage?text=${text}&type=${type}&index=${index}&userid=${userid}&topic=${topic}`, {"Access-Control-Allow-Origin":"*"})
        .then(res => res.json())
        .then(response => this.handleResponse(response))
    }
    else{
      fetch(`iirtech/fetchMessage?text=${text}&type=${type}&index=${index}&userid=${userid}`, {"Access-Control-Allow-Origin":"*"})
        .then(res => res.json())
        .then(response => this.handleResponse(response))
    }
  }

  handleTense(response) {
    this.setState({
      tense: response.tense
    })
    
    const msgList = response.guidemsg.split(",");

    const pastText = msgList[0];
    const futureText = msgList[1];

    if(response.tense === 'f') {
      this.appendMessage([
        {
          type: 2,
          content: futureText,
          format: false,
        }
      ])
    }
    else {
      this.appendMessage([
        {
          type: 2,
          content: pastText,
          format: false,
        }
      ])
    }

    fetch(`iirtech/fetchMessage?text=${""}&type=${1}&index=${0}&userid=${this.state.userid}`, {"Access-Control-Allow-Origin":"*"})
      .then(res => res.json())
      .then(response => this.handleResponse(response))
  }

  handleResponse(response) {
    const original = response.original
    const text = response.text;
    const userline = response.nextline;
    const type = parseInt(response.type,10);
    const success = parseInt(response.success,10);
    const userid = response.userid;
    const errNum = parseInt(response.errorcount,10);
    const correctText = response.corrected;
    const vocabList = this.props.vocabList;
    
    var highlightList =[];
    var suggestMessage = "";

    if (userline != "") {
      for (var i = 0; i < vocabList.length; i++){
        if (userline.includes(vocabList[i]['korWord'])){
          highlightList.push(i);
          suggestMessage += vocabList[i]['korWord'] + ', ';
        }
      }
      suggestMessage = suggestMessage.substring(0, suggestMessage.length-2)
    }
    this.props.highlightHandler(highlightList)

    if (!success) return;
    if (!this.state.userid) this.setState({userid: userid});
    if (type === 3){ // Exit current session and print message
      if (original != ""){
        this.appendMessage([
          {
            type: 1,
            content: original,
            correct: correctText,
            errNo: errNum,
          }
        ])
      }
      for(let i = 0; i < text.length; i++){
        this.appendMessage([
          {
            type: 0,
            content: text[i],
          }
        ])
      }
      this.appendMessage([
        {
          type: 2,
          content: "잘했어요! 대화를 다시 보며 맞춤법을 확인해볼까요?",
          format: false,
        }
      ])
      this.setState({
        buttonDisabled: true,
        revise: true,
      });
      this.closeBot()
    }
    else if(type === 4) {
      for(let i = 0; i < text.length; i++){
        this.appendMessage([
          {
            type: 0,
            content: text[i],
            format: false,
          }
        ])
      }
      if(response.hasTense){
        this.appendMessage([
          {
            type: 2,
            content: "경험이 있으면 얘기해보고, 없으면 미래의 경험을 상상해 대화해볼까요?",
            format: false,
          },
          {
            type: 2,
            content: "네, 아니요로 답해봅시다.",
            format: false,
          }
        ])
        this.appendMessage([
          {
            type:3,
            content: "Choice Message"
          }
        ])
      }
    }
    else{
      if (original != ""){
        this.appendMessage([
          {
            type: 1,
            content: original,
            correct: correctText,
            errNo: errNum,
          }
        ])
      }
      for(let i = 0; i < text.length; i++){
        this.appendMessage([
          {
            type: type,
            content: text[i],
            format: false,
          }
        ])
      }
      if (suggestMessage != ""){
        this.appendMessage([
          {
            type: 2,
            content: suggestMessage,
            format: true,
          }
        ])
      }
    }
  }

  handleTenseChoice(tense) {
    this.chooseTense(tense)
    this.setState({
      buttonDisabled: false,
    })
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
      this.setState({
        messageLog: this.state.messageLog.slice().concat(msg[i])
      });
      this.addLog(msg[i]);
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
    }
  }

  render() {
    return (
      <div className="container chatbot col-8">
        <MessageBox messageLog={this.state.messageLog} handleClick={this.handleTenseChoice} done={this.state.tense!=null} chosen={this.state.tense==='p'?0:1} revise={this.state.revise}/>
        <InputBox handleChange={this.handleChange} handleClick = {this.handleClick} newText={this.state.currentMessage} disabled={this.state.buttonDisabled}/>
      </div>
    )
  }
}

export default Chatbot
