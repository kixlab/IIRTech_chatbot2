import React from 'react';

class QuestionSelect extends React.Component {
  render(){
    console.log(this.props.questionOptions);
    const questionList = this.props.questionOptions.map((message, index) => {
      return (
        <li className="questionBtn" key={index}>
          <input className="buttonText" type="button" value={message} onClick={() => this.props.onQuestionSelect(index)}/>
        </li>
      );
    });
    return(
      <div>
        <div className="questionText">어떤 부분이 궁금한가요?</div>
        <div style={{textAlign:'center'}}>
            <ol className="questionList">
            {questionList}
          </ol>
        </div>
      </div>
    )
  }
}

export default QuestionSelect;
