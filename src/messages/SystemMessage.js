import React from 'react';
import './SystemMessage.css';

class SystemMessage extends React.Component {
  render() {
    return(
      <div className="row justify-content-center">
        <div className="col-9 col-auto contentWrapper">
          <div className="col-auto systemcontent">
            {this.props.content}
          </div>
        </div>
      </div>
    )
  }
}

export default SystemMessage;
