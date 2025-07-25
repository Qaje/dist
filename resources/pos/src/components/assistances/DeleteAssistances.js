import React from 'react';
import { connect } from 'react-redux';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import { deleteAssistance } from '../../store/action/asistancesAction';
import { getFormattedMessage } from '../../shared/sharedMethod';

const DeleteAssistances = (props) => {
    const { deleteAssistance, onDelete, deleteModel, onClickDeleteModel } = props;

    const deleteClick = () => {
        console.log('Deleting assistance with ID:', onDelete);

        // Enhanced error handling
        if (!onDelete) {
            console.error('No assistance ID provided for deletion');
            onClickDeleteModel(false);
            return;
        }

        // Handle both object and direct ID
        const assistanceId = typeof onDelete === 'object' ? onDelete.id : onDelete;

        if (!assistanceId) {
            console.error('Invalid assistance ID:', onDelete);
            onClickDeleteModel(false);
            return;
        }

        try {
            deleteAssistance(assistanceId);
            onClickDeleteModel(false);
            console.log('Assistance deletion initiated for ID:', assistanceId);
        } catch (error) {
            console.error('Error deleting assistance:', error);
            onClickDeleteModel(false);
        }
    };

    return (
        <div>
            {deleteModel && (
                <DeleteModel
                    onClickDeleteModel={onClickDeleteModel}
                    deleteModel={deleteModel}
                    deleteClick={deleteClick}
                    name={getFormattedMessage("assistances.delete.confirmation") || "Are you sure you want to delete this assistance?"}
                />
            )}
        </div>
    );
};

export default connect(null, { deleteAssistance })(DeleteAssistances);
