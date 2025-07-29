import React from 'react'
import { connect } from 'react-redux'
import DeleteModel from '../../shared/action-buttons/DeleteModel'
import { deleteAssistanceCategory } from '../../store/action/assistanceCategoriesAction'
import { getFormattedMessage } from '../../shared/sharedMethod'

export const DeleteAssistancesCategories = (props) => {
    const { deleteAssistanceCategory, onDelete, deleteModel, onClickDeleteModel } = props;

    const deleteClick = () => {
        console.log('Deleting assistance category with ID:', onDelete);

        // Enhanced error handling
        if (!onDelete) {
            console.error('No assistance category ID provided for deletion');
            onClickDeleteModel(false);
            return;
        }

        const assistanceCategoryId = typeof onDelete === 'object' ? onDelete.id : onDelete;

        if (!assistanceCategoryId) {
            console.error('Invalid assistance category ID:', onDelete);
            onClickDeleteModel(false);
            return;
        }

        try {
            deleteAssistanceCategory(assistanceCategoryId);
            onClickDeleteModel(false);
            console.log('Assistance category deletion initiated for ID:', assistanceCategoryId);
        } catch (error) {
            console.error('Error deleting assistance category:', error);
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
                    name={getFormattedMessage("assistancesCategory.delete.confirmation") || "Are you sure you want to delete this assistance category?"}
                />
            )}
        </div>
    );
};


export default connect(null, { deleteAssistanceCategory })(DeleteAssistancesCategories)
