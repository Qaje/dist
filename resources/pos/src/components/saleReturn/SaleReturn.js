import React, { useEffect, useState } from "react";
import moment from "moment";
import { connect } from "react-redux";
import MasterLayout from "../MasterLayout";
import TabTitle from "../../shared/tab-title/TabTitle";
import ReactDataTable from "../../shared/table/ReactDataTable";
import DeleteSaleReturn from "./DeleteSaleReturn";
import { fetchSalesReturn } from "../../store/action/salesReturnAction";
import {
    currencySymbolHandling,
    getFormattedDate,
    getFormattedMessage,
    placeholderText,
} from "../../shared/sharedMethod";
import { fetchFrontSetting } from "../../store/action/frontSettingAction";
import ActionDropDownButton from "../../shared/action-buttons/ActionDropDownButton";
import { downloadSaleReturnPdf } from "../../store/action/downloadSaleReturnPdfAction";
import ShowPayment from "../../shared/showPayment/ShowPayment";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";

const SaleReturn = (props) => {
    const {
        salesReturn,
        fetchSalesReturn,
        totalRecord,
        isLoading,
        frontSetting,
        fetchFrontSetting,
        downloadSaleReturnPdf,
        allConfigData,
        isCallFetchDataApi
    } = props;
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [isShowPaymentModel, setIsShowPaymentModel] = useState(false);

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    const currencySymbol =
        frontSetting &&
        frontSetting.value &&
        frontSetting.value.currency_symbol;

    const onShowPaymentClick = () => {
        setIsShowPaymentModel(!isShowPaymentModel);
    };

    const onChange = (filter) => {
        fetchSalesReturn(filter, true);
    };

    const goToEdit = (item) => {
        const id = item.id;
        window.location.href = "#/user/sale-return/edit/" + id;
    };

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const onPdfClick = (id) => {
        downloadSaleReturnPdf(id);
    };

    const goToDetailScreen = (id) => {
        window.location.href = "#/user/sale-return/detail/" + id;
    };

    const itemsValue =
        currencySymbol &&
        salesReturn.length >= 0 &&
        salesReturn.map((sale) => ({
            created_at: getFormattedDate(
                sale.attributes.date,
                allConfigData && allConfigData
            ),
            time: moment(sale.attributes.created_at).format("LT"),
            reference_code: sale.attributes.reference_code,
            customer_name: sale.attributes.customer_name,
            warehouse_name: sale.attributes.warehouse_name,
            status: sale.attributes.status,
            grand_total: sale.attributes.grand_total,
            id: sale.id,
            currency: currencySymbol,
        }));

    const columns = [
        {
            name: getFormattedMessage("globally.detail.reference"),
            sortField: "reference_code",
            sortable: false,
            cell: (row) => {
                return (
                    <span className="badge bg-light-danger">
                        <span>{row.reference_code}</span>
                    </span>
                );
            },
        },
        {
            name: getFormattedMessage("customer.title"),
            selector: (row) => row.customer_name,
            sortField: "customer_name",
            sortable: false,
        },
        {
            name: getFormattedMessage("warehouse.title"),
            selector: (row) => row.warehouse_name,
            sortField: "warehouse_name",
            sortable: false,
        },
        {
            name: getFormattedMessage("globally.detail.status"),
            sortField: "status",
            sortable: false,
            cell: (row) => {
                return (
                    (row.status === 1 && (
                        <span className="badge bg-light-success">
                            <span>
                                {getFormattedMessage(
                                    "status.filter.received.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.status === 2 && (
                        <span className="badge bg-light-primary">
                            <span>
                                {getFormattedMessage(
                                    "status.filter.pending.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.status === 3 && (
                        <span className="badge bg-light-warning">
                            <span>
                                {getFormattedMessage(
                                    "status.filter.ordered.label"
                                )}
                            </span>
                        </span>
                    ))
                );
            },
        },
        {
            name: getFormattedMessage("globally.detail.grand.total"),
            selector: (row) =>
                currencySymbolHandling(
                    allConfigData,
                    row.currency,
                    row.grand_total
                ),
            sortField: "grand_total",
            sortable: true,
        },
        {
            name: getFormattedMessage(
                "globally.react-table.column.created-date.label"
            ),
            selector: (row) => row.created_at,
            sortField: "created_at",
            sortable: true,
            cell: (row) => {
                return (
                    <span className="badge bg-light-info">
                        <div className="mb-1">{row.time}</div>
                        <div>{row.created_at}</div>
                    </span>
                );
            },
        },
        {
            name: getFormattedMessage("react-data-table.action.column.label"),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: (row) => (
                <ActionDropDownButton
                    item={row}
                    isEditMode={true}
                    isPdfIcon={true}
                    onClickDeleteModel={onClickDeleteModel}
                    onPdfClick={onPdfClick}
                    title={getFormattedMessage("sale-return.title")}
                    isViewIcon={true}
                    goToDetailScreen={goToDetailScreen}
                    onShowPaymentClick={onShowPaymentClick}
                    goToEditProduct={goToEdit}
                />
            ),
        },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("sales-return.title")} />
            <div className="sale_return_table">
                <ReactDataTable
                    columns={columns}
                    items={itemsValue}
                    to="#/user/sale-return/create"
                    isShowDateRangeField
                    onChange={onChange}
                    totalRows={totalRecord}
                    goToEdit={goToEdit}
                    isLoading={isLoading}
                    isShowFilterField
                    isStatus
                    isCallFetchDataApi={isCallFetchDataApi}
                />
            </div>
            <DeleteSaleReturn
                onClickDeleteModel={onClickDeleteModel}
                deleteModel={deleteModel}
                onDelete={isDelete}
            />
            <ShowPayment
                onShowPaymentClick={onShowPaymentClick}
                isShowPaymentModel={isShowPaymentModel}
            />
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { salesReturn, totalRecord, isLoading, frontSetting, allConfigData, isCallFetchDataApi } =
        state;
    return { salesReturn, totalRecord, isLoading, frontSetting, allConfigData, isCallFetchDataApi };
};

export default connect(mapStateToProps, {
    fetchSalesReturn,
    fetchFrontSetting,
    downloadSaleReturnPdf,
})(SaleReturn);
