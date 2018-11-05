import React from 'react';
import './UserMessage.css';

class UserMessage extends React.Component {
  constructor(props){
    super(props);
    this.parseCorrection = this.parseCorrection.bind(this);
  }
  parseCorrection(x) {
    if(x[1] == 0){
      return <span>{x[0]} </span>
    }
    else if(x[1] == 1){
      return <span className='redFont'>{x[0]} </span>
    }
    else if(x[1] == 2){
      return <span className='greenFont'>{x[0]} </span>
    }
    else if(x[1] == 3){
      return <span className='purpleFont'>{x[0]} </span>
    }
    else if(x[1] == 4){
      return <span className='blueFont'>{x[0]} </span>
    }
  }
  render() {
    const userName = "User";
    const revise = this.props.revise;
    const correct = this.props.correct;
    const errNo = this.props.errNo;
    return(
      <div className="row justify-content-end">
        <div className="col-9 col-auto userContentWrapper">
          <div style={{"textAlign":"right"}}>{userName}</div>
          <div className="col-12 col-auto usercontent float-right">
            {this.props.content}
          </div>
          {
            (revise && errNo > 0)?
            <div className="col-12 col-auto usercontent float-right">
              {correct.map(x => this.parseCorrection(x))}
            </div>
            :
            (null)
          }
          
        </div>
        <div className="col-1 userimage align-self-start">
          <img src="/images/student.png" alt="student" />
        </div>
      </div>
    )
  }
}

export default UserMessage;
