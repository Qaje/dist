import React from 'react';
import {connect} from 'react-redux';
import {deleteSupplier} from '../../store/action/supplierAction';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import {getFormattedMessage} from '../../shared/sharedMethod';

const DeleteSupplier = (props) => {
    const {deleteSupplier, onDelete, deleteModel, onClickDeleteModel} = props;

    const deleteClick = () => {
        deleteSupplier(onDelete.id);
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                                         deleteClick={deleteClick} name={getFormattedMessage('supplier.title')} />}
        </div>
    )
};

export default connect(null, {deleteSupplier})(DeleteSupplier);
