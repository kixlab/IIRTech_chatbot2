import React from 'react'
//import './MainScreen.css'
import Chatbot from './Chatbot'
import Sidebox from './Sidebox'
import ActivityBox from './chatbot-activity/ActivityBox'
import { Button } from 'semantic-ui-react';


class MainScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            vocabList: [],
            highlightList: [],
            topic: false,
            // topicList: ['영화관', '여행', '건강', '취미', '교통']
            topicList: ['영화관', '여행', '건강', '3급 일상생활', '3급 건강', '3급 교통', '3급 여행', '4급 쇼핑', '5급 학교생활',
            //'4급 일상생활', '4급 건강', '4급 쇼핑', '4급 여행', '5급 음식', '5급 학교생활', '5급 여행', '5급 날씨'
            ]
        }
        this.addVocab = this.addVocab.bind(this);
        this.onProceedHandler = this.onProceedHandler.bind(this);
        this.highlightHandler = this.highlightHandler.bind(this);
    }

    addVocab(korWord,engWord) {
        const newVocabList = this.state.vocabList.slice();
        newVocabList.push({'korWord':korWord, 'engWord': engWord});
        this.setState({vocabList: newVocabList}); 
    }

    onProceedHandler() {
        this.setState({active: true});
    }

    highlightHandler(newHighlightList) {
        this.setState({highlightList: newHighlightList});
    }

    render() {
        const { topic, active, vocabList, highlightList, topicList } = this.state;
        // console.log(active);
        const _active = true; // For debugging
        return (
            <div className="mainscreen row">
                {
                    topic ?
                    (active ? <Chatbot topic={topic} vocabList={vocabList} highlightHandler={this.highlightHandler}/> : <ActivityBox topic={topic} addVocab={this.addVocab} onProceedHandler={this.onProceedHandler}/>)
                    :
                    <div className="container chatbot col-8 text-center" style={{width: '80%', paddingTop:'10%'}}>
                            <h2 style={{fontWeight: '400'}}>대화를 나눌 주제를 골라주세요.</h2>
                            {
                                topicList.map((idx, value)=> (
                                    <p>
                                        <Button className="large" primary value={idx} onClick={() => this.setState({topic:idx})} style={{width: "150px"}}>
                                            {idx}
                                        </Button>
                                    </p>
                            ))}
                    </div>
                }
                <Sidebox vocabList={vocabList} highlightList={highlightList}/>
            </div>
        )
    }
}

export default MainScreen
