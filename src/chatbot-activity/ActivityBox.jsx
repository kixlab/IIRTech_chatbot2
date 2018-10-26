import React from 'react';
import QuestionText from './QuestionText';
import './ActivityBox.css';
import { Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

class ActivityBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        contents: [],
        questionIndex: 1,
        done: false,
    }
    this.onCorrectHandler = this.onCorrectHandler.bind(this);
  }

  componentDidMount() {
    fetch(`iirtech/fetchActivity`, {"Access-Control-Allow-Origin":"*"})
        .then(res => res.json())
        .then(response => this.setState({contents:response['response']}))

    // const json = [
    //     {
    //         type: 'v',
    //         lang: 'kor',
    //         content: '영화관',
    //         options: ['theater', 'shopping mall', 'sports complex'],
    //         correct: 0,
    //     },
    //     {
    //         type: 'v',
    //         lang: 'kor',
    //         content: '제목',
    //         options: ['subtitle', 'title', 'actor'],
    //         correct: 1,
    //     }
    //   ]
    //   this.setState({
    //       contents: json
    //   })
  }

  onCorrectHandler() {
        const { questionIndex, contents } = this.state;
        const { addVocab } = this.props;
        const content = contents[questionIndex-1]
        const word1 = content['content']
        const word2 = content['options'][content['correct']];
        if (content['lang'] === 'kor') addVocab(word1, word2)
        else addVocab(word2, word1);
        // if ( questionIndex < contents.length ) {
        if ( questionIndex < 5 ) {
            const newQuestionIndex = questionIndex + 1;
            this.setState({questionIndex: newQuestionIndex})
        }
        else {
            this.setState({done: true});
        }
  }

  render() {
    const { contents, questionIndex, done } = this.state; 
    const { onProceedHandler } = this.props;
    return (
        <div className="container chatbot col-8">
            {
                contents.length>=questionIndex &&
                [... Array(questionIndex)].map((e,index) => (
                    console.log(questionIndex,index),
                        <QuestionText
                            key={index}
                            number={index}
                            type={contents[index]['type']}
                            lang={contents[index]['lang']}
                            content={contents[index]['content']}
                            options={contents[index]['options']}
                            correct={contents[index]['correct']}
                            onCorrectHandler={this.onCorrectHandler}
                        />
                ))
            }
            {
                done &&
                <div className="feedback-final">
                    Nice work! You have just learned all the vocabulary.<br/>
                    Now, let's try to use them in a conversation
                    <div className="text-center button-wrapper">
                        <Button onClick={onProceedHandler} compact positive>Proceed</Button>
                    </div>
                </div>
            }
        </div>
    )
  }
}

export default ActivityBox
