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
            highlightList: [],
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
        const { active, vocabList, highlightList } = this.state;
        console.log(active);
        const _active = true; // For debugging
        return (
            <div className="mainscreen row">
                {_active ? <Chatbot vocabList={vocabList} highlightHandler={this.highlightHandler}/> : <ActivityBox addVocab={this.addVocab} onProceedHandler={this.onProceedHandler}/>}
                <Sidebox vocabList={vocabList} highlightList={highlightList}/>
            </div>
        )
    }
}

export default MainScreen
