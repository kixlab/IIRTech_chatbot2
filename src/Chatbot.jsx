import React from 'react';
import "./Chatbot.css";
import MessageBox from './MessageBox';
import InputBox from './InputBox';
import { BASE_URL } from './configs/costants';

class Chatbot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageLog: [{
        type: 2,
        content: "꼭 문장부호(sentence punctuation: .?!)를 쓰세요.",
        format: false,
      }],                     // List of messages so far
      currentMessage: "",     // Message in the text input box
      userid: '',             // Unique uuid for the session
      tense: null,            // Tense chosen by the user
      buttonDisabled: false,  // Whether the 'Send' button is disabled
      revise: false,          // Boolean value for revision, to add the grammar correction
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleInit = this.handleInit.bind(this);
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
    const {topic} = this.props;
    this.initBot(topic);
  }

  initBot(topic) {
    fetch(`${BASE_URL}iirtech/initializeBot?topic=${topic}`, {"Access-Control-Allow-Origin":"*"})
      .then(res => res.json())
      .then(response =>this.handleInit(response));
  }

  // ends the session by closing the log file
  closeBot() {
    fetch(`${BASE_URL}iirtech/closeBot?userid=${this.state.userid}`, {"Access-Control-Allow-Origin":"*"})
      .then(res => res.json())
      .then(response => console.log("Close: ", response.success))
  }

  // writes the current message to the log
  addLog(msg) {
    const type = msg.type;
    const content = msg.content;
    fetch(`${BASE_URL}/iirtech/handleLog?type=${type}&content=${content}&userid=${this.state.userid}`, {"Access-Control-Allow-Origin":"*"})
      .then(res => res.json())
      .then(response => console.log("Logging: ", response.success))
  }

  // updates the bot's tense and retrieves the guide message (two different messages for past and future)
  chooseTense(tense) {
    fetch(`${BASE_URL}/iirtech/chooseTense?tense=${tense}&userid=${this.state.userid}`, {"Access-Control-Allow-Origin":"*"})
      .then(res => res.json())
      .then(response => this.handleTense(response))
  }

  // sends a message to python side for retrieval of bot's next utterance
  sendMessage(text, type, index, userid) {
    if (type===0){
      const {topic} = this.props;
      fetch(`${BASE_URL}/iirtech/fetchMessage?text=${text}&type=${type}&index=${index}&userid=${userid}&topic=${topic}`, {"Access-Control-Allow-Origin":"*"})
        .then(res => res.json())
        .then(response => this.handleResponse(response))
    }
    else{
      fetch(`${BASE_URL}/iirtech/fetchMessage?text=${text}&type=${type}&index=${index}&userid=${userid}`, {"Access-Control-Allow-Origin":"*"})
        .then(res => res.json())
        .then(response => this.handleResponse(response))
    }
  }

  // sets the bot's tense and append the guide message to the message box.
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

    fetch(`${BASE_URL}/iirtech/fetchMessage?text=${""}&type=${1}&index=${0}&userid=${this.state.userid}`, {"Access-Control-Allow-Origin":"*"})
      .then(res => res.json())
      .then(response => this.handleResponse(response))
  }

  handleInit(response) {
    const text = response.text;
    const userid = response.userid;
    const success = parseInt(response.success,10);

    if (!success) return;
    if (!this.state.userid) this.setState({userid: userid});
    
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

  // Handler for the data sent from the python server.
  // Gets the relevant information and appends the data to the message box in the correct format
  handleResponse(response) {
    const original = response.original;
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
    if (type === 1) { // Exit current session and print message
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
    // else if(type === 4) {
    //   for(let i = 0; i < text.length; i++){
    //     this.appendMessage([
    //       {
    //         type: 0,
    //         content: text[i],
    //         format: false,
    //       }
    //     ])
    //   }
    //   if(response.hasTense){
    //     this.appendMessage([
    //       {
    //         type: 2,
    //         content: "경험이 있으면 얘기해보고, 없으면 미래의 경험을 상상해 대화해볼까요?",
    //         format: false,
    //       },
    //       {
    //         type: 2,
    //         content: "네, 아니요로 답해봅시다.",
    //         format: false,
    //       }
    //     ])
    //     this.appendMessage([
    //       {
    //         type:3,
    //         content: "Choice Message"
    //       }
    //     ])
    //   }
    // }
    else {
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

  // Handler for the case when the user chooses the tense.
  handleTenseChoice(tense) {
    this.chooseTense(tense)
    this.setState({
      buttonDisabled: false,
    })
  }

  // Handler to keep track of the current message in the textarea
  handleChange(newText) {
    this.setState({
      currentMessage: newText,
    });
  }

  // appends the message to the state messageLog list, and writes it to the log by calling addLog function
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
      <div className="container chatbot col-8" /*style={{padding:'5px 0'}}*/>
        <MessageBox messageLog={this.state.messageLog} handleClick={this.handleTenseChoice} done={this.state.tense!=null} chosen={this.state.tense==='p'?0:1} revise={this.state.revise}/>
        <InputBox handleChange={this.handleChange} handleClick = {this.handleClick} newText={this.state.currentMessage} disabled={this.state.buttonDisabled}/>
      </div>
    )
  }
}

export default Chatbot
