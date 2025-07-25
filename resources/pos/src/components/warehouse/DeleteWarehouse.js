import React from 'react';
import {connect} from 'react-redux';
import {deleteWarehouse} from '../../store/action/warehouseAction';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import {getFormattedMessage} from '../../shared/sharedMethod';

const DeleteWarehouse = (props) => {
    const {deleteWarehouse, onDelete, deleteModel, onClickDeleteModel} = props;

    const deleteClick = () => {
        deleteWarehouse(onDelete.id);
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                                         deleteClick={deleteClick} name={getFormattedMessage('warehouse.title')}/>}
        </div>
    )
};

export default connect(null, {deleteWarehouse})(DeleteWarehouse);
