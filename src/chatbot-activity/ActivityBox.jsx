import React from 'react';
import QuestionText from './QuestionText';
import './ActivityBox.css';
import { Dimmer, Loader, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { BASE_URL } from '../configs/costants';

// ActivityBox component renders all activities on the selected topic
// The activity contents are fetched from the server
// GET iirtech/fetchActivitiy
// Parameter
// topic={topic} - topic is the string in Korean

// activity is matching translated words from Korean to English or vice versa.

class ActivityBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        contents: [],
        questionIndex: 1,
        done: false,
        loading: true,
    }
    this.onCorrectHandler = this.onCorrectHandler.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({behavior: "smooth"});
  }

  componentDidUpdate() {
    this.scrollToBottom();
    console.log("Activity updated!")
  }


  componentDidMount() {
    this.scrollToBottom();
    const {topic} = this.props;
    var t = '';
    fetch(`${BASE_URL}/iirtech/fetchActivity?topic=${topic}`, {"Access-Control-Allow-Origin":"*"})
        .then(res => res.json())
        .then(response => this.setState({contents:response['response'],loading:false},() => (console.log(this.state.contents))))
  }

  onCorrectHandler() {
        const { questionIndex, contents } = this.state;
        const { addVocab } = this.props;
        const content = contents[questionIndex-1]
        const word1 = content['content']
        const word2 = content['options'][content['correct']];
        if (content['lang'] === 'kor') addVocab(word1, word2)
        else addVocab(word2, word1);
        if ( questionIndex < contents.length ) {
        // if ( questionIndex < 5 ) {
            const newQuestionIndex = questionIndex + 1;
            this.setState({questionIndex: newQuestionIndex})
        }
        else {
            this.setState({done: true});
        }
  }

  render() {
    const { contents, questionIndex, done, loading } = this.state; 
    const { onProceedHandler, topic } = this.props;
    return (
        <div className="container chatbot col-8 activitybox" style={{paddingBottom: '200px'}}>
            {
                loading ?
                <Dimmer active>
                    <Loader />
                </Dimmer>
                :
                <div/>
            }
            {
                contents.length>=questionIndex &&
                (
                    <div className="text-center" style={{paddingTop: '20px'}}>
                        <h3 style={{fontWeight: '400'}}><strong>{topic}</strong> 주제에 대해 대화를 나누기에 앞서, 주요 단어를 배워봅시다.</h3>
                    {[... Array(questionIndex)].map((e,index) => (
                            <QuestionText
                                key={index}
                                number={index}
                                type={contents[index]['type']}
                                lang={contents[index]['lang']}
                                content={contents[index]['content']}
                                options={contents[index]['options']}
                                correct={contents[index]['correct']}
                                onCorrectHandler={this.onCorrectHandler}
                                messagesEnd={this.messagesEnd}
                            />
                    ))
                    }
                    </div>
                )
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
            <div style={{ float:"left", clear: "both" }}
                ref={(el) => { this.messagesEnd = el; }}>
            </div>
        </div>
    )
  }
}

export default ActivityBox
