import React from 'react';
import {connect} from 'react-redux';
import {deleteBaseUnit} from '../../store/action/baseUnitsAction';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import {getFormattedMessage} from '../../shared/sharedMethod';

const DeleteBaseUnits = (props) => {
    const {deleteBaseUnit, onDelete, deleteModel, onClickDeleteModel} = props;

    const deleteClick = () => {
        deleteBaseUnit(onDelete.id);
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                                         deleteClick={deleteClick} name={getFormattedMessage('base-unit.title')}/>}
        </div>
    )
};

export default connect(null, {deleteBaseUnit})(DeleteBaseUnits);
