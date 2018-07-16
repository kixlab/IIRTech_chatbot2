import React from 'react';

class QuestionPrompt extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     activeLst = [false,false,false,false,false]
  //   }
  // }
  render(){
    return(
      <div style={{display: this.props.show ? 'block' : 'none', clear:'both'}}>
        <div className="questionText">위 문장에서 특정 유형의 질문이 있으신가요?</div>
        <div style={{textAlign:'center'}}>
            <ol className="questionList">
            <li className="questionBtn">
              <input className="buttonText" disabled={this.props.disabled} type="button" value="1. 어휘" onClick={() => this.props.onQuestionClick(1)}/>
            </li>
            <li className="questionBtn">
              <input className="buttonText" disabled={this.props.disabled} type="button" value="2. 문법" onClick={() => this.props.onQuestionClick(2)}/>
            </li>
            <li className="questionBtn">
              <input className="buttonText" disabled={this.props.disabled} type="button" value="3. 발음" onClick={() => this.props.onQuestionClick(3)}/>
            </li>
            <li className="questionBtn">
              <input className="buttonText" disabled={this.props.disabled} type="button" value="4. 기타" onClick={() => this.props.onQuestionClick(4)}/>
            </li>
            <li className="questionBtn">
              <input className="buttonText" disabled={this.props.disabled} type="button" value="5. 없음" onClick={() => this.props.onQuestionClick(5)}/>
            </li>
          </ol>
        </div>
      </div>
    )
  }
}

export default QuestionPrompt;
