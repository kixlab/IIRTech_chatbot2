import React from 'react'
//import './MainScreen.css'
import Chatbot from './Chatbot'
import Sidebox from './Sidebox'


class MainScreen extends React.Component {
    render() {
        return (
            <div className="mainscreen row">
                <Chatbot />
                <Sidebox />
            </div>
        )
    }
}

export default MainScreen
