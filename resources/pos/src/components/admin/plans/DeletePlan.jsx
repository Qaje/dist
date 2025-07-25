import React from 'react';
import { connect } from 'react-redux';
import DeleteModel from '../../../shared/action-buttons/DeleteModel';
import { getFormattedMessage } from '../../../shared/sharedMethod';
import { deletePlan } from '../../../store/action/admin/plansAction';

const DeletePlan = (props) => {
    const { deletePlan, onDelete, deleteModel, onClickDeleteModel } = props;

    const deletePlanClick = () => {
        deletePlan(onDelete.id);
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                deleteClick={deletePlanClick} name={getFormattedMessage('plan.title')} />}
        </div>
    )
};

export default connect(null, { deletePlan })(DeletePlan);
