import React from 'react'
import './Sidebox.css';
import VocabList from './sidebox-components/VocabList';

class Sidebox extends React.Component {
    render() {
        const { vocabList, highlightList } = this.props;
        return (
            <div className='sidebox col-4'>
                <div className="table-wrapper">
                    <div className="table-title text-center">Vocabulary List</div>
                    <VocabList vocabList={vocabList} highlightList={highlightList}/>
                </div>
            </div>
        )
    }
}

export default Sidebox