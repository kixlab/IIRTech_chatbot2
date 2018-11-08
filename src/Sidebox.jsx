import React from 'react'
import './Sidebox.css';
import VocabList from './sidebox-components/VocabList';
import 'semantic-ui-css/semantic.min.css';
import { Table } from 'semantic-ui-react';

class Sidebox extends React.Component {
    render() {
        const { vocabList, highlightList } = this.props;
        return (
            <div className='sidebox col-4'>
                <div className="table-wrapper vocab-list">
                    <div className="table-title text-center">Vocabulary List</div>
                    <VocabList vocabList={vocabList} highlightList={highlightList}/>
                </div>
                <div className="correction-guide">
                    <div className="table-wrapper">
                        <div className="table-title text-center">Error Legend</div>
                        <Table celled>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell className="spelling">
                                        Spelling
                                    </Table.Cell>
                                        
                                    <Table.Cell className="spacing">
                                        Spacing
                                    </Table.Cell>

                                    <Table.Cell className="incorrect-vocab">
                                        Incorrect Word
                                    </Table.Cell>

                                    <Table.Cell className="statistical-correction">
                                        Statistical Correction
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            </div>
        )
    }
}

export default Sidebox