import React from 'react'
import { connect } from 'react-redux';
import AssistanceForm from './AssistancesForm'
import { getFormattedMessage } from '../../shared/sharedMethod';

const EditAssistances = (props) => {
    const {
        handleClose,
        show,
        assistance,
        categories = [],
        saleUnits = [], // Nuevo prop
        onSubmitSuccess
    } = props;

    return (
        <>
            {assistance &&
                <AssistanceForm
                    handleClose={handleClose}
                    show={show}
                    singleAssistance={assistance}
                    categories={categories} // Pasar categorías
                    saleUnits={saleUnits} // Pasar sale units
                    onSubmitSuccess={onSubmitSuccess}
                    title={getFormattedMessage('assistances.edit.title')}
                />
            }
        </>
    )
}

export default connect()(EditAssistances)
