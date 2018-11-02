import React from 'react';
import './ChoiceMessage.css';
import 'semantic-ui-css/semantic.min.css';

class ChoiceMessage extends React.Component {
    render() {
        const done = this.props.done;
        const chosen = this.props.chosen;
        return(
        <div className="row justify-content-center">
            <button type="button" className={
                done?
                    chosen===0?
                    "btn btn-select btn-primary btn-chosen disabled"
                    :
                    "btn btn-select btn-primary disabled"
                :
                "btn btn-select btn-primary"
            }
            onClick={() => (!done && this.props.handleClick('p'))}>
                네
            </button>
            <button type="button" className={
                done?
                    chosen===1?
                    "btn btn-select btn-primary btn-chosen disabled"
                    :
                    "btn btn-select btn-primary disabled"
                :
                "btn btn-select btn-primary"
            }
            onClick={() => (!done && this.props.handleClick('f'))}>
                아니요
            </button>
            
        </div>
        )
  }
}

export default ChoiceMessage;
