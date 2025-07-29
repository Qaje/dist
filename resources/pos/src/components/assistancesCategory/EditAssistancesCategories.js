import React from 'react'
import { connect } from 'react-redux';
import AssistanceCategoriesForm from './AssistanceCategoriesForm';
import { getFormattedMessage } from '../../shared/sharedMethod';

const EditAssistanceCategories = (props) => {
    const { handleClose, show, assistance } = props;

    return (
        <>
            {assistance &&
                <AssistanceCategoriesForm handleClose={handleClose} show={show} singleAssistance={assistance}
                    title={getFormattedMessage('assistances.edit.title')} />
            }
        </>
    )
}

export default connect()(EditAssistanceCategories)
