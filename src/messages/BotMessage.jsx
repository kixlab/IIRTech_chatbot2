import React from 'react';
import './BotMessage.css';

class BotMessage extends React.Component {
  render() {
    const botName = "Bot"
    return(
      <div className="row">
        <div className="col-1 botimage align-self-start">Image</div>
        <div className="col-9 col-auto botContentWrapper">
          <div>{botName}</div>
          <div className="col-auto botcontent">
            {this.props.content}
          </div>
        </div>
      </div>
    )
  }
}

export default BotMessage;
