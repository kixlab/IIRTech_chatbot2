import React from 'react';
import './SystemMessage.css';

class SystemMessage extends React.Component {

  render() {
    const format = this.props.format;
    return(
      <div className="row justify-content-center">
        <div className="col-9 col-auto contentWrapper">
          {
            format?
            <div className="col-auto systemcontent">
              앞에서 배운 <span className="red-font">{this.props.content}</span>  같은 단어를 써볼까요?
            </div>
            :
            <div className="col-auto systemcontent">
              {this.props.content}
            </div>
          }
          
        </div>
      </div>
    )
  }
}

export default SystemMessage;
