import React from 'react';
import './BotMessage.css';
import { Button } from 'semantic-ui-react';
import { BASE_URL } from '../configs/costants';

class BotMessage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      translated: false,
      translatedText: "",
    }
    this.translate = this.translate.bind(this);
    this.translateClickHandler = this.translateClickHandler.bind(this);
  }

  translate(text) {
    fetch(`${BASE_URL}/iirtech/translateToEnglish?text=${text}`, {"Access-Control-Allow-Origin":"*"})
        .then(res => res.json())
        .then(response => this.setState({translatedText:response['translatedText']}))
  }

  translateClickHandler() {
    const _text = this.props.content
    fetch(`${BASE_URL}/iirtech/translateToEnglish?text=${_text}`, {"Access-Control-Allow-Origin":"*"})
        .then(res => res.json())
        .then(response => this.setState(
          {
            translatedText:response['translatedText'],
            translated: true,
          }))
  }

  render() {
    const botName = "Bot"
    const translated = this.state.translated;
    return(
      <div className="row">
        <div className="col-1 botimage align-self-start">
          <img src="/images/bot.png" alt="bot" />
        </div>
        <div className="col-9 col-auto botContentWrapper">
          <div>{botName}</div>
          <div className="col-auto botcontent">
            {this.props.content}
          </div>
          <div>
          </div>
          {translated?
            <div className="col-auto translatecontent">
              {
                this.state.translatedText
              }
            </div>
            :
            <Button size='mini' onClick={this.translateClickHandler}>
              Translate
            </Button>
          }
          

        </div>
      </div>
    )
  }
}

export default BotMessage;
