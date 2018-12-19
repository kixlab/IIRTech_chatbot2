import React from 'react'
//import './MainScreen.css'
import Chatbot from './Chatbot'
import Sidebox from './Sidebox'
import ActivityBox from './chatbot-activity/ActivityBox'
import { Button } from 'semantic-ui-react';
import { BASE_URL } from './configs/costants';

// MainScreen component renders all the components at the top-level
// Initially, the component renders a list of topics from which users are asked to choose one topic.
// Two major components are rendered on its condition:
// 1) ActivityBox
// 2) Chatbot
// Please refer further to each component to get more information.

class MainScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false, // boolean - active checks whether the activitiy is completed on the selected topic
            vocabList: [], // list of string - vocabulary list of the selected topic
            highlightList: [],
            topic: "NOT_SELECTED", // string - the selected topic / NOT_SELECTED if none of the topic is yet selected
            topicList: ['영화관', '여행', '건강', '3급 일상생활', '3급 건강', '3급 교통', '3급 여행']
        }
        this.addVocab = this.addVocab.bind(this);
        this.onProceedHandler = this.onProceedHandler.bind(this);
        this.highlightHandler = this.highlightHandler.bind(this);
    }

    componentDidMount() {
        fetch(`${BASE_URL}/iirtech/fetchTopic`, {"Access-Control-Allow-Origin":"*"})
        .then(res => res.json())
        .then(response => this.setState({topicList:response['topics']}))
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
        return (
            <div className="mainscreen row">
                {
                    topic !== 'NOT_SELECTED' ?
                    (active ? <Chatbot topic={topic} vocabList={vocabList} highlightHandler={this.highlightHandler}/> : <ActivityBox topic={topic} addVocab={this.addVocab} onProceedHandler={this.onProceedHandler}/>)
                    :
                    <div className="container chatbot col-8 text-center" style={{width: '80%', paddingTop:'10%'}}>
                            <h2 style={{fontWeight: '400'}}>대화를 나눌 주제를 골라주세요.</h2>
                            {
                                topicList.map((value)=> (
                                    <p>
                                        <Button className="large" primary key={value} value={value} onClick={() => this.setState({topic:value})} style={{width: "150px"}}>
                                            {value}
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
