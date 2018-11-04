import React from 'react';
import './UserMessage.css';

class UserMessage extends React.Component {
  render() {
    const userName = "User"
    return(
      <div className="row justify-content-end">
        <div className="col-9 col-auto userContentWrapper">
          <div style={{"textAlign":"right"}}>{userName}</div>
          <div className="col-12 col-auto usercontent float-right">
            {this.props.content}
          </div>
        </div>
        <div className="col-1 userimage align-self-start">
          <img src="/images/student.png" alt="student" />
        </div>
      </div>
    )
  }
}

export default UserMessage;
