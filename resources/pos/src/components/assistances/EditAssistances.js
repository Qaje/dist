import React from 'react'
import { connect } from 'react-redux';
import AssistanceForm from './AssistancesForm'
import { getFormattedMessage } from '../../shared/sharedMethod';

const EditAssistances = (props) => {
    const { handleClose, show, assistance } = props;

    return (
        <>
            {assistance &&
                <AssistanceForm handleClose={handleClose} show={show} singleAssistance={assistance}
                    title={getFormattedMessage('assistances.edit.title')} />
            }
        </>
    )
}

export default connect()(EditAssistances)
