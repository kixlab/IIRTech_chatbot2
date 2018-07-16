import React from 'react';

class QuestionPrompt extends React.Component {
  render(){
    return(
      <div>
        <div className="questionText">위 문장에서 특정 유형의 질문이 있으신가요?</div>
        <div style={{textAlign:'center'}}>
            <ol className="questionList">
            <li className="questionBtn">
              <input className="buttonText" type="button" value="1. 어휘" onClick={() => this.props.onQuestionClick("어휘")}/>
            </li>
            <li className="questionBtn">
              <input className="buttonText" type="button" value="2. 문법" onClick={() => this.props.onQuestionClick("문법")}/>
            </li>
            <li className="questionBtn">
              <input className="buttonText" type="button" value="3. 발음" onClick={() => this.props.onQuestionClick("발음")}/>
            </li>
            <li className="questionBtn">
              <input className="buttonText" type="button" value="4. 기타" onClick={() => this.props.onQuestionClick("기타")}/>
            </li>
            <li className="questionBtn">
              <input className="buttonText" type="button" value="5. 없음" onClick={() => this.props.onQuestionClick("없음")}/>
            </li>
          </ol>
        </div>
      </div>
    )
  }
}

export default QuestionPrompt;
