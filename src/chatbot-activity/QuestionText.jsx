import React from 'react';
import './QuestionText.css';
import 'semantic-ui-css/semantic.min.css';

class QuestionText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        activeList: [false, false, false],
        clicked: false,
        done: false,
    }
    this.onClickHandler = this.onClickHandler.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  onClickHandler(index) {
    const { activeList } = this.state;
    const { correct, onCorrectHandler } = this.props;
    const newActiveList = [false, false, false];
    if ( !activeList[index] && index === correct) onCorrectHandler();
    newActiveList[index] = true;
    this.setState({
        activeList: newActiveList,
        clicked: true,
        done: index === correct,
    })
  }

  scrollToBottom = () => {
    this.props.messagesEnd.scrollIntoView({behavior: "smooth"});
  }

  componentDidUpdate(){
      console.log("updated!")
      this.scrollToBottom();
  }

  render() {
    const { type, lang, content, options, correct, number } = this.props;
    const { activeList, clicked, done } = this.state;
    return (
        <div className="text-center question-container">
            {
                type === 'v' // if the type of the question is vocab
                ?
                (
                    lang === "kor"
                    ?
                    // if the vocab is in Korean
                    <div className="question-wrapper">
                        <div className="question">{number+1+"."} <span className="content">{'"' + content + '"'}</span>{"의 뜻은 무엇입니까?"}</div>  
                        {/* <div className="question-translated">{number+1+". What is the meaning of "}<span className="content">{'"' + content + '"'}</span>{"?"}</div> */}
                    </div>
                    :
                    // if the vocab is in English
                    <div className="question-wrapper">
                        <div className="question">{number+1+". What is the meaning of "}<span className="content">{'"' + content + '"'}</span>{"?"}</div>
                        {/* <div className="question-translated">{number+1+"."} <span className="content">{'"' + content + '"'}</span>{"의 뜻은 무엇입니까?"}</div> */}
                    </div>
                )
                :
                "Grammar" // if the type of the question is grammar
            }
            {
                <div className="btn-group btn-group-justified">
                    {
                        Object.keys(options).map((value,index) => (
                            <div className="btn-group">
                                <button type="button" 
                                    className={
                                        activeList[index] ?
                                            done ?
                                            "btn btn-select btn-primary btn-correct"
                                            :
                                            "btn btn-select btn-primary btn-wrong"
                                        :
                                        (done ?
                                        "btn btn-select btn-primary disabled"
                                        :
                                        "btn btn-select btn-primary"
                                        )
                                    }
                                    onClick={() => (!done && this.onClickHandler(index))}
                                    >
                                    {["a","b","c"][index]+". "+options[index]}
                                </button>
                            </div>
                        ))
                    }
                </div>
            }
            {
                clicked && 
                (
                    (activeList.indexOf(true) === correct) ?
                    <div className="question-feedback correct">Great job, you are correct.</div>
                    :
                    <div className="question-feedback wrong">
                        The correct answer is <span className="option-correct">{options[correct]}</span>.
                        <div>Press the correct answer to proceed.</div>
                    </div>
                )
            }
        </div>
    )
  }
}

export default QuestionText
