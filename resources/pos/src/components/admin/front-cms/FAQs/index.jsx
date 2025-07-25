import React, { useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import MasterLayout from '../../../MasterLayout'
import TopProgressBar from '../../../../shared/components/loaders/TopProgressBar'
import TabTitle from '../../../../shared/tab-title/TabTitle'
import ReactDataTable from '../../../../shared/table/ReactDataTable'
import { getFormattedMessage, placeholderText } from '../../../../shared/sharedMethod'
import ActionButton from '../../../../shared/action-buttons/ActionButton'
import CreateFAQs from './CreateFAQs'
import DetailsFAQs from './FAQsDetails'
import EditFAQs from './EditFAQ'
import DeleteFAQs from './DeleteFAQs'
import { fetchFrontCMS } from '../../../../store/action/admin/frontCMS/frontCMSAction'
import { adminActionType, adminApiBaseURL } from '../../../../constants'

const FAQs = ({ totalRecord, isLoading }) => {
    const dispatch = useDispatch();
    const FAQs = useSelector((state) => state.frontCMS);

    const [localItemsValue, setLocalItemsValue] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEdiModal, setShowEditModal] = useState(false);
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [editData, setEditData] = useState();

    useEffect(() => {
        if (FAQs.length >= 0) {
            const mappedFAQs = FAQs.map((faq) => ({
                title: faq?.attributes?.title,
                description: faq?.attributes?.description,
                id: faq?.id,
            }));
            setLocalItemsValue(mappedFAQs);
        }
    }, [FAQs]);

    const onChange = (filter) => {
        dispatch(fetchFrontCMS(adminApiBaseURL.FRONT_CMS_FAQS, adminActionType.FETCH_FAQS, filter, true));
    };

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const goToEditFAQs = (data) => {
        setEditData(data);
        setShowEditModal(true);
    };

    const showFAQs = (data) => {
        setEditData(data);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setShowEditModal(false);
    };

    const columns = [
        {
            name: getFormattedMessage("front-cms.table.column.title"),
            selector: (row) => row?.title,
            className: "",
            sortField: "title",
            sortable: true,
        },
        {
            name: getFormattedMessage("front-cms.description.title"),
            selector: (row) => <div className='ellipsis'>
                {row?.description}
            </div>,
            sortField: "description",
            sortable: true,
        },
        {
            name: getFormattedMessage("react-data-table.action.column.label"),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "120px",
            cell: (row) => (
                <ActionButton
                    isViewIcon={true}
                    goToDetailScreen={() => showFAQs(row)}
                    item={row}
                    goToEditProduct={() => goToEditFAQs(row)}
                    isEditMode={true}
                    onClickDeleteModel={onClickDeleteModel}
                />
            ),
        },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("front-cms.faqs.title")} />
            <ReactDataTable
                columns={columns}
                items={localItemsValue}
                onChange={onChange}
                isLoading={isLoading}
                totalRows={totalRecord}
                isShowSearch
                AddButton={<CreateFAQs />}
            />
            {showModal && (
                <DetailsFAQs data={editData} show={showModal} handleClose={handleCloseModal} />
            )}
            {showEdiModal && (
                <EditFAQs data={editData} show={showEdiModal} handleClose={handleCloseModal} />
            )}

            <DeleteFAQs onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                onDelete={isDelete} />

        </MasterLayout>
    )
}

const mapStateToProps = (state) => {
    const { totalRecord, isLoading } = state;
    return { totalRecord, isLoading };
};

export default connect(mapStateToProps)(FAQs);