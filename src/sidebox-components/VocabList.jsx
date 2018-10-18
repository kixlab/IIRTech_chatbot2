import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Table } from 'semantic-ui-react';
class VocabList extends React.Component {
    render() {
        const { vocabList } = this.props;
        return (
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>한글</Table.HeaderCell>
                        <Table.HeaderCell>영어</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {Object.keys(vocabList).map((value,index) =>
                        <Table.Row>
                            <Table.Cell>
                                {vocabList[value]['korWord']}
                            </Table.Cell>
                            <Table.Cell>
                                {vocabList[value]['engWord']}
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        )
    }
}

export default VocabList;