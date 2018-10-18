import React from 'react'
//import './MainScreen.css'
import Chatbot from './Chatbot'
import Sidebox from './Sidebox'
import ActivityBox from './chatbot-activity/ActivityBox'


class MainScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            vocabList: [],
        }
        this.addVocab = this.addVocab.bind(this);
        this.onProceedHandler = this.onProceedHandler.bind(this);
    }

    addVocab(korWord,engWord) {
        const newVocabList = this.state.vocabList.slice();
        newVocabList.push({'korWord':korWord, 'engWord': engWord});
        this.setState({vocabList: newVocabList});
    }

    onProceedHandler() {
        this.setState({active: true});
    }

    render() {
        const { active, vocabList } = this.state;
        console.log(active);
        return (
            <div className="mainscreen row">
                {active ? <Chatbot /> : <ActivityBox addVocab={this.addVocab} onProceedHandler={this.onProceedHandler}/>}
                <Sidebox vocabList={vocabList}/>
            </div>
        )
    }
}

export default MainScreen
